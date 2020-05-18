"""
    Core logic for the codenames app
"""

import os
import json
import boto3

CONNECTIONS_TABLE = boto3.resource('dynamodb').Table(os.environ['CONNECTIONS_TABLE'])
ROOMS_TABLE = boto3.resource('dynamodb').Table(os.environ['ROOMS_TABLE'])

DESERIALIZER = boto3.dynamodb.types.TypeDeserializer()

def connect(event, _):
    """ Connect handler """
    connection_id = event['requestContext']['connectionId']
    CONNECTIONS_TABLE.put_item(Item={'connection_id': connection_id})
    return {
        'statusCode': 200,
    }


def disconnect(event, _):
    """ Disconnect handler """
    connection_id = event['requestContext']['connectionId']
    _leave_current_room(connection_id)

    CONNECTIONS_TABLE.delete_item(Key={'connection_id': connection_id})
    return {
        'statusCode': 200,
    }


def join_room(event, _):
    """ Join a room """
    data = json.loads(event['body'])
    state = data['state']
    room = data['room']
    connection_id = event['requestContext']['connectionId']

    _leave_current_room(connection_id)

    callback_url = "https://{domain}/{stage}".format(
        domain=event['requestContext']['domainName'],
        stage=event['requestContext']['stage']
    )

    resp = ROOMS_TABLE.get_item(Key={'room': room})


    item = resp.get('Item')
    if item and item.get('connections'):
        if connection_id not in item['connections']:
            item['connections'].add(connection_id)
    else:
        item = {
            'room': room,
            'state': state,
            'connections': {connection_id},
            'callback': callback_url
        }

    ROOMS_TABLE.put_item(Item=item)
    CONNECTIONS_TABLE.put_item(Item={
        'connection_id': connection_id,
        'room': room,
    })

    return {
        'statusCode': 200,
    }


def broadcast_room_changes(event, _):
    """ Broadcasts room changes """
    for record in event['Records']:
        try:
            if 'NewImage' not in record['dynamodb']:
                continue
            item = {
                k: DESERIALIZER.deserialize(v)
                for k, v in record['dynamodb']['NewImage'].items()
            }
            state = item['state']
            callback = item['callback']
            room = item['room']
            connections = item.get('connections', set())

            if not connections:
                ROOMS_TABLE.delete_item(Key={'room': room})
                continue

            socket = _get_socket_client(callback)
            for connection_id in connections:
                try:
                    socket.post_to_connection(
                        ConnectionId=connection_id,
                        Data=json.dumps(state)
                    )
                except socket.exceptions.GoneException:
                    print(
                        'Connection {connection_id} no longer exists'
                        .format(connection_id=connection_id)
                    )
        except Exception as e:
            print(e)



def update_room(event, _):
    """ Update the room state """
    data = json.loads(event['body'])
    room = data['room']
    state = data['state']
    ROOMS_TABLE.update_item(
        Key={'room': room},
        UpdateExpression="set #k = :v",
        ExpressionAttributeValues={
            ':v': state,
        },
        ExpressionAttributeNames={
            "#k": "state"
        }
    )

    return {
        'statusCode': 200,
    }


def _leave_current_room(connection_id):
    resp = CONNECTIONS_TABLE.get_item(Key={'connection_id': connection_id})
    item = resp.get('Item')
    if item and 'room' in item:
        ROOMS_TABLE.update_item(
            Key={'room': item['room']},
            UpdateExpression="delete connections :v",
            ExpressionAttributeValues={
                ':v': {connection_id},
            },
        )



def _get_socket_client(callback):
    return boto3.client(
        'apigatewaymanagementapi',
        region_name='us-east-1',
        endpoint_url=callback
    )


import React from 'react';
import ReactDom from 'react-dom';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import sortBy from 'lodash.sortby';

import ReconnectingWebSocket from 'reconnecting-websocket';


const TERMS = ["AFRICA", "AGENT", "AIR", "ALIEN", "ALPS", "AMAZON", "AMBULANCE", "AMERICA", "ANGEL", "ANTARCTICA", "APPLE", "ARM", "ATLANTIS", "AUSTRALIA", "AZTEC", "BACK", "BALL", "BAND", "BANK", "BAR", "BARK", "BAT", "BATTERY", "BEACH", "BEAR", "BEAT", "BED", "BEIJING", "BELL", "BELT", "BERLIN", "BERMUDA", "BERRY", "BILL", "BLOCK", "BOARD", "BOLT", "BOMB", "BOND", "BOOM", "BOOT", "BOTTLE", "BOW", "BOX", "BRIDGE", "BRUSH", "BUCK", "BUFFALO", "BUG", "BUGLE", "BUTTON", "CALF", "CANADA", "CAP", "CAPITAL", "CAR", "CARD", "CARROT", "CASINO", "CAST", "CAT", "CELL", "CENTAUR", "CENTER", "CHAIR", "CHANGE", "CHARGE", "CHECK", "CHEST", "CHICK", "CHINA", "CHOCOLATE", "CHURCH", "CIRCLE", "CLIFF", "CLOAK", "CLUB", "CODE", "COLD", "COMIC", "COMPOUND", "CONCERT", "CONDUCTOR", "CONTRACT", "COOK", "COPPER", "COTTON", "COURT", "COVER", "CRANE", "CRASH", "CRICKET", "CROSS", "CROWN", "CYCLE", "CZECH", "DANCE", "DATE", "DAY", "DEATH", "DECK", "DEGREE", "DIAMOND", "DICE", "DINOSAUR", "DISEASE", "DOCTOR", "DOG", "DRAFT", "DRAGON", "DRESS", "DRILL", "DROP", "DUCK", "DWARF", "EAGLE", "EGYPT", "EMBASSY", "ENGINE", "ENGLAND", "EUROPE", "EYE", "FACE", "FAIR", "FALL", "FAN", "FENCE", "FIELD", "FIGHTER", "FIGURE", "FILE", "FILM", "FIRE", "FISH", "FLUTE", "FLY", "FOOT", "FORCE", "FOREST", "FORK", "FRANCE", "GAME", "GAS", "GENIUS", "GERMANY", "GHOST", "GIANT", "GLASS", "GLOVE", "GOLD", "GRACE", "GRASS", "GREECE", "GREEN", "GROUND", "HAM", "HAND", "HAWK", "HEAD", "HEART", "HELICOPTER", "HIMALAYAS", "HOLE", "HOLLYWOOD", "HONEY", "HOOD", "HOOK", "HORN", "HORSE", "HORSESHOE", "HOSPITAL", "HOTEL", "ICE", "ICE CREAM", "INDIA", "IRON", "IVORY", "JACK", "JAM", "JET", "JUPITER", "KANGAROO", "KETCHUP", "KEY", "KID", "KING", "KIWI", "KNIFE", "KNIGHT", "LAB", "LAP", "LASER", "LAWYER", "LEAD", "LEMON", "LEPRECHAUN", "LIFE", "LIGHT", "LIMOUSINE", "LINE", "LINK", "LION", "LITTER", "LOCH NESS", "LOCK", "LOG", "LONDON", "LUCK", "MAIL", "MAMMOTH", "MAPLE", "MARBLE", "MARCH", "MASS", "MATCH", "MERCURY", "MEXICO", "MICROSCOPE", "MILLIONAIRE", "MINE", "MINT", "MISSILE", "MODEL", "MOLE", "MOON", "MOSCOW", "MOUNT", "MOUSE", "MOUTH", "MUG", "NAIL", "NEEDLE", "NET", "NEW YORK", "NIGHT", "NINJA", "NOTE", "NOVEL", "NURSE", "NUT", "OCTOPUS", "OIL", "OLIVE", "OLYMPUS", "OPERA", "ORANGE", "ORGAN", "PALM", "PAN", "PANTS", "PAPER", "PARACHUTE", "PARK", "PART", "PASS", "PASTE", "PENGUIN", "PHEONIX", "PIANO", "PIE", "PILOT", "PIN", "PIPE", "PIRATE", "PISTOL", "PIT", "PITCH", "PLANE", "PLASTIC", "PLATE", "PLATYPUS", "PLAY", "PLOT", "POINT", "POISON", "POLE", "POLICE", "POOL", "PORT", "POST", "POUND", "PRESS", "PRINCESS", "PUMPKIN", "PUPIL", "PYRAMID", "QUEEN", "RABBIT", "RACKET", "RAY", "REVOLUTION", "RING", "ROBIN", "ROBOT", "ROCK", "ROME", "ROOT", "ROSE", "ROULETTE", "ROUND", "ROW", "RULER", "SATELLITE", "SATURN", "SCALE", "SCHOOL", "SCIENTIST", "SCORPION", "SCREEN", "SCUBA DIVER", "SEAL", "SERVER", "SHADOW", "SHAKESPEARE", "SHARK", "SHIP", "SHOE", "SHOP", "SHOT", "SINK", "SKYSCRAPER", "SLIP", "SLUG", "SMUGGLER", "SNOW", "SNOWMAN", "SOCK", "SOLDIER", "SOUL", "SOUND", "SPACE", "SPELL", "SPIDER", "SPIKE", "SPINE", "SPOT", "SPRING", "SPY", "SQUARE", "STADIUM", "STAFF", "STAR", "STATE", "STICK", "STOCK", "STRAW", "STREAM", "STRIKE", "STRING", "SUB", "SUIT", "SUPERHERO", "SWING", "SWITCH", "TABLE", "TABLET", "TAG", "TAIL", "TAP", "TEACHER", "TELESCOPE", "TEMPLE", "THEATER", "THIEF", "THUMB", "TICK", "TIE", "TIME", "TOKYO", "TOOTH", "TORCH", "TOWER", "TRACK", "TRAIN", "TRIANGLE", "TRIP", "TRUNK", "TUBE", "TURKEY", "UNDERTAKER", "UNICORN", "VACUUM", "VAN", "VET", "WAKE", "WALL", "WAR", "WASHER", "WASHINGTON", "WATCH", "WATER", "WAVE", "WEB", "WELL", "WHALE", "WHIP", "WIND", "WITCH", "WORM", "YARD"];


const ws = new ReconnectingWebSocket("wss://imht88k641.execute-api.us-east-1.amazonaws.com/prod");

// ============================================================================
// LOGIC
// ============================================================================

function createColors(startColor) {
  const tiles = [startColor];

  for (let i = 0; i < 8; i++) {
    tiles.push("red");
  }

  for (let _i = 0; _i < 8; _i++) {
    tiles.push("blue");
  }

  tiles.push("black");

  for (let _i2 = 0; _i2 < 7; _i2++) {
    tiles.push("grey");
  }

  return shuffle(tiles);
}

function createTiles() {
  return shuffle(TERMS).map(function (t) {
    return {
      term: t,
      covered: false,
      color: "red"
    };
  });
}

function shuffle(a) {
  let j, x, i;

  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }

  return a;
}

function generateData(previous) {
  const previousTerms = previous ? previous.reduce(function (c, n) {
    c[n.term] = true;
    return c;
  }, {}) : {};
  const startColor = ["blue", "red"][Math.round(Math.random())];
  const colors = createColors(startColor);
  const tiles = createTiles().filter(function (t) {
    return !previousTerms[t.term];
  }).slice(0, 25).map(function (t, i) {
    return Object.assign({}, t, {
      color: colors[i]
    });
  });
  return {
    tiles: tiles,
    startColor: startColor
  };
}


// ============================================================================
// COMPONENTS
// ============================================================================


class CodeMasterColumn extends React.Component {

  render() {

    const color = this.props.tiles[0].color;
    return <div className="col col-sm-3">
      <div
        className="ml-1"
        style={{
          backgroundColor: 'lightgrey',
          borderRadius: "5px",
          boxShadow: "5px 5px 5px rgba(0,0,0,.3)",
          fontWeight: 'bold',
          padding: 10
        }}
      >
        <h4
          style={{
            color: color,
            textAlign: 'center'
          }}
        >
          {this.props.title}
        </h4>
        <ul
          className="list-unstyled"
          style={{
            paddingLeft: 15
          }}
        >
          {
            sortBy(this.props.tiles, ['covered', 'term']).map((t, i) =>
              <li
                key={i}
                style={{
                  marginTop: 8,
                  cursor: 'pointer',
                  textDecoration: t.covered ? 'line-through' : 'none',
                  color: t.covered ? 'grey' : 'black'
                }}
                onClick={() => this.props.toggleCovered(t.term)}
              >
                {t.term}
              </li>
            )
          }
        </ul>
      </div>
    </div>
  }
}

class CodeMasterList extends React.Component {
  render() {
    return <div
      className="row"
      style={{
        textAlign: 'left'
      }}
    >
      <CodeMasterColumn
        title="RED"
        tiles={this.props.tiles.filter(t => t.color === 'red')}
        toggleCovered={this.props.toggleCovered}
      />
      <CodeMasterColumn
        title="NEUTRAL"
        tiles={this.props.tiles.filter(t => t.color === 'grey')}
        toggleCovered={this.props.toggleCovered}
      />
      <CodeMasterColumn
        title="BLUE"
        tiles={this.props.tiles.filter(t => t.color === 'blue')}
        toggleCovered={this.props.toggleCovered}
      />
      <CodeMasterColumn
        title="ASSASSIN"
        tiles={this.props.tiles.filter(t => t.color === 'black')}
        toggleCovered={this.props.toggleCovered}
      />
    </div>
  }
}


class Tile extends React.Component {
  render() {
    return <div
      style={{
        backgroundColor: this.props.covered ? this.props.color : "lightgrey",
        width: "120px",
        cursor: "pointer",
        height: "60px",
        display: "inline-block",
        userSelect: "none",
        margin: "5px",
        padding: "5px",
        textAlign: "center",
        color: this.props.covered ? "white" : "black",
        fontWeight: "bold",
        borderRadius: "5px",
        boxShadow: "5px 5px 5px rgba(0,0,0,.3)",
        border: this.props.masterMode ? "5px solid " + this.props.color : null
      }}
      onClick={() => this.props.toggleCovered(this.props.term)}
    >
      {this.props.term}
    </div>
  }
}



function TileRow(props) {
  return <div>
    {props.tiles.map((t, i) =>
      <Tile
        key={i}
        term={t.term}
        color={t.color}
        covered={t.covered}
        toggleCovered={props.toggleCovered}
        masterMode={props.masterMode}
      />
    )}
  </div>
}


class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomState: generateData(),
      masterView: 'grid'
    }
    ws.onmessage = event => this.setState({
      roomState: JSON.parse(event.data)
    });
  }

  joinRoom() {
    let room = this.state.roomInput;
    if (room && room.length > 0) {
      room = room.toUpperCase();
      this.setState({
        room: room
      });
      ws.send(JSON.stringify({
        action: "joinRoom",
        room: room,
        state: this.state.roomState
      }));
      alert("Joined Room: " + room);
    }
  }

  updateRoomState(roomState) {
    if (this.state.room) {
      ws.send(JSON.stringify({
        action: "updateRoom",
        room: this.state.room,
        state: roomState
      }));
    }

    this.setState({
      roomState: roomState
    });
  }
  toggleCovered(term) {
    this.updateRoomState({
      ...this.state.roomState,
      ...{
        tiles: this.state.roomState.tiles.map(t =>
          t.term === term
          ? {...t, ...{covered: !t.covered}}
          : t
        )
      }
    });
  }

  resetRoom() {
    const confirmed = confirm(
      "Are you sure you want to cancel the game and clear everything?"
    );

    if (confirmed) {
      this.updateRoomState(generateData(this.state.roomState.tiles));
    }
  }

  toggleMasterMode() {
    if (
      this.state.masterMode
      || confirm("Are you sure you want to turn on the Codemaster Mode?")
    ) {
      this.setState({
        masterMode: !this.state.masterMode
      });
    }
  }

  setMasterView(view) {
    this.setState({
      masterView: view
    });
  }

  render() {

    const startColor = this.state.roomState && this.state.roomState.startColor;
    const tiles = this.state.roomState && this.state.roomState.tiles;
    const rows = [];

    if (tiles) {
      for (let i = 0; i < 5; i++) {
        rows.push(
          <TileRow
            tiles={tiles.slice(i * 5, i * 5 + 5)}
            toggleCovered={this.toggleCovered.bind(this)}
            masterMode={this.state.masterMode}
            key={i}
          />
        );
      }
    }
    return <div
      style={{
        padding: "20px",
        minWidth: '730px',
        marginTop: '30px',
        backgroundColor: 'rgb(175, 175, 175)',
        boxShadow: '5px 2px 20px 0px'
      }}
    >
      <div
        className='text-center'
      >
        {
          startColor
          ? <h3>
              <span style={{color: startColor}}>
                {startColor.toUpperCase()} Starts
              </span>
            </h3>
          : null
        }
        {this.state.room ? <h3>Room {this.state.room}</h3> : null}
        {
          this.state.masterMode
          ? <div>
            <button
              onClick={() => this.setMasterView('grid')}
              disabled={this.state.masterView == 'grid'}
              className='btn btn-dark mr-1'
            >
              <i className='fa fa-th'/>
            </button>
            <button
              onClick={() => this.setMasterView('list')}
              disabled={this.state.masterView == 'list'}
              className='btn btn-dark mr-1'
            >
              <i className='fa fa-list'/>
            </button>
          </div>
          : null
        }
        <div className='p-3'>
          {
            this.state.masterMode && this.state.masterView == 'list'
            ? <CodeMasterList
              tiles={tiles}
              toggleCovered={this.toggleCovered.bind(this)}
            />
            : rows
          }
          <button
            className='btn btn-dark mr-1'
            onClick={this.toggleMasterMode.bind(this)}
          >
            Codemaster Mode
          </button>
          <button
            className='btn btn-danger mr-1'
            onClick={this.resetRoom.bind(this)}
          >
            Restart Game
          </button>
          <div
            className='form form-inline text-center'
            style={{
              display: 'inline-block'
            }}
          >
            <input
              type='text'
              className='form-control'
              onChange={e => this.setState({roomInput: e.target.value})}
            />
            <button
              className='btn btn-light mr-1'
              onClick={this.joinRoom.bind(this)}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  }

}

const domContainer = document.querySelector("#entrypoint");
ReactDom.render(<Container/>, domContainer);

///*#__PURE__*/_react.default.createElement("button", {
//         className: "btn btn-dark mr-1",
//         onClick: this.toggleMasterMode.bind(this)
//       }, "Toggle Codemaster Mode"), /*#__PURE__*/_react.default.createElement("button", {
//         className: "btn btn-danger mr-1",
//         onClick: this.resetRoom.bind(this)
//       }, "Restart Game"), /*#__PURE__*/_react.default.createElement("div", {
//         className: "form form-inline text-center",
//         style: {
//           display: 'inline-block'
//         }
//       }, /*#__PURE__*/_react.default.createElement("input", {
//         type: "text",
//         className: "form-control",
//         onChange: function onChange(e) {
//           return _this4.setState({
//             roomInput: e.target.value
//           });
//         }
//       }), /*#__PURE__*/_react.default.createElement("button", {
//         className: "btn btn-light mr-1",
//         onClick: this.joinRoom.bind(this)
//       }, "Join Room"))), /*#__PURE__*/_react.default.createElement("br", null));
//     }
//   }]);

//   return Container;
// }(_react.default.Component);

// var domContainer = document.querySelector("#entrypoint");
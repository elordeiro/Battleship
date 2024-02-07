// Gobal Variables ============================================================
let DEBUG = false;
const gridSize = 10; // grid is gridSize x gridSize cells
const numCells = gridSize * gridSize; // total number of cells
let player = { name: "", ships: [] }; // player object
let roomID = ""; // room object
let opponent = ""; // opponent object
let timedOut = false;
let oldRevisionId = -1;
let gameStarted = false; // true after 'Start Game' is clicked
// Sound and Visual effects ===================================================
const hitSound = new Audio("../sounds/hit.mp3");
const missSound = new Audio("../sounds/miss.mp3");
const image = new Image();
image.src = "../images/cell.png";
// Divs and containers ========================================================
const bothGrids = document.getElementById("both-grids");
const playerGrid = document.getElementById("player-grid");
const playerGridContainer = document.getElementById("player-grid-container");
const targetGrid = document.getElementById("opponent-grid");
const targetGridContainer = document.getElementById("target-grid-container");
const playingRoom = document.getElementById("playing-room");
const shipsDiv = document.getElementById("ships-div");
const playerShips = document.getElementById("player-ships");
const consoleOutput = document.getElementById("output-text");
const outputDiv = document.getElementById("output");
// Attack object to be sent to server
let Attack = {
    actionType: "PLAY",
    roomID: roomID,
    coordinates: {
        x: 0,
        y: 0,
    },
};
let AttackResult = {
    x: 0,
    y: 0,
    result: "MISS",
};
let pollData = {
    revisionId: -1,
    activePlayer: "",
    game_over: false,
    actionResult: "",
    shipSunkEvent: "",
    playerOneID: "",
    playerTwoID: "",
    winner: "",
    requestToJoin: false,
    actionXCord: 0,
    actionYCord: 0,
};
let selectedShip = {
    type: "none",
    length: 0,
    alignment: "horizontal",
    gridCell: 0,
};
let droppedShip = {
    type: "none",
    length: 0,
    alignment: "horizontal",
    gridCell: 0,
};
function Player(name) {
    this.name = name;
    this.ships = [];
}
function Ship(type, coordinates, alignment) {
    this.type = type;
    this.coordinates = coordinates;
    this.alignment = alignment;
}

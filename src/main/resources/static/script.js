// Gobal Variables ============================================================
let DEBUG = false;
const gridSize = 10; // grid is gridSize x gridSize cells
const numCells = gridSize * gridSize; // total number of cells
let selectedShip = null; // ship to be placed on grid
let selectedShipSize = 0; // size of selected ship (2-5)
let alignment = "horizontal"; // alignment of selected ship
let gameStarted = false; // true after 'Start Game' is clicked
let player = null; // player object
let roomID = -1; // room object
let opponent = null; // opponent object
let counter = 0; // counter for polling
let timedOut = false;

// Divs and containers ========================================================
let bothGrids = document.getElementById("both-grids");
let playerGrid = document.getElementById("player-grid");
let playerGridContainer = document.getElementById("player-grid-container");
let targetGrid = document.getElementById("opponent-grid");
let targetGridContainer = document.getElementById("target-grid-container");
let playingRoom = document.getElementById("playing-room");
let shipsDiv = document.getElementById("ships-div");
let playerShips = document.getElementById("player-ships");
let consoleOutput = document.getElementById("output-text");
let outputDiv = document.getElementById("output");

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
};
// ============================================================================

function Player(name) {
    this.name = name;
    this.ships = [];
}

function Ship(type, coordinates, alignment) {
    this.type = type;
    this.coordinates = coordinates;
    this.alignment = alignment;
}

// Helper functions ===========================================================

// Function to generate a unique player ID
function generatePlayerId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);

    return `${timestamp}-${random}`;
}

// Returns true if ship has been placed on grid
function wasSet(Ship) {
    if (Ship === null) {
        return false;
    }
    const ship = document.getElementById("player-ships" + "-" + Ship + "-" + 1);
    return ship.dataset.placed === "true";
}

// Returns true if ship overlaps with another ship
function overlaps(i, container) {
    if (alignment === "horizontal") {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + "-" + (i + j));
            if (cell.dataset.occupied === "true") {
                return true;
            }
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(
                container + "-" + (i + j * 10)
            );
            if (cell.dataset.occupied === "true") {
                return true;
            }
        }
    }
    return false;
}

// Returns true if a ship would fall out of bounds if placed at i
function shipOutOfBounds(i) {
    if (alignment === "horizontal") {
        if (((i - 1) % gridSize) + selectedShipSize > gridSize) {
            return true;
        }
    } else {
        if (i + (selectedShipSize - 1) * 10 > numCells) {
            return true;
        }
    }
}

// Removes ship from ships container after it has been placed on grid
function removeShipFromShips() {
    for (let j = 1; j <= selectedShipSize; j++) {
        const shipCell = document.getElementById(
            "player-ships" + "-" + selectedShip + "-" + j
        );
        shipCell.className = "grid-item-neutral";
        shipCell.dataset.placed = "true";
    }
    selectedShip = null;
}

// Converts linear index to 2D coordinates (x, y)
function linearTo2D(i) {
    return {
        x: (i - 1) % gridSize,
        y: Math.floor((i - 1) / gridSize),
    };
}

// Converts 2D coordinates (x, y) to linear index (i)
function linearFrom2D(x, y) {
    return y * gridSize + x + 1;
}

// Converts 2D coordinates (x, y) to letters and numbers (A1, B2, etc.)
function numLettersFrom2D(x, y) {
    let letter = x;
    switch (letter) {
        case 0:
            letter = "A";
            break;
        case 1:
            letter = "B";
            break;
        case 2:
            letter = "C";
            break;
        case 3:
            letter = "D";
            break;
        case 4:
            letter = "E";
            break;
        case 5:
            letter = "F";
            break;
        case 6:
            letter = "G";
            break;
        case 7:
            letter = "H";
            break;
        case 8:
            letter = "I";
            break;
        case 9:
            letter = "J";
            break;
        default:
            break;
    }
    let number = y + 1;
    return [letter, number];
}

// Converts linear index (i) to letters and numbers (A1, B2, etc.)
function linearToNumLetters(i) {
    let letter = linearTo2D(i).x;
    switch (letter) {
        case 0:
            letter = "A";
            break;
        case 1:
            letter = "B";
            break;
        case 2:
            letter = "C";
            break;
        case 3:
            letter = "D";
            break;
        case 4:
            letter = "E";
            break;
        case 5:
            letter = "F";
            break;
        case 6:
            letter = "G";
            break;
        case 7:
            letter = "H";
            break;
        case 8:
            letter = "I";
            break;
        case 9:
            letter = "J";
            break;
        default:
            break;
    }
    let number = linearTo2D(i).y + 1;
    return [letter, number];
}

// Event handlers =============================================================
function handleClickOceanGrid(i, container) {
    if (gameStarted) {
        return;
    }
    if (selectedShip === null) {
        return;
    }
    if (overlaps(i, container)) {
        return;
    }
    if (wasSet(selectedShip)) {
        return;
    }
    if (shipOutOfBounds(i)) {
        return;
    }

    if (alignment === "horizontal") {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + "-" + (i + j));
            cell.className = "grid-item-" + selectedShip;
            cell.dataset.occupied = "true";
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(
                container + "-" + (i + j * 10)
            );
            cell.className = "grid-item-" + selectedShip;
            cell.dataset.occupied = "true";
        }
    }
    player.ships.push(
        new Ship(
            selectedShip.toUpperCase(),
            linearTo2D(i),
            alignment.toUpperCase()
        )
    );
    const output = document.getElementById("output-text");
    output.innerHTML =
        selectedShip +
        " placed at (" +
        linearToNumLetters(i)[0] +
        ", " +
        linearToNumLetters(i)[1] +
        ")\n";
    removeShipFromShips(selectedShipSize);
    if (player.ships.length === 5) {
        output.innerHTML += "All ships placed!\n";
        output.innerHTML += "Click Start Game to begin!\n";
    }
}

function handleClickTargetGrid(i, container) {
    if (!gameStarted) {
        return;
    }
    if (pollData.activePlayer !== player.name) {
        return;
    }
    const cell = document.getElementById(container + "-" + i);
    if (cell.dataset.attacked === "true") {
        console.log("Invalid attack");
        return;
    } else {
        Attack.coordinates = linearTo2D(i);
        cell.dataset.attacked = "true";
        console.log(Attack);
        pollData.activePlayer = "opponent";
        attack();
    }
}

function handleMouseOverOceanGrid(i, container) {
    if (gameStarted || pollData.game_over === true) {
        return;
    }
    if (selectedShip === null || wasSet(selectedShip)) {
        return;
    }
    if (shipOutOfBounds(i, numCells)) {
        return;
    }
    if (overlaps(i, container)) {
        return;
    }

    if (alignment === "horizontal") {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + "-" + (i + j));
            if (cell.className === "grid-item-neutral") {
                cell.className = "grid-item-" + selectedShip;
            }
        }
    } else {
        if (i + (selectedShipSize - 1) * 10 > numCells) {
            return;
        }
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(
                container + "-" + (i + j * 10)
            );
            if (cell.className === "grid-item-neutral") {
                cell.className = "grid-item-" + selectedShip;
            }
        }
    }
}

function handleMouseOverTargetGrid(i, container) {
    if (!gameStarted) {
        return;
    }
    if (pollData.activePlayer !== player.name) {
        return;
    }
    const cell = document.getElementById(container + "-" + i);
    if (cell.className !== "grid-item-neutral") {
        return;
    } else {
        cell.className = "grid-item-preview";
    }
}

function handleMouseOutOceanGrid(i, container) {
    if (gameStarted || pollData.game_over === true) {
        return;
    }
    if (selectedShip === null || wasSet(selectedShip)) {
        return;
    }

    if (alignment === "horizontal") {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + "-" + (i + j));
            if (cell.className === "grid-item-" + selectedShip) {
                cell.className = "grid-item-neutral";
            }
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(
                container + "-" + (i + j * 10)
            );
            if (cell.className === "grid-item-" + selectedShip) {
                cell.className = "grid-item-neutral";
            }
        }
    }
}

function handleMouseOutTargetGrid(i, container) {
    if (!gameStarted) {
        return;
    }
    const cell = document.getElementById(container + "-" + i);
    if (cell.className !== "grid-item-preview") {
        return;
    } else {
        cell.className = "grid-item-neutral";
    }
}

// Create grids and ships =====================================================
function createGrid(container) {
    const grid = document.getElementById(container);

    // blank cell in top corner
    const blank = document.createElement("div");
    blank.className = "grid-label";
    blank.textContent = " ";
    if (container === "player-grid") {
        grid.appendChild(blank);
    }
    // top row of letters
    for (let i = 0; i < 10; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-label";
        cell.textContent = String.fromCharCode(65 + i);
        grid.appendChild(cell);
    }
    if (container === "opponent-grid") {
        grid.appendChild(blank);
    }
    for (let i = 1; i <= numCells; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-neutral";
        cell.id = container + "-" + i;
        if (container === "player-grid") {
            if ((i - 1) % 10 === 0) {
                // left column of numbers
                const label = document.createElement("div");
                label.className = "grid-label";
                label.textContent = Math.floor(i / 10) + 1;
                grid.appendChild(label);
            }
            cell.dataset.occupied = "false";
            cell.addEventListener("click", function () {
                handleClickOceanGrid(i, container);
            });
            cell.addEventListener("mouseover", function () {
                handleMouseOverOceanGrid(i, container);
            });
            cell.addEventListener("mouseout", function () {
                handleMouseOutOceanGrid(i, container);
            });
            grid.appendChild(cell);
        } else {
            cell.addEventListener("click", function () {
                handleClickTargetGrid(i, container);
            });
            cell.addEventListener("mouseover", function () {
                handleMouseOverTargetGrid(i, container);
            });
            cell.addEventListener("mouseout", function () {
                handleMouseOutTargetGrid(i, container);
            });
            grid.appendChild(cell);
            if (i % 10 === 0) {
                // right column of numbers
                const label = document.createElement("div");
                label.className = "grid-label";
                label.textContent = i / 10;
                grid.appendChild(label);
            }
        }
    }
}
createGrid("player-grid");
createGrid("opponent-grid");

function createShip(container, length, ship) {
    const grid = document.getElementById(container);

    for (let i = 1; i <= length; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-" + ship;
        cell.id = container + "-" + ship + "-" + i;
        cell.addEventListener("click", function () {
            selectedShip = ship;
            selectedShipSize = length;
            const output = document.getElementById("output-text");
            output.innerHTML = "Selected ship: " + ship + "\n";
            output.innerHTML += "Ship Alignment: " + alignment;
        });
        grid.appendChild(cell);
    }
    for (let i = 1; i <= 10 - length; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-neutral";
        cell.id = container + "-" + i;
        grid.appendChild(cell);
    }
}
const shipContainer = document.getElementById("player-ships");
shipContainer.style.gridTemplateColumns = "repeat(10, 30px)";
createShip("player-ships", 5, "carrier");
createShip("player-ships", 4, "battleship");
createShip("player-ships", 3, "cruiser");
createShip("player-ships", 3, "submarine");
createShip("player-ships", 2, "destroyer");

function rotateShips() {
    if (alignment === "horizontal") {
        alignment = "vertical";
        if (selectedShip !== null) {
            const output = document.getElementById("output-text");
            output.innerHTML = "Selected ship: " + selectedShip + "\n";
            output.innerHTML += "Ship Alignment: " + alignment;
        }
    } else {
        alignment = "horizontal";
        if (selectedShip !== null) {
            const output = document.getElementById("output-text");
            output.innerHTML = "Selected ship: " + selectedShip + "\n";
            output.innerHTML += "Ship Alignment: " + alignment;
        }
    }
}
document.getElementById("rotate-ships").addEventListener("click", rotateShips);

function startGame() {
    if (player.ships.length === 5) {
        gameStarted = true;
        const shipsDiv = document.getElementById("ships-div");
        shipsDiv.parentNode.removeChild(shipsDiv);

        initGame();
    }
}
document.getElementById("start-game").addEventListener("click", startGame);

// Update grids ===============================================================
/* After an attack, if the active player is the current player,
 * we update the ocean grid with the result of the attack */

function getShipLength(ship) {
    if (ship === "carrier") {
        return 5;
    } else if (ship === "battleship") {
        return 4;
    } else if (ship === "cruiser") {
        return 3;
    } else if (ship === "submarine") {
        return 3;
    } else if (ship === "destroyer") {
        return 2;
    }
}

function colorSunkShips(ship, alignment, x, y) {
    const shipLength = getShipLength(ship);
    if (alignment === "horizontal") {
        for (let j = 0; j < shipLength; j++) {
            const cell = document.getElementById(
                "opponent-grid-" + linearFrom2D(parseInt(x) + j, parseInt(y))
            );
            cell.className = "grid-item-sunk";
        }
    } else {
        for (let j = 0; j < shipLength; j++) {
            const cell = document.getElementById(
                "opponent-grid-" + linearFrom2D(parseInt(x), parseInt(y) + j)
            );
            cell.className = "grid-item-sunk";
        }
    }
}

function updateOceanGrid(i) {
    if (pollData.activePlayer === player.name) {
        // Player's ship was hit but not sunk
        if (pollData.actionResult === "HIT") {
            const cell = document.getElementById("player-grid-" + i);
            cell.className = "grid-item-hit";
            if (pollData.shipSunkEvent === null) {
                console.log("Hit!");
                const output = document.getElementById("output-text");
                output.innerHTML = "Hit on (" + linearToNumLetters(i) + ")!\n";
            }
        } else {
            // Attack was a miss, don't change cell color
            console.log("Miss!\n");
            const output = document.getElementById("output-text");
            output.innerHTML = "Miss!\n";
        }
        console.log("Your turn!");
        const output = document.getElementById("output-text");
        output.innerHTML += "Your turn!\n";
        output.innerHTML += "Click on a cell in Target Grid to attack!\n";
    }
}

/* After an attack, if the active player is the opponent,
 * we update the target grid with the result of the attack */
function updateTargetGrid(i) {
    // Opponent's ship was hit but not sunk
    if (pollData.activePlayer !== player.name) {
        const cell = document.getElementById("opponent-grid-" + i);
        if (pollData.actionResult === "HIT") {
            cell.className = "grid-item-hit";
            if (pollData.shipSunkEvent === null) {
                console.log("Hit!");
                const output = document.getElementById("output-text");
                output.innerHTML = "Hit on (" + linearToNumLetters(i) + ")!\n";
            }
        } else {
            // Attack was a miss, change cell color in target grid
            console.log("Miss!");
            const output = document.getElementById("output-text");
            output.innerHTML = "Miss!\n";
            cell.className = "grid-item-miss";
        }
        console.log("Opponent's turn!");
        const output = document.getElementById("output-text");
        output.innerHTML += `Awaiting ${opponent}'s Attack!`;
    }
}

// Update view ================================================================
function displayInitialMessage() {
    const output = document.getElementById("output-text");
    output.innerHTML =
        "Welcome to Battleship!\n" +
        "Click on a ship to select it.\n" +
        "Click on a cell in Ocean Grid to place ship.\n" +
        "Or click on auto place to place ships randomly.\n";
}

function setOpponentID() {
    if (pollData.playerOneID === player.name) {
        opponent = pollData.playerTwoID;
    } else {
        opponent = pollData.playerOneID;
    }
}

function resetGame() {
    player.ships.length = 0;
    counter = 0;
    timedOut = false;
    pollData = {
        revisionId: -1,
    };
    Attack = {
        actionType: "PLAY",
        roomID: roomID,
        coordinates: {
            x: 0,
            y: 0,
        },
    };
    AttackResult = {
        x: 0,
        y: 0,
        result: "MISS",
    };
    gameStarted = false;
    selectedShip = null;
    selectedShipSize = 0;
    alignment = "horizontal";

    const output = document.getElementById("output-text");
    output.innerHTML = "";

    playerGrid.replaceChildren();
    targetGrid.replaceChildren();
    createGrid("player-grid");
    createGrid("opponent-grid");

    playingRoom.replaceChildren();
    playingRoom.appendChild(shipsDiv);
    playingRoom.appendChild(outputDiv);

    playerShips.replaceChildren();
    createShip("player-ships", 5, "carrier");
    createShip("player-ships", 4, "battleship");
    createShip("player-ships", 3, "cruiser");
    createShip("player-ships", 3, "submarine");
    createShip("player-ships", 2, "destroyer");

    const restart = document.getElementById("restart");
    restart.style.visibility = "hidden";

    output.style.backgroundColor = "#f8fafc";
    output.style.color = "black";
    displayInitialMessage();

    if (window.innerWidth < 760) {
        targetGridContainer.remove();
    }

    restartGame();
}

function handleGameOver() {
    console.log("Game over!");
    const winner = pollData.winner;
    const output = document.getElementById("output-text");
    output.innerHTML = "Game over!\n";
    if (timedOut) {
        output.innerHTML += "Room time limit exceeded!";
        consoleOutput.style.backgroundColor = "##f8fafc";
        return;
    }
    output.innerHTML += winner + " wins!";
    gameStarted = false;
    consoleOutput.style.backgroundColor = "#f97316";
    const restart = document.getElementById("restart");
    restart.style.visibility = "visible";
    restart.addEventListener("click", resetGame);
}

function handleShipSunk() {
    const [ship, alignment, x, y] = pollData.shipSunkEvent.split(" ");
    console.log(ship + " sunk!");
    const output = document.getElementById("output-text");
    if (pollData.activePlayer === player.name) {
        output.innerHTML = pollData.shipSunkEvent + " sunk!\n";
    } else {
        output.innerHTML = "You sunk " + ship + "!\n";
        colorSunkShips(ship.toLowerCase(), alignment.toLowerCase(), x, y);
    }
}

function processNewState() {
    // If revisionId is less than 1, game hasn't started yet
    if (pollData.revisionId < 1) {
        if (pollData.requestToJoin === true) {
            pollData.requestToJoin = false;
            const choice = confirm(
                "Player " +
                    pollData.playerTwoID +
                    " has requested to join your game"
            );
            return returnChoice(choice);
        }
        if (pollData.revisionId === -1) {
            setOpponentID();
            if (
                pollData.playerOneID === null ||
                pollData.playerTwoID === null
            ) {
                document.getElementById("output-text").innerHTML =
                    "Waiting for opponent to join...";
                console.log("Waiting for opponent to join...");
            } else {
                document.getElementById("output-text").innerHTML =
                    "Waiting for " + opponent + " to place ships...";
                console.log("Waiting for opponent to place ships...");
            }
            updateState();
        } else {
            if (opponent === null) {
                opponent = pollData.activePlayer;
            }
            consoleOutput = document.getElementById("output-text");
            document.getElementById("output-text").innerHTML =
                "Game started!\n";
            if (pollData.activePlayer === player.name) {
                document.getElementById("output-text").innerHTML +=
                    "Your turn!\n";
                document.getElementById("output-text").innerHTML +=
                    "Click on a cell in Target Grid to attack!\n";
            } else {
                document.getElementById("output-text").innerHTML +=
                    "Waiting for " + opponent + " to attack...\n";
                updateState();
            }
        }
        return;
    }

    AttackResult.x = pollData.actionXCord;
    AttackResult.y = pollData.actionYCord;
    AttackResult.result = pollData.actionResult;
    const i = linearFrom2D(AttackResult.x, AttackResult.y);

    updateOceanGrid(i);
    updateTargetGrid(i);

    if (pollData.shipSunkEvent !== null) {
        handleShipSunk();
    }

    if (pollData.game_over) {
        handleGameOver();
        return;
    }

    consoleOutput.style.color = "white";
    if (pollData.activePlayer !== player.name) {
        consoleOutput.style.backgroundColor = "#6b7280";
        updateState();
    } else {
        consoleOutput.style.backgroundColor = "#3b82f6";
        if (DEBUG) {
            while (true) {
                const randomCell = document.getElementById(
                    "opponent-grid-" + rand()
                );
                if (randomCell.dataset.attacked === undefined) {
                    setTimeout(function () {
                        randomCell.click();
                    }, 200);
                    break;
                }
            }
        }
    }
}

// Server communication =======================================================
// Waiting Room ===============================================================
// Start a new game without a room ID
function startNewGame() {
    const playerId = document.getElementById("player-id").value;
    if (playerId === "") {
        alert("Please enter a player ID");
        return;
    }
    player = new Player(playerId);
    const payload = {
        actionType: "NEW",
        playerID: playerId,
    };
    const textArea = document.getElementById("join-result");
    textArea.parentElement.removeChild(textArea);
    console.log(payload);
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            roomID = data.roomID;
            Attack.roomID = roomID;
            console.log(data);
            const waitingRoom = document.getElementById("waiting-room");
            waitingRoom.parentNode.removeChild(waitingRoom);
            document.getElementById("playing-room").style.visibility =
                "visible";
            document.getElementById("room-id-output").value =
                "Your Room ID is: " + roomID;
            displayInitialMessage();
            if (window.innerWidth < 760) {
                targetGridContainer.remove();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
document
    .getElementById("start-new-game")
    .addEventListener("click", startNewGame);

// Join an existing game with a room ID
function joinGame() {
    const playerId = document.getElementById("player-id").value;
    roomID = document.getElementById("room-id").value;
    Attack.roomID = roomID;
    if (playerId === "") {
        alert("Please enter a player ID");
        return;
    }
    if (roomID === "") {
        alert("Please enter a room ID");
        return;
    }

    player = new Player(playerId);
    const payload = {
        actionType: "JOIN",
        roomID: roomID,
        playerID: playerId,
    };
    const textArea = document.getElementById("join-result");
    textArea.parentElement.removeChild(textArea);
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    alert("Room doesn't exist, please enter a valid room ID");
                } else if (response.status === 406) {
                    alert("Room is full");
                } else if (response.status === 409) {
                    alert("Player already in room");
                }
                throw new Error("Could not join room");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            pollData = data;
            const waitingRoom = document.getElementById("waiting-room");
            waitingRoom.parentNode.removeChild(waitingRoom);
            document.getElementById("playing-room").style.visibility =
                "visible";
            document.getElementById("room-id-output").value =
                "Your Room ID is: " + roomID;
            setOpponentID();
            displayInitialMessage();
            if (window.innerWidth < 760) {
                targetGridContainer.remove();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
document.getElementById("join-game").addEventListener("click", joinGame);

// Attempt to join a random game that is looking for a player
function joinRandomGame() {
    roomID = -1;
    const playerId = document.getElementById("player-id").value;
    if (playerId === "" && player === null) {
        alert("Please enter a player ID");
        return;
    }
    player = new Player(playerId);
    const payload = {
        actionType: "JOIN_RANDOM",
        playerID: playerId,
        roomID: roomID,
    };
    const textarea = document.getElementById("join-result");
    textarea.style.visibility = "visible";
    textarea.innerHTML = "Looking for game...";
    console.log(payload);
    fetch("/api/poll", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No available rooms");
                } else if (response.status === 406) {
                    alert("Player denied entry to room");
                    throw new Error("Player denied entry to room");
                } else if (response.status === 400) {
                    throw new Error("Player already in room");
                }
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            pollData = data;
            if (data.requestToJoin === true) {
                roomID = data.roomID;
                throw new Error("Invitation timed out");
            }
            console.log(data);
            roomID = data.roomID;
            Attack.roomID = roomID;
            textarea.parentNode.removeChild(textarea);
            const waitingRoom = document.getElementById("waiting-room");
            waitingRoom.parentNode.removeChild(waitingRoom);
            document.getElementById("playing-room").style.visibility =
                "visible";
            document.getElementById("room-id-output").value =
                "Your Room ID is: " + roomID;
            setOpponentID();
            displayInitialMessage();
            if (window.innerWidth < 760) {
                targetGridContainer.remove();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            textarea.innerHTML = "No available games, please try again later";
        });
}
document
    .getElementById("join-random-game")
    .addEventListener("click", joinRandomGame);

// Return accept or deny choice to server
function returnChoice(choice) {
    const payload = {
        actionType: "RESPOND",
        roomID: roomID,
        choice: choice,
    };
    console.log(payload);
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            pollData = data;
            processNewState();
            console.log(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function restartGame() {
    const payload = {
        actionType: "RESTART",
        roomID: roomID,
        playerID: player.name,
    };
    console.log(payload);
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            pollData = data;
            console.log(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Playing Game ===============================================================
// send initGame object to server
function initGame() {
    const payload = {
        actionType: "INIT",
        roomID: roomID,
        playerID: player.name,
        ships: player.ships,
    };
    console.log(payload);
    if (window.innerWidth < 760) {
        bothGrids.appendChild(targetGridContainer);
    }
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => response.json())
        .then((data) => {
            pollData = data;
            console.log(data);
            processNewState();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// send Attack object to server
function attack() {
    fetch("/api/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Attack),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data === "Invalid room ID") {
                timedOut = true;
                pollData.game_over = true;
            } else {
                pollData = data;
            }
            processNewState();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

/* Get pollData from server.
 * Only one player will be polling at a time.
 * When one long polling is fulfilled by the server,
 * the other player will begin polling */
function updateState() {
    const payload = {
        actionType: "POLL",
        roomID: roomID,
        revisionId: pollData.revisionId,
    };
    console.log(payload);
    fetch("/api/poll", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data === "Invalid room ID") {
                timedOut = true;
                pollData.game_over = true;
            } else {
                pollData = data;
            }
            processNewState();
        })
        .catch((error) => {
            console.error("Error:", error);
            if (pollData.game_over === false) {
                setTimeout(fetchData, 3000);
            }
        });
}

// Debugging ==================================================================
function testServer() {
    fetch("/api/hello", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error("Error:", error);
        });
}
testServer();

function rand() {
    return Math.floor(Math.random() * 100) + 1;
}

function resetGrids() {
    player.ships.length = 0;
    const playerGrid = document.getElementById("player-grid");
    const playerShips = document.getElementById("player-ships");

    playerGrid.replaceChildren();
    playerShips.replaceChildren();

    createGrid("player-grid");

    createShip("player-ships", 5, "carrier");
    createShip("player-ships", 4, "battleship");
    createShip("player-ships", 3, "cruiser");
    createShip("player-ships", 3, "submarine");
    createShip("player-ships", 2, "destroyer");
}

function autoPlacing() {
    resetGrids();
    while (player.ships.length < 5) {
        document.getElementById("player-ships-carrier-1").click();
        alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand()).click();

        document.getElementById("player-ships-battleship-1").click();
        alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand()).click();

        document.getElementById("player-ships-cruiser-1").click();
        alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand()).click();

        document.getElementById("player-ships-submarine-1").click();
        alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand()).click();

        document.getElementById("player-ships-destroyer-1").click();
        alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand()).click();
    }
}
document.getElementById("auto-place").addEventListener("click", autoPlacing);

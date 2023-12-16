// Gobal Variables ============================================================
const gridSize       = 10;                              // grid is gridSize x gridSize cells
const numCells       = gridSize * gridSize;             // total number of cells
let selectedShip     = null;                            // ship to be placed on grid
let selectedShipSize = 0;                               // size of selected ship (2-5)
let alignment        = 'horizontal';                    // alignment of selected ship
let gameStarted      = false;                           // true after 'Start Game' is clicked
let player           = new Player('Player 1');          // TODO: get name from server
let updateInterval   = setInterval(updateState, 3000);  // update every 3 seconds

// Attack object to be sent to server
let Attack = {
    type: 'ATTACK',
    coordinates: {
        x: 0,
        y: 0
    }
}

let AttackResult = {
    x: 0,
    y: 0,
    result: 'MISS'
}
// ============================================================================

function Player(name) {
    this.name = name;  // TODO: get name from server
    this.ships = [];
}

function Ship(type, coordinates, alignment) {
    this.type = type;
    this.coordinates = coordinates;
    this.alignment = alignment;
}

// Helper functions ===========================================================

// Returns true if ship has been placed on grid
function wasSet(Ship) {
    const ship = document.getElementById('player-ships' + '-' + Ship + '-' + 1);
    return ship.dataset.placed === 'true';
}

// Returns true if ship overlaps with another ship
function overlaps(i, container) {
    if (alignment === 'horizontal') {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + j));
            if (cell.className !== 'grid-item-preview' && cell.className !== 'grid-item-neutral') {
                return true;
            }
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + (j * 10)));
            if (cell.className !== 'grid-item-preview' && cell.className !== 'grid-item-neutral') {
                return true;
            }
        }
    }
    return false;
}

// Returns true if a ship would fall out of bounds if placed at i
function shipOutOfBounds(i) {
    if (alignment === 'horizontal') {
        if ((i - 1) % gridSize + selectedShipSize > gridSize) {
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
        const shipCell = document.getElementById('player-ships' + '-' + selectedShip + '-' + j);
        shipCell.className = 'grid-item-neutral';
        shipCell.dataset.placed = 'true';
    }
    selectedShip = null;
}

// Converts linear index to 2D coordinates (x, y)
function linearTo2D(i) {
    return {
        x: (i - 1) % gridSize,
        y: Math.floor((i - 1) / gridSize)
    };
}

// Converts 2D coordinates (x, y) to linear index (i)
function linearFrom2D(x, y) {
    return y * gridSize + x + 1;
}

function numLettersFrom2D(x, y) {
    let letter = x;
    switch (letter) {
        case 0:
            letter = 'A';
            break;
        case 1:
            letter = 'B';
            break;
        case 2:
            letter = 'C';
            break;
        case 3:
            letter = 'D';
            break;
        case 4:
            letter = 'E';
            break;
        case 5:
            letter = 'F';
            break;
        case 6:
            letter = 'G';
            break;
        case 7:
            letter = 'H';
            break;
        case 8:
            letter = 'I';
            break;
        case 9:
            letter = 'J';
            break;
        default:
            break;
    }
    let number = y + 1;
    return [letter, number];
}

function linearToNumLetters(i) {
    let letter = linearTo2D(i).x;
    switch (letter) {
        case 0:
            letter = 'A';
            break;
        case 1:
            letter = 'B';
            break;
        case 2:
            letter = 'C';
            break;
        case 3:
            letter = 'D';
            break;
        case 4:
            letter = 'E';
            break;
        case 5:
            letter = 'F';
            break;
        case 6:
            letter = 'G';
            break;
        case 7:
            letter = 'H';
            break;
        case 8:
            letter = 'I';
            break;
        case 9:
            letter = 'J';
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

    if (alignment === 'horizontal') {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + j));
            cell.className = 'grid-item-' + selectedShip;
            cell.dataset.occupied = 'true';
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + (j * 10)));
            cell.className = 'grid-item-' + selectedShip;
            cell.dataset.occupied = 'true';
        }
    }
    player.ships.push(new Ship(selectedShip, linearTo2D(i), alignment));
    const output = document.getElementById('output-text');
    output.innerHTML = selectedShip + ' placed at (' + linearToNumLetters(i)[0] + ', ' + linearToNumLetters(i)[1] + ')\n';
    removeShipFromShips(selectedShipSize);
}

function handleClickTargetGrid(i, container) {
    if (!gameStarted) {
        return;
    }
    if (pollData.activePlayer !== player.name) {
        return;
    }
    const cell = document.getElementById(container + '-' + i);
    if (cell.dataset.attacked === 'true') {
        console.log('Invalid attack');
        return;
    } else {
        Attack.coordinates = linearTo2D(i);
        cell.dataset.attacked = 'true';
        console.log(Attack);
        attack();
    }
}

function handleMouseOverOceanGrid(i, container) {
    if (selectedShip === null || wasSet(selectedShip)) {
        return;
    }
    if (shipOutOfBounds(i, numCells)) {
        return;
    }
    if (overlaps(i, container)) {
        return;
    }

    if (alignment === 'horizontal') {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + j));
            if (cell.className === 'grid-item-neutral') {
                cell.className = 'grid-item-preview';
            }
        }
    } else {
        if (i + (selectedShipSize - 1) * 10 > numCells) {
            return;
        }
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + (j * 10)));
            if (cell.className === 'grid-item-neutral') {
                cell.className = 'grid-item-preview';
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
    const cell = document.getElementById(container + '-' + i);
    if (cell.className !== 'grid-item-neutral') {
        return;
    } else {
        cell.className = 'grid-item-preview';
    }
}

function handleMouseOutOceanGrid(i, container) {
    if (alignment === 'horizontal') {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + j));
            if (cell.className === 'grid-item-preview') {
                cell.className = 'grid-item-neutral';
            }
        }
    } else {
        for (let j = 0; j < selectedShipSize; j++) {
            const cell = document.getElementById(container + '-' + (i + (j * 10)));
            if (cell.className === 'grid-item-preview') {
                cell.className = 'grid-item-neutral';
            }
        }
    }
}

function handleMouseOutTargetGrid(i, container) {
    if (!gameStarted) {
        return;
    }
    const cell = document.getElementById(container + '-' + i);
    if (cell.className !== 'grid-item-preview') {
        return;
    } else {
        cell.className = 'grid-item-neutral';
    }
}

// Create grids and ships =====================================================
function createGrid(container) {
    const grid = document.getElementById(container);

    for (let i = 1; i <= numCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item-neutral';
        cell.id = container + '-' + i;
        if (container === 'player-grid') {
            cell.addEventListener('click', function () {
                handleClickOceanGrid(i, container);
            });
            cell.addEventListener('mouseover', function () {
                handleMouseOverOceanGrid(i, container)
            });
            cell.addEventListener('mouseout', function () {
                handleMouseOutOceanGrid(i, container);
            });
        } else {
            cell.addEventListener('click', function () {
                handleClickTargetGrid(i, container);
            });
            cell.addEventListener('mouseover', function () {
                handleMouseOverTargetGrid(i, container);
            });
            cell.addEventListener('mouseout', function () {
                handleMouseOutTargetGrid(i, container);
            });
        }
        grid.appendChild(cell);
    }
}
createGrid('player-grid');
createGrid('opponent-grid');

function createShip(container, length, ship) {
    const grid = document.getElementById(container);

    for (let i = 1; i <= length; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item-' + ship;
        cell.id = container + '-' + ship + '-' + i;
        cell.addEventListener('click', function () {
            selectedShip = ship;
            selectedShipSize = length;
            const output = document.getElementById('output-text');
            output.innerHTML = 'Selected ship: ' + ship + '\n';
            output.innerHTML += 'Ship Alignment: ' + alignment;
        });
        grid.appendChild(cell);
    }
    for (let i = 1; i <= 10 - length; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item-neutral';
        cell.id = container + '-' + i;
        grid.appendChild(cell);
    }
}
createShip('player-ships', 5, 'carrier');
createShip('player-ships', 4, 'battleship');
createShip('player-ships', 3, 'cruiser');
createShip('player-ships', 3, 'submarine');
createShip('player-ships', 2, 'destroyer');

function rotateShips() {
    if (alignment === 'horizontal') {
        alignment = 'vertical';
        if (selectedShip !== null) {
            const output = document.getElementById('output-text');
            output.innerHTML = 'Selected ship: ' + selectedShip + '\n';
            output.innerHTML += 'Ship Alignment: ' + alignment;
        }
    } else {
        alignment = 'horizontal';
        if (selectedShip !== null) {
            const output = document.getElementById('output-text');
            output.innerHTML = 'Selected ship: ' + selectedShip + '\n';
            output.innerHTML += 'Ship Alignment: ' + alignment;
        }
    }
}
document.getElementById('rotate-ships').addEventListener('click', rotateShips);

function startGame() {
    if (player.ships.length === 5) {
        gameStarted = true;
        const shipsDiv = document.getElementById('ships-div');
        shipsDiv.parentNode.removeChild(shipsDiv);

        console.log(initGame());  // For Debugging
        document.getElementById('output-text').innerHTML = 'Game started!';
    }
}
document.getElementById('start-game').addEventListener('click', startGame);

function handleGameOver() {
    console.log('Game over!');
    const winner = pollData.winner;
    const output = document.getElementById('output-text');
    output.innerHTML = 'Game over!\n';
    output.innerHTML += winner + ' wins!';
    gameStarted = false;
    clearInterval(updateInterval);
}

function handleShipSunk() {
    console.log(pollData.shipSunkEvent + ' sunk!');
    const output = document.getElementById('output-text');
    if (pollData.activePlayer === player.name) {
        output.innerHTML = pollData.shipSunkEvent + ' sunk!\n';
    } else {
        output.innerHTML = 'You sunk ' + pollData.shipSunkEvent + '!\n';
    }
}

// Server communication =======================================================
// send initGame object to server
function initGame() {
    const gameData = {
        type: 'INIT',
        name: player.name,
        ships: player.ships
    };
    fetch('http://localhost:3000/api/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });
}

// send Attack object to server
function attack() {
    fetch('http://localhost:3000/api/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Attack),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });
}

// get pollData from server
function updateState () {
    fetch('http://localhost:3000/pollData')
    .then(response => response.json())
    .then(data => {
        pollData = data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    if (pollData.game_over) {
        handleGameOver();
        return;
    }
    if (pollData.shipSunkEvent !== null) {
        handleShipSunk();
    }

    AttackResult.x = pollData.actionXCord;
    AttackResult.y = pollData.actionYCord;
    AttackResult.result = pollData.actionResult;
    const i = linearFrom2D(AttackResult.x, AttackResult.y);
    if (pollData.activePlayer === player.name) {
        // Player's ship was hit but not sunk
        if (pollData.actionResult === 'HIT') {
            const cell = document.getElementById('player-grid-' + i);
            cell.className = 'grid-item-hit';
            if (pollData.shipSunkEvent === null) {
                console.log('Hit!');
                const output = document.getElementById('output-text');
                output.innerHTML += 'Hit on (' + linearFrom2D(AttackResult.x, AttackResult.y) + ')!';
            }
        } else {
            // Attack was a miss, don't change cell color
            console.log('Miss!');
            const output = document.getElementById('output-text');
            output.innerHTML += 'Miss!\n';
        }
        console.log('Your turn!');
        const output = document.getElementById('output-text');
        output.innerHTML += 'Your turn!\n';
        output.innerHTML += 'Click on a cell in Target Grid to attack!\n';
    } else {
        // Opponent's ship was hit but not sunk
        const cell = document.getElementById('opponent-grid-' + i);
        if (pollData.actionResult === 'HIT'){
            cell.className = 'grid-item-hit';
            if (pollData.shipSunkEvent === null) {
                console.log('Hit!');
                const output = document.getElementById('output-text');
                output.innerHTML += 'Hit on (' + linearFrom2D(AttackResult.x, AttackResult.y) + ')!';
            }
        } else {
            // Attack was a miss, change cell color in target grid
            console.log('Miss!');
            const output = document.getElementById('output-text');
            output.innerHTML += 'Miss!\n';
            cell.className = 'grid-item-miss';
        }
        console.log('Opponent\'s turn!');
        const output = document.getElementById('output-text');
        output.innerHTML += 'Awaiting Attack!';
    }
}
document.getElementById('update').addEventListener('click', updateState);

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

/* ============================================================================
* Sample game state
* We can use this to test the UI
interface PollData {
    revisionID : number;  // >0, increases with every change to game state
    shipSunkEvent : string; //message containing what type of ship to display event to player
    game_over: boolean; // true if game is over
    winner?  : string;  // name of winner, if game is over
    activePlayer: number; // playerID of whose turn it is
    actionXCord : number; //X Coordinate of most recent targetted square
    actionYCord : number; //Y Coordinate of most recent targetted square
    actionResult : string; //"HIT" or "MISS"
}
============================================================================*/
// function executeCommand() {
//     const input = document.getElementById('input').value;
//     const args = input.split(' ');
//     const cmd = args[0]
//     switch (cmd) {
//         case 'hit':
//             pollData.actionXCord = parseInt(args[1]);
//             pollData.actionYCord = parseInt(args[2]);
//             pollData.actionResult = 'HIT';
//             break;
//         case 'miss':
//             pollData.actionXCord = parseInt(args[1]);
//             pollData.actionYCord = parseInt(args[2]);
//             pollData.actionResult = 'MISS';
//             break;
//         case 'switchPlayer':
//             if (pollData.activePlayer === 'Player 1') {
//                 pollData.activePlayer = 'Player 2';
//             } else {
//                 pollData.activePlayer = 'Player 1';
//             }
//             break;
//         case 'winner':
//             pollData.game_over = true;
//             pollData.winner = args[1];
//             break;
//         case 'sunk':
//             pollData.shipSunkEvent = args[1];
//             break;
//         default:
//             break;
//     }
//     updateState();
//     document.getElementById('input').value = '';
// }

// let pollData = {
//     revision: 0,
//     shipSunkEvent: "Battleship",
//     game_over: false,
//     winner: null,
//     activePlayer: "Player 2",
//     actionXCord: 0,
//     actionYCord: 0,
//     actionResult: "HIT",
// };
// ============================================================================
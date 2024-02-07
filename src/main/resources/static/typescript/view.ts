// Update grids ===============================================================
/* After an attack, if the active player is the current player,
 * we update the ocean grid with the result of the attack */
function colorSunkShips(
    ship: string,
    alignment: string,
    x: number,
    y: number
): void {
    const shipLength = getShipLength(ship);
    const grid =
        pollData.activePlayer === player.name
            ? "player-grid-"
            : "opponent-grid-";
    if (alignment === "horizontal") {
        for (let j = 0; j < shipLength; j++) {
            const cell = document.getElementById(grid + linearFrom2D(x + j, y));
            cell!.className = "grid-item-sunk";
        }
    } else {
        for (let j = 0; j < shipLength; j++) {
            const cell = document.getElementById(grid + linearFrom2D(x, y + j));
            cell!.className = "grid-item-sunk";
        }
    }
}

function updateOceanGrid(cellIdx: number): void {
    if (pollData.activePlayer === player.name) {
        // Player's ship was hit but not sunk
        if (pollData.actionResult === "HIT") {
            hitSound.play();
            const cell = document.getElementById("player-grid-" + cellIdx);
            cell!.className = "grid-item-hit";
            if (pollData.shipSunkEvent === null) {
                console.log("Hit!");
                consoleOutput!.innerHTML =
                    "Hit on (" + linearToNumLetters(cellIdx) + ")!\n";
            }
        } else {
            missSound.play();
            // Attack was a miss, don't change cell color
            console.log("Miss!\n");
            consoleOutput!.innerHTML = "Miss!\n";
        }
        console.log("Your turn!");
        consoleOutput!.innerHTML += "Your turn!\n";
        consoleOutput!.innerHTML +=
            "Click on a cell in Target Grid to attack!\n";
    }
}

/* After an attack, if the active player is the opponent,
 * we update the target grid with the result of the attack */
function updateTargetGrid(cellIdx): void {
    // Opponent's ship was hit but not sunk
    if (pollData.activePlayer !== player.name) {
        const cell = document.getElementById("opponent-grid-" + cellIdx);
        if (pollData.actionResult === "HIT") {
            hitSound.play();
            cell!.className = "grid-item-hit";
            if (pollData.shipSunkEvent === null) {
                console.log("Hit!");
                consoleOutput!.innerHTML =
                    "Hit on (" + linearToNumLetters(cellIdx) + ")!\n";
            }
        } else {
            missSound.play();
            // Attack was a miss, change cell color in target grid
            console.log("Miss!");
            consoleOutput!.innerHTML = "Miss!\n";
            cell!.className = "grid-item-miss";
        }
        console.log("Opponent's turn!");
        consoleOutput!.innerHTML += `Awaiting ${opponent}'s Attack!`;
    }
}

// Update view ================================================================
function displayInitialMessage(): void {
    consoleOutput!.innerHTML =
        "Welcome to Battleship!\n" +
        "Click on a ship to select it.\n" +
        "Click on a cell in Ocean Grid to place ship.\n" +
        "Or click on auto place to place ships randomly.\n";
}

function setOpponentID(): void {
    if (pollData.playerOneID === player.name) {
        opponent = pollData.playerTwoID;
    } else {
        opponent = pollData.playerOneID;
    }
}

function resetGame(): void {
    player.ships.length = 0;
    timedOut = false;
    pollData = {
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

    consoleOutput!.innerHTML = "";

    playerGrid?.replaceChildren();
    targetGrid?.replaceChildren();
    createGrid("player-grid");
    createGrid("opponent-grid");

    playingRoom?.replaceChildren();
    playingRoom?.appendChild(shipsDiv as Node);
    playingRoom?.appendChild(outputDiv as Node);

    playerShips?.replaceChildren();
    createShip("player-ships", 5, "carrier");
    createShip("player-ships", 4, "battleship");
    createShip("player-ships", 3, "cruiser");
    createShip("player-ships", 3, "submarine");
    createShip("player-ships", 2, "destroyer");

    const restart = document.getElementById("restart");
    restart!.style.visibility = "hidden";

    consoleOutput!.style.backgroundColor = "#f8fafc";
    consoleOutput!.style.color = "black";
    displayInitialMessage();

    if (window.innerWidth < 760) {
        targetGridContainer?.remove();
    }

    restartGame();
}

function handleGameOver(): void {
    console.log("Game over!");
    const winner = pollData.winner;
    consoleOutput!.innerHTML = "Game over!\n";
    if (timedOut) {
        consoleOutput!.innerHTML += "Room time limit exceeded!";
        consoleOutput!.style.backgroundColor = "##f8fafc";
        return;
    }
    consoleOutput!.innerHTML += winner + " wins!";
    gameStarted = false;
    consoleOutput!.style.backgroundColor = "#f97316";
    const restart = document.getElementById("restart");
    restart!.style.visibility = "visible";
    restart?.addEventListener("click", resetGame);
}

function handleShipSunk(): void {
    const [ship, alignment, x, y] = pollData.shipSunkEvent.split(" ");
    console.log(ship + " sunk!");
    const output = document.getElementById("output-text");
    if (pollData.activePlayer === player.name) {
        consoleOutput!.innerHTML = ship + " sunk!\n";
        consoleOutput!.innerHTML += "Your turn!\n";
        consoleOutput!.innerHTML +=
            "Click on a cell in Target Grid to attack!\n";
        colorSunkShips(
            ship.toLowerCase(),
            alignment.toLowerCase(),
            parseInt(x),
            parseInt(y)
        );
    } else {
        consoleOutput!.innerHTML = "You sunk " + ship + "!\n";
        consoleOutput!.innerHTML += "Awaiting " + opponent + "'s Attack!";
        colorSunkShips(
            ship.toLowerCase(),
            alignment.toLowerCase(),
            parseInt(x),
            parseInt(y)
        );
    }
}

function processNewState(): void {
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
                consoleOutput!.innerHTML = "Waiting for opponent to join...";
                console.log("Waiting for opponent to join...");
            } else {
                consoleOutput!.innerHTML =
                    "Waiting for " + opponent + " to place ships...";
                console.log("Waiting for opponent to place ships...");
            }
            updateState();
        } else {
            if (opponent === null) {
                opponent = pollData.activePlayer;
            }
            consoleOutput!.innerHTML = "Game started!\n";
            if (pollData.activePlayer === player.name) {
                consoleOutput!.innerHTML += "Your turn!\n";
                consoleOutput!.innerHTML +=
                    "Click on a cell in Target Grid to attack!\n";
            } else {
                consoleOutput!.innerHTML +=
                    "Waiting for " + opponent + " to attack...\n";
                updateState();
            }
        }
        return;
    }

    if (pollData.revisionId === oldRevisionId) {
        updateState();
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

    consoleOutput!.style.color = "white";
    if (pollData.activePlayer !== player.name) {
        consoleOutput!.style.backgroundColor = "#6b7280";
        updateState();
    } else {
        consoleOutput!.style.backgroundColor = "#3b82f6";
        if (DEBUG) {
            while (true) {
                const randomCell = document.getElementById(
                    "opponent-grid-" + rand()
                );
                if (randomCell!.dataset.attacked === undefined) {
                    setTimeout(function () {
                        randomCell?.click();
                    }, 200);
                    break;
                }
            }
        }
    }
}

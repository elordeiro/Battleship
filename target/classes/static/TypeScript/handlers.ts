// Event handlers =============================================================
function placeShip(): void {
    if (droppedShip.type === "none") {
        return;
    }
    let i = droppedShip.gridCell;
    if (droppedShip.alignment === "horizontal") {
        for (let j = 0; j < droppedShip.length; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (i + j)
            );
            if (cell) {
                cell.dataset.occupied = "true";
            }
        }
    } else {
        for (let j = 0; j < droppedShip.length; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (i + j * 10)
            );
            if (cell) {
                cell.dataset.occupied = "true";
            }
        }
    }
    for (let j = 0; j < droppedShip.length; j++) {
        document.getElementById(
            "player-ships" + "-" + droppedShip.type + "-" + (j + 1)
        )!.dataset.placed = "true";
    }
    if (player) {
        player.ships.push(
            new Ship(
                droppedShip.type.toUpperCase(),
                linearTo2D(i),
                droppedShip.alignment.toUpperCase()
            )
        );
    }
    droppedShip.type = "none";
}

function handleClickOceanGrid(cellIdx: number): void {
    if (gameStarted) {
        return;
    }

    if (selectedShip.type === "none") {
        return;
    }

    const ship = {
        type: selectedShip.type,
        coordinate: cellIdx,
        alignment: selectedShip.alignment,
    };
    if (overlaps(ship, cellIdx)) {
        return;
    }

    if (wasSet(ship.type)) {
        return;
    }

    if (shipOutOfBounds(ship, cellIdx)) {
        return;
    }

    const len = getShipLength(ship.type);
    if (ship.alignment === "horizontal") {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j)
            );
            cell!.className = "grid-item-" + ship.type;
        }
    } else {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j * 10)
            );
            cell!.className = "grid-item-" + ship.type;
        }
    }
    selectedShip.gridCell = cellIdx;
    Array.from(playerShips?.childNodes ?? [])
        .filter((cell) => (cell as HTMLElement).id.includes(ship.type))
        .map((cell) => ((cell as HTMLElement).style.opacity = "1"));
    consoleOutput!.innerHTML =
        ship.type +
        " placed at (" +
        linearToNumLetters(cellIdx)[0] +
        ", " +
        linearToNumLetters(cellIdx)[1] +
        ")\n";
    removeShipFromShips(ship);
    if (player.ships.length === 4) {
        consoleOutput!.innerHTML += "All ships placed!\n";
        consoleOutput!.innerHTML += "Click Start Game to begin!\n";
    }

    droppedShip = {
        type: selectedShip.type,
        length: selectedShip.length,
        alignment: selectedShip.alignment,
        gridCell: selectedShip.gridCell,
    };
    selectedShip.type = "none";
}

function handleClickTargetGrid(cellIdx: number): void {
    if (!gameStarted) {
        return;
    }
    if (pollData.activePlayer !== player.name) {
        return;
    }
    const cell = document.getElementById(targetGrid?.id + "-" + cellIdx);
    if (cell!.dataset.attacked === "true") {
        console.log("Invalid attack");
        return;
    } else {
        Attack.coordinates = linearTo2D(cellIdx);
        cell!.dataset.attacked = "true";
        console.log(Attack);
        pollData.activePlayer = "opponent";
        attack();
    }
}

function handleMouseOverOceanGrid(cellIdx: number): void {
    if (gameStarted || pollData.game_over === true) {
        return;
    }
    const ship = {
        type: selectedShip.type,
        coordinate: cellIdx,
        alignment: selectedShip.alignment,
    };

    if (wasSet(ship.type)) {
        return;
    }

    if (ship.type === "none") {
        return;
    }
    if (shipOutOfBounds(ship, cellIdx)) {
        return;
    }
    if (overlaps(ship, cellIdx)) {
        return;
    }

    const len = getShipLength(ship.type);
    if (ship.alignment === "horizontal") {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j)
            );
            if (cell!.className === "grid-item-neutral") {
                cell!.className = "grid-item-" + ship.type;
            }
        }
    } else {
        if (cellIdx + (len - 1) * 10 > numCells) {
            return;
        }
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j * 10)
            );
            if (cell!.className === "grid-item-neutral") {
                cell!.className = "grid-item-" + ship.type;
            }
        }
    }
}

function handleMouseOverTargetGrid(cellIdx: number): void {
    if (!gameStarted) {
        return;
    }
    if (pollData.activePlayer !== player.name) {
        return;
    }
    const cell = document.getElementById(targetGrid?.id + "-" + cellIdx);
    if (cell!.className !== "grid-item-neutral") {
        return;
    } else {
        cell!.className = "grid-item-preview";
    }
}

function handleMouseOutOceanGrid(cellIdx: number): void {
    if (gameStarted || pollData.game_over === true) {
        return;
    }
    // if (selectedShip === null || wasSet(selectedShip)) {

    const ship = {
        type: selectedShip.type,
        coordinate: cellIdx,
        alignment: selectedShip.alignment,
    };
    if (ship.type === "none") {
        return;
    }
    if (wasSet(ship.type)) {
        return;
    }
    const len = getShipLength(ship.type);
    if (ship.alignment === "horizontal") {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j)
            );
            if (cell?.className === "grid-item-" + ship.type) {
                cell!.className = "grid-item-neutral";
            }
        }
    } else {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j * 10)
            );
            if (cell?.className === "grid-item-" + ship.type) {
                cell!.className = "grid-item-neutral";
            }
        }
    }
}

function handleMouseOutTargetGrid(cellIdx: number): void {
    if (!gameStarted) {
        return;
    }
    const cell = document.getElementById(targetGrid?.id + "-" + cellIdx);
    if (cell!.className !== "grid-item-preview") {
        return;
    } else {
        cell!.className = "grid-item-neutral";
    }
}

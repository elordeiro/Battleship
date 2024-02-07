// Create grids and ships =====================================================
function createGrid(container: string): void {
    const grid = document.getElementById(container);

    // blank cell in top corner
    const blank = document.createElement("div");
    blank.className = "grid-label";
    blank.textContent = " ";
    if (container === "player-grid") {
        grid?.appendChild(blank);
    }
    // top row of letters
    for (let i = 0; i < 10; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-label";
        cell.textContent = String.fromCharCode(65 + i);
        grid?.appendChild(cell);
    }
    if (container === "opponent-grid") {
        grid?.appendChild(blank);
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
                label.textContent = String(Math.floor(i / 10) + 1);
                grid?.appendChild(label);
            }
            cell.dataset.occupied = "false";
            cell.addEventListener("click", function () {
                handleClickOceanGrid(i);
            });
            cell.addEventListener("mouseover", function () {
                handleMouseOverOceanGrid(i);
            });
            cell.addEventListener("mouseout", function () {
                handleMouseOutOceanGrid(i);
            });
            cell.addEventListener("dragenter", function (event) {
                event.preventDefault();
                handleMouseOverOceanGrid(i);
            });
            cell.addEventListener("dragover", function (event) {
                event.preventDefault();
            });
            cell.addEventListener("dragleave", function (event) {
                event.preventDefault();
                handleMouseOutOceanGrid(i);
            });
            cell.addEventListener("drop", function (event) {
                event.preventDefault();
                handleClickOceanGrid(i);
            });
            grid?.appendChild(cell);
        } else {
            cell.addEventListener("click", function () {
                handleClickTargetGrid(i);
            });
            cell.addEventListener("mouseover", function () {
                handleMouseOverTargetGrid(i);
            });
            cell.addEventListener("mouseout", function () {
                handleMouseOutTargetGrid(i);
            });
            grid?.appendChild(cell);
            if (i % 10 === 0) {
                // right column of numbers
                const label = document.createElement("div");
                label.className = "grid-label";
                label.textContent = String(i / 10);
                grid?.appendChild(label);
            }
        }
    }
}
createGrid("player-grid");
createGrid("opponent-grid");

function makeShipsOpaque(ship: string): void {
    if (wasSet(ship)) {
        return;
    }
    const cells = document.getElementsByClassName("grid-item-" + ship);
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i] as HTMLElement; // Typecast to HTMLElement
        cell.style.opacity = "0.4";
    }
}

function createShip(container: string, length: number, ship: string): void {
    const grid = document.getElementById(container);

    for (let i = 1; i <= length; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-" + ship;
        cell.id = container + "-" + ship + "-" + i;
        cell.addEventListener("click", function () {
            if (wasSet(ship)) {
                return;
            }
            selectedShip.type = ship;
            selectedShip.length = length;
            if (droppedShip.type === "none") {
                consoleOutput!.innerHTML = "Selected ship: " + ship + "\n";
                consoleOutput!.innerHTML +=
                    "Ship Alignment: " + selectedShip.alignment + "\n";
            }
            if (cell.className === "grid-item-" + ship) {
                makeShipsOpaque(ship);
            }
            if (droppedShip.type !== "none") {
                placeShip();
            }
        });
        cell.draggable = true;
        cell.addEventListener("dragstart", function (event) {
            cell.click();
            // Create a new canvas
            const canvas = document.createElement("canvas");
            canvas.width = cell.offsetWidth * length * 2;
            canvas.height = cell.offsetHeight * 2;

            // Get the context of the canvas
            const ctx = canvas.getContext("2d");

            // Draw each cell on the canvas
            if (selectedShip.alignment === "horizontal") {
                canvas.width = cell.offsetWidth * length * 2;
                canvas.height = cell.offsetHeight * 2;
                for (let i = 0; i < length; i++) {
                    ctx?.drawImage(image, i * cell.offsetWidth * 2, 0);
                }
            } else {
                canvas.width = cell.offsetWidth * 2;
                canvas.height = cell.offsetHeight * length * 2;
                for (let i = 0; i < length; i++) {
                    ctx?.drawImage(image, 0, i * cell.offsetHeight * 2);
                }
            }

            // Use the canvas as the drag image
            event.dataTransfer?.setDragImage(canvas, 0, 0);
        });
        cell.addEventListener("dragend", function () {
            Array.from(playerShips?.childNodes ?? [])
                .filter((cell) => (cell as HTMLElement).id.includes(ship))
                .map((cell) => ((cell as HTMLElement).style.opacity = "1"));
        });
        grid?.appendChild(cell);
    }
    for (let i = 1; i <= 10 - length; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-neutral";
        cell.id = container + "-" + i;
        grid?.appendChild(cell);
    }
}
playerShips!.style.gridTemplateColumns = "repeat(10, 30px)";
createShip("player-ships", 5, "carrier");
createShip("player-ships", 4, "battleship");
createShip("player-ships", 3, "cruiser");
createShip("player-ships", 3, "submarine");
createShip("player-ships", 2, "destroyer");

function rotateShipOnGrid() {
    if (droppedShip.type === "none") {
        return;
    }
    const ship = {
        type: droppedShip.type,
        coordinate: droppedShip.gridCell,
        alignment:
            droppedShip.alignment === "horizontal" ? "vertical" : "horizontal",
    };
    if (
        shipOutOfBounds(ship, droppedShip.gridCell) ||
        overlaps(ship, droppedShip.gridCell)
    ) {
        consoleOutput!.innerHTML =
            "Cannot rotate. \n" +
            "Ship would fall out of bounds or\n" +
            "overlap with another ship!";
        return;
    }
    if (droppedShip.alignment === "horizontal") {
        droppedShip.alignment = "vertical";
    } else {
        droppedShip.alignment = "horizontal";
    }
    const cells = document.getElementsByClassName(
        "grid-item-" + droppedShip.type
    );
    while (cells.length > 0) {
        cells[0].className = "grid-item-neutral";
    }
    const cell = document.getElementById(
        "player-grid" + "-" + selectedShip.gridCell
    );
    selectedShip = droppedShip;
    cell?.click();
    selectedShip.type = "none";
    consoleOutput!.innerHTML = "Selected ship: " + droppedShip.type + "\n";
    consoleOutput!.innerHTML +=
        "Ship Alignment: " + droppedShip.alignment + "\n";
    if (player.ships.length === 4) {
        consoleOutput!.innerHTML += "All ships placed!\n";
        consoleOutput!.innerHTML += "Click Start Game to begin!\n";
    }
}

function rotateShips(): void {
    if (selectedShip.alignment === "horizontal") {
        selectedShip.alignment = "vertical";
    } else {
        selectedShip.alignment = "horizontal";
    }
    if (selectedShip.type === "none") {
        rotateShipOnGrid();
        return;
    }
    consoleOutput!.innerHTML = "Selected ship: " + selectedShip.type + "\n";
    consoleOutput!.innerHTML += "Ship Alignment: " + selectedShip.alignment;
}
document.getElementById("rotate-ships")?.addEventListener("click", rotateShips);

function startGame(): void {
    if (player.ships.length >= 4) {
        if (droppedShip.type !== "none") {
            placeShip();
        }
        gameStarted = true;
        shipsDiv?.parentNode?.removeChild(shipsDiv);
        initGame();
    }
}
document.getElementById("start-game")?.addEventListener("click", startGame);

function rand() {
    return Math.floor(Math.random() * 100) + 1;
}

function resetGrids(): void {
    player.ships.length = 0;
    droppedShip.type = "none";
    playerGrid?.replaceChildren();
    playerShips?.replaceChildren();

    createGrid("player-grid");

    createShip("player-ships", 5, "carrier");
    createShip("player-ships", 4, "battleship");
    createShip("player-ships", 3, "cruiser");
    createShip("player-ships", 3, "submarine");
    createShip("player-ships", 2, "destroyer");
}

function autoPlacing(): void {
    resetGrids();
    while (player.ships.length < 5) {
        document.getElementById("player-ships-carrier-1")?.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand())?.click();

        document.getElementById("player-ships-battleship-1")?.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand())?.click();

        document.getElementById("player-ships-cruiser-1")?.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand())?.click();

        document.getElementById("player-ships-submarine-1")?.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand())?.click();

        document.getElementById("player-ships-destroyer-1")?.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        document.getElementById("player-grid-" + rand())?.click();
    }
    // placeShip();
}
document.getElementById("auto-place")?.addEventListener("click", autoPlacing);

var _a, _b, _c;
// Create grids and ships =====================================================
function createGrid(container) {
    const grid = document.getElementById(container);
    // blank cell in top corner
    const blank = document.createElement("div");
    blank.className = "grid-label";
    blank.textContent = " ";
    if (container === "player-grid") {
        grid === null || grid === void 0 ? void 0 : grid.appendChild(blank);
    }
    // top row of letters
    for (let i = 0; i < 10; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-label";
        cell.textContent = String.fromCharCode(65 + i);
        grid === null || grid === void 0 ? void 0 : grid.appendChild(cell);
    }
    if (container === "opponent-grid") {
        grid === null || grid === void 0 ? void 0 : grid.appendChild(blank);
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
                grid === null || grid === void 0 ? void 0 : grid.appendChild(label);
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
            grid === null || grid === void 0 ? void 0 : grid.appendChild(cell);
        }
        else {
            cell.addEventListener("click", function () {
                handleClickTargetGrid(i);
            });
            cell.addEventListener("mouseover", function () {
                handleMouseOverTargetGrid(i);
            });
            cell.addEventListener("mouseout", function () {
                handleMouseOutTargetGrid(i);
            });
            grid === null || grid === void 0 ? void 0 : grid.appendChild(cell);
            if (i % 10 === 0) {
                // right column of numbers
                const label = document.createElement("div");
                label.className = "grid-label";
                label.textContent = String(i / 10);
                grid === null || grid === void 0 ? void 0 : grid.appendChild(label);
            }
        }
    }
}
createGrid("player-grid");
createGrid("opponent-grid");
function makeShipsOpaque(ship) {
    if (wasSet(ship)) {
        return;
    }
    const cells = document.getElementsByClassName("grid-item-" + ship);
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]; // Typecast to HTMLElement
        cell.style.opacity = "0.4";
    }
}
function createShip(container, length, ship) {
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
                consoleOutput.innerHTML = "Selected ship: " + ship + "\n";
                consoleOutput.innerHTML +=
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
            var _a;
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
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, i * cell.offsetWidth * 2, 0);
                }
            }
            else {
                canvas.width = cell.offsetWidth * 2;
                canvas.height = cell.offsetHeight * length * 2;
                for (let i = 0; i < length; i++) {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, i * cell.offsetHeight * 2);
                }
            }
            // Use the canvas as the drag image
            (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setDragImage(canvas, 0, 0);
        });
        cell.addEventListener("dragend", function () {
            var _a;
            Array.from((_a = playerShips === null || playerShips === void 0 ? void 0 : playerShips.childNodes) !== null && _a !== void 0 ? _a : [])
                .filter((cell) => cell.id.includes(ship))
                .map((cell) => (cell.style.opacity = "1"));
        });
        grid === null || grid === void 0 ? void 0 : grid.appendChild(cell);
    }
    for (let i = 1; i <= 10 - length; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-item-neutral";
        cell.id = container + "-" + i;
        grid === null || grid === void 0 ? void 0 : grid.appendChild(cell);
    }
}
playerShips.style.gridTemplateColumns = "repeat(10, 30px)";
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
        alignment: droppedShip.alignment === "horizontal" ? "vertical" : "horizontal",
    };
    if (shipOutOfBounds(ship, droppedShip.gridCell) ||
        overlaps(ship, droppedShip.gridCell)) {
        consoleOutput.innerHTML =
            "Cannot rotate. \n" +
                "Ship would fall out of bounds or\n" +
                "overlap with another ship!";
        return;
    }
    if (droppedShip.alignment === "horizontal") {
        droppedShip.alignment = "vertical";
    }
    else {
        droppedShip.alignment = "horizontal";
    }
    const cells = document.getElementsByClassName("grid-item-" + droppedShip.type);
    while (cells.length > 0) {
        cells[0].className = "grid-item-neutral";
    }
    const cell = document.getElementById("player-grid" + "-" + selectedShip.gridCell);
    selectedShip = droppedShip;
    cell === null || cell === void 0 ? void 0 : cell.click();
    selectedShip.type = "none";
    consoleOutput.innerHTML = "Selected ship: " + droppedShip.type + "\n";
    consoleOutput.innerHTML +=
        "Ship Alignment: " + droppedShip.alignment + "\n";
    if (player.ships.length === 4) {
        consoleOutput.innerHTML += "All ships placed!\n";
        consoleOutput.innerHTML += "Click Start Game to begin!\n";
    }
}
function rotateShips() {
    if (selectedShip.alignment === "horizontal") {
        selectedShip.alignment = "vertical";
    }
    else {
        selectedShip.alignment = "horizontal";
    }
    if (selectedShip.type === "none") {
        rotateShipOnGrid();
        return;
    }
    consoleOutput.innerHTML = "Selected ship: " + selectedShip.type + "\n";
    consoleOutput.innerHTML += "Ship Alignment: " + selectedShip.alignment;
}
(_a = document.getElementById("rotate-ships")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", rotateShips);
function startGame() {
    var _a;
    if (player.ships.length >= 4) {
        if (droppedShip.type !== "none") {
            placeShip();
        }
        gameStarted = true;
        (_a = shipsDiv === null || shipsDiv === void 0 ? void 0 : shipsDiv.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(shipsDiv);
        initGame();
    }
}
(_b = document.getElementById("start-game")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", startGame);
function rand() {
    return Math.floor(Math.random() * 100) + 1;
}
function resetGrids() {
    player.ships.length = 0;
    droppedShip.type = "none";
    playerGrid === null || playerGrid === void 0 ? void 0 : playerGrid.replaceChildren();
    playerShips === null || playerShips === void 0 ? void 0 : playerShips.replaceChildren();
    createGrid("player-grid");
    createShip("player-ships", 5, "carrier");
    createShip("player-ships", 4, "battleship");
    createShip("player-ships", 3, "cruiser");
    createShip("player-ships", 3, "submarine");
    createShip("player-ships", 2, "destroyer");
}
function autoPlacing() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    resetGrids();
    while (player.ships.length < 5) {
        (_a = document.getElementById("player-ships-carrier-1")) === null || _a === void 0 ? void 0 : _a.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        (_b = document.getElementById("player-grid-" + rand())) === null || _b === void 0 ? void 0 : _b.click();
        (_c = document.getElementById("player-ships-battleship-1")) === null || _c === void 0 ? void 0 : _c.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        (_d = document.getElementById("player-grid-" + rand())) === null || _d === void 0 ? void 0 : _d.click();
        (_e = document.getElementById("player-ships-cruiser-1")) === null || _e === void 0 ? void 0 : _e.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        (_f = document.getElementById("player-grid-" + rand())) === null || _f === void 0 ? void 0 : _f.click();
        (_g = document.getElementById("player-ships-submarine-1")) === null || _g === void 0 ? void 0 : _g.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        (_h = document.getElementById("player-grid-" + rand())) === null || _h === void 0 ? void 0 : _h.click();
        (_j = document.getElementById("player-ships-destroyer-1")) === null || _j === void 0 ? void 0 : _j.click();
        selectedShip.alignment = rand() % 2 === 0 ? "horizontal" : "vertical";
        (_k = document.getElementById("player-grid-" + rand())) === null || _k === void 0 ? void 0 : _k.click();
    }
    // placeShip();
}
(_c = document.getElementById("auto-place")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", autoPlacing);

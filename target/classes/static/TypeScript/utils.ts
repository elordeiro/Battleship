// Helper functions ===========================================================
function getShipLength(ship: string): number {
    if (ship === "carrier") {
        return 5;
    } else if (ship === "battleship") {
        return 4;
    } else if (ship === "cruiser") {
        return 3;
    } else if (ship === "submarine") {
        return 3;
    } else {
        return 2;
    }
}

// Function to generate a unique player ID
function generatePlayerId(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);

    return `${timestamp}-${random}`;
}

// Returns true if ship has been placed on grid
function wasSet(ship: string): boolean {
    if (ship === null) {
        return false;
    }
    const cell = document.getElementById("player-ships" + "-" + ship + "-" + 1);
    return cell?.dataset.placed === "true";
}

// Returns true if ship overlaps with another ship
function overlaps(ship: Ship, cellIdx: number): boolean {
    const len = getShipLength(ship.type);
    if (ship.alignment === "horizontal") {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j)
            );
            if (cell?.dataset.occupied === "true") {
                return true;
            }
        }
    } else {
        for (let j = 0; j < len; j++) {
            const cell = document.getElementById(
                playerGrid?.id + "-" + (cellIdx + j * 10)
            );
            if (cell?.dataset.occupied === "true") {
                return true;
            }
        }
    }
    return false;
}

// Returns true if a ship would fall out of bounds if placed at i
function shipOutOfBounds(ship: Ship, cellIdx: number): boolean {
    if (ship.alignment === "horizontal") {
        if (((cellIdx - 1) % gridSize) + getShipLength(ship.type) > gridSize) {
            return true;
        }
    } else {
        if (cellIdx + (getShipLength(ship.type) - 1) * 10 > numCells) {
            return true;
        }
    }
    return false;
}

// Removes ship from ships container after it has been placed on grid
function removeShipFromShips(ship: Ship): void {
    const len = getShipLength(ship.type);
    for (let j = 1; j <= len; j++) {
        const shipCell = document.getElementById(
            "player-ships" + "-" + ship.type + "-" + j
        );
        if (shipCell !== null) {
            shipCell.className = "grid-item-neutral";
        }
    }
}

// Converts linear index to 2D coordinates (x, y)
function linearTo2D(i: number): { x: number; y: number } {
    return {
        x: (i - 1) % gridSize,
        y: Math.floor((i - 1) / gridSize),
    };
}

// Converts 2D coordinates (x, y) to linear index (i)
function linearFrom2D(x: number, y: number): number {
    return y * gridSize + x + 1;
}

// Converts 2D coordinates (x, y) to letters and numbers (A1, B2, etc.)
function numLettersFrom2D(x: number, y: number): [string, string] {
    let letter;
    switch (x) {
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
    let number = String(y + 1);
    return [letter, number];
}

// Converts linear index (i) to letters and numbers (A1, B2, etc.)
function linearToNumLetters(i: number): [string, string] {
    let x = linearTo2D(i).x;
    let letter;
    switch (x) {
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
    let number = String(linearTo2D(i).y + 1);
    return [letter, number];
}

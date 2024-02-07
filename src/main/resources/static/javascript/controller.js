var _a, _b, _c;
// Server communication =======================================================
// Waiting Room ===============================================================
// Start a new game without a room ID
function startNewGame() {
    var _a, _b;
    const playerId = (_a = document.getElementById("player-id")) === null || _a === void 0 ? void 0 : _a.value;
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
    (_b = textArea === null || textArea === void 0 ? void 0 : textArea.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(textArea);
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
        var _a;
        roomID = data.roomID;
        Attack.roomID = roomID;
        console.log(data);
        const waitingRoom = document.getElementById("waiting-room");
        (_a = waitingRoom === null || waitingRoom === void 0 ? void 0 : waitingRoom.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(waitingRoom);
        document.getElementById("playing-room").style.visibility =
            "visible";
        document.getElementById("room-id-output").value = "Your Room ID is: " + roomID;
        displayInitialMessage();
        if (window.innerWidth < 760) {
            targetGridContainer === null || targetGridContainer === void 0 ? void 0 : targetGridContainer.remove();
        }
    })
        .catch((error) => {
        console.error("Error:", error);
    });
}
(_a = document
    .getElementById("start-new-game")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", startNewGame);
// Join an existing game with a room ID
function joinGame() {
    var _a;
    const playerId = document.getElementById("player-id")
        .value;
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
    (_a = textArea === null || textArea === void 0 ? void 0 : textArea.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(textArea);
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
            }
            else if (response.status === 406) {
                alert("Room is full");
            }
            else if (response.status === 409) {
                alert("Player already in room");
            }
            throw new Error("Could not join room");
        }
        return response.json();
    })
        .then((data) => {
        var _a;
        console.log(data);
        pollData = data;
        const waitingRoom = document.getElementById("waiting-room");
        (_a = waitingRoom === null || waitingRoom === void 0 ? void 0 : waitingRoom.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(waitingRoom);
        document.getElementById("playing-room").style.visibility =
            "visible";
        document.getElementById("room-id-output").value = "Your Room ID is: " + roomID;
        setOpponentID();
        displayInitialMessage();
        if (window.innerWidth < 760) {
            targetGridContainer === null || targetGridContainer === void 0 ? void 0 : targetGridContainer.remove();
        }
    })
        .catch((error) => {
        console.error("Error:", error);
    });
}
(_b = document.getElementById("join-game")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", joinGame);
// Attempt to join a random game that is looking for a player
function joinRandomGame() {
    const playerId = document.getElementById("player-id")
        .value;
    if (playerId === "" && player === null) {
        alert("Please enter a player ID");
        return;
    }
    player = new Player(playerId);
    const payload = {
        actionType: "JOIN_RANDOM",
        playerID: playerId,
        roomID: -1,
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
            }
            else if (response.status === 406) {
                alert("Player denied entry to room");
                throw new Error("Player denied entry to room");
            }
            else if (response.status === 400) {
                throw new Error("Player already in room");
            }
        }
        return response.json();
    })
        .then((data) => {
        var _a, _b;
        console.log(data);
        pollData = data;
        if (data.requestToJoin === true) {
            roomID = data.roomID;
            throw new Error("Invitation timed out");
        }
        console.log(data);
        roomID = data.roomID;
        Attack.roomID = roomID;
        (_a = textarea === null || textarea === void 0 ? void 0 : textarea.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(textarea);
        const waitingRoom = document.getElementById("waiting-room");
        (_b = waitingRoom === null || waitingRoom === void 0 ? void 0 : waitingRoom.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(waitingRoom);
        document.getElementById("playing-room").style.visibility =
            "visible";
        document.getElementById("room-id-output").value = "Your Room ID is: " + roomID;
        setOpponentID();
        displayInitialMessage();
        if (window.innerWidth < 760) {
            targetGridContainer === null || targetGridContainer === void 0 ? void 0 : targetGridContainer.remove();
        }
    })
        .catch((error) => {
        console.error("Error:", error);
        textarea.innerHTML = "No available games, please try again later";
    });
}
(_c = document
    .getElementById("join-random-game")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", joinRandomGame);
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
    if (window.innerWidth < 760 && targetGridContainer) {
        bothGrids === null || bothGrids === void 0 ? void 0 : bothGrids.appendChild(targetGridContainer);
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
        }
        else {
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
        }
        else {
            oldRevisionId = pollData.revisionId;
            pollData = data;
        }
        processNewState();
    })
        .catch((error) => {
        console.error("Error:", error);
        if (pollData.game_over === false) {
            setTimeout(updateState, 3000);
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

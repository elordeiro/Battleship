# Milestone 1: Battleship Specificaion

### Team
- Nathan Brilmayer
- Nguyen Huynh 
- Estevao Lordeiro
- Michael Perez

### Overview
Battleship is played with two people. Each player has the following:  
- 1 Ocean grid
- 1 Targeting grid
- A fleet of 5 ships

### Grid Specs
- Grids are 10 x 10
- X axis is marked numerically
- Y axis is marked alphabetically

### Ship Specs
- Destroyer: (1 x 2)
- Submarine: (1 x 3)
- Cruiser:(1 x 3)
- Battleship: (1 x 4)
- Carrier: (1 x 5)

### Game Play

- The game is initialized with both players placing their fleet of ships consisting of one of each type onto the ocean grid. 
- Ships can only be placed horizontally and vertically, diagonal placement isn’t allowed.
- A player can only view their own board and not the opponents.  
- The game is turn based.  
- To complete a turn, each player will:  
  1. Select one coordinate on their targeting grid to fire upon. 
  2. The result of targeted squared will is a miss or a hit of a ship. 
  3. The targeted coordinate is compared to the opponent’s ocean grid.  
     If a ship is present at that coordinate the ship is hit.  
     If no ship is present then the shot is a miss.  
- The player’s target grid will mark the result of a shot. 
- A white marker represents a miss, and red marker represents a hit. 
- When a ship is hit, the ship owner’s ocean grid will be updated with a red marker of the result. 
- A player cannot target a coordinate that is already marked from a previous turn.
- If all coordinates of a ship is marked hit, the ship is sunk, and the opponent is notified of sinking and type of ship. 
- The game is won when a player sinks all of the opponents ships.

### Board Example

|   | A | B | C | D | E | F | G | H | I | J |   | + |   | A | B | C | D | E | F | G | H | I | J |   | 
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 |[D]|   |   | A | A | A | A | A |   |   |   | + |   | O | H | H | O | O | O | O | O | O | O |   |
| 2 | D |   |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 3 |   | S |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 4 |   | S |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 5 |   |[S]|   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 6 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | M | O | M | O | O |   |
| 7 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 8 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 9 |   |   | C | C | C |   |   |   |   |   |   | + |   | O | H | M | O | O | O | O | O | O | O |   |
|10 |   |   |   |   |   |   |   |   |   |   |   | + |   | O | O | M | O | O | O | O | O | O | O |   |

# Milestone 2: Front-end/Back-end Protocol

### Front-end dependencies from Back-end to create view
  1. revisionID
        -This value is checked to determine if a view update is required.

  2. shipSunkEvent
        -If a new state has a ship sunk, a message of the ship type that was sunk to be displayed as a message to the users. This field is optional and is null when no ship sinking has occured.

  3. game_over
        -This is an optional message that is null unless a new state has a player that won. The field contains the name of the winning player to be displayed.

  4. activePlayer
        -This field holds the playerID of who's turn it is in the new state. The message will tell the frontend to display a UI event to the player to notify to take their turn.
  
  5. The coordinate of the recent action and its result.

### JSON Object Representation for Poll Endpoint
```
 /* State information returned by poll
 */
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
// ----------------------------------------------------------------------------
```

### User Actions

1. Initialize: Before playing and after the waiting room, the player selects their ships and chooses what alignment and what coordinate the place their ships on the ocean grid. Once all ships are placed and the player submits, the play endpoint is requested with the new ship data.

2. Play: When it is the User's turn, they select a coordinate on their target grid to fire upon, this information is passed through the play endpoint.

The play request contains header data that contains what type of message it is to distinguish between initializing and playing, the gameID, and the playerID for the game server.

### User Action JSON Representation
```
/* ----------------------------------------
 * Sent in /api/play request
 */

interface Play {
    actionType: "Play";  // message to send to opponent, either "play" or "init"
    gameId : number; //ID of the game context for the gameServer
    playerID : number; //ID of what player is sending a play request

    //for "Play" message
    row    : number;  // shot's row
    col    : number;  // shot's column

    //for "init" message
    ships : Ship[];
}

/* Ship state
*/
interface Ship {
    name: string;   // ship's name, "CARRIER", "BATTLESHIP", "CRUISER", "SUBMARINE", "DESTROYER"
    alignment : string; //Ship enum, can be "HORIZONTAL", "VERTICAL"
    startX : number; //the X coordinate of the root position
    startY : number; //the Y coordinate of the root position
}

```


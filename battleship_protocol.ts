/* ----------------------------------------
 * Received in /api/poll response
 */

type PollResponse = PollData | null;

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

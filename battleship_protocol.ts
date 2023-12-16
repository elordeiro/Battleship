/* ----------------------------------------
 * Received in /api/poll response
 */

type PollResponse = PollData | null;

/* State information returned by poll
 */
interface PollData {
    revision : number,  // >0, increases with every change to game state
    player   : Player;  // this player's state
    opponent : Player;  // opponent's state
    need_play: boolean; // true if it's this player's turn
    game_over: boolean; // true if game is over
    winner?  : string;  // name of winner, if game is over
}

/* Player state
 */
interface Player {
    name  : string;     // player's name
    ships : Ship[];     // player's ships
    shots : Shot[];     // player's shots
    hits  : Shot[];     // player's hits
    misses: Shot[];     // player's misses
}

/* Ship state
*/
interface Ship {
    hits: Shot[];   // ship's hits
    name: string;   // ship's name
    sunk: boolean;  // true if ship is sunk
}

/* Shot state
 */
interface Shot {
    row: number;  // shot's row
    col: number;  // shot's column
}

// ----------------------------------------------------------------------------

/* ----------------------------------------
 * Sent in /api/play request
 */

interface PlayRequest {
    message: "Play";  // message to send to opponent
    player : Player;  // player's name
    row    : number;  // shot's row
    col    : number;  // shot's column
}

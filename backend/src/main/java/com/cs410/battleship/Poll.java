package com.cs410.battleship;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Poll {
    @JsonProperty(value="revisionId")
    int revisionId;  // >0, increases with every change to game state
    @JsonProperty(value="shipSunkEvent")
    String shipSunkEvent = null; //message containing what type of ship to display event to player
    @JsonProperty(value="game_over")
    boolean game_over;// true if game is over
    @JsonProperty(value="winner")
    String winner = null;  // name of winner, if game is over
    @JsonProperty(value="activePlayer")
    String activePlayer; // playerID of whose turn it is
    @JsonProperty(value="actionXCord")
    int actionXCord; //X Coordinate of most recent targeted square
    @JsonProperty(value="actionYCord")
    int actionYCord; //Y Coordinate of most recent targeted square
    @JsonProperty(value="actionResult")
    String actionResult; //"HIT" or "MISS"

    public Poll(GameState gs){
        revisionId = gs.getRevisionId();
        shipSunkEvent = gs.getSinkingEvent();
        game_over = gs.isGameOver();
        winner = gs.getWinner();
        activePlayer= gs.getActivePlayer();
        actionXCord= gs.getActionXCoord();
        actionYCord= gs.getActionYCoord();
        actionResult= gs.getActionResult();
    }
}

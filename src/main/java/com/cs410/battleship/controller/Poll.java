package com.cs410.battleship.controller;

import com.cs410.battleship.GameState;
import com.fasterxml.jackson.annotation.JsonProperty;

class Poll {
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
        if (gs == null) {
            revisionId = -1;
            shipSunkEvent = null;
            game_over = false;
            winner = null;
            activePlayer= null;
            actionXCord= -1;
            actionYCord= -1;
            actionResult= null;
            return;
        }
        revisionId = gs.getRevisionId();
        shipSunkEvent = gs.getSinkingEvent();
        game_over = gs.isGameOver();
        winner = gs.getWinner();
        activePlayer= gs.getActivePlayer();
        actionXCord= gs.getActionXCoord();
        actionYCord= gs.getActionYCoord();
        actionResult= gs.getActionResult();
    }

    public static Poll nullPoll(){
        return new Poll(null);
    }
}

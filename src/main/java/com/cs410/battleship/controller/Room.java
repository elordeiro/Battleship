package com.cs410.battleship.controller;

import com.cs410.battleship.*;

import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.LinkedList;
import java.util.Queue;

public class Room {
    @JsonProperty(value="roomID")
    int roomID;
    @JsonProperty(value="playerOneID")
    private String playerOneID;
    @JsonProperty(value="playerTwoID")
    private String playerTwoID;
    @JsonProperty(value="revisionId")
    private int revisionId = -1;
    @JsonProperty(value="requestToJoin")
    public boolean requestToJoin = false;
    private Player playerOne;
    private Player playerTwo;
    private DeferredResult<ResponseEntity<String>> futureResult;
    private DeferredResult<ResponseEntity<String>> request;
    public  Queue<String> deniedPlayers = new LinkedList<>();
    public GameState gs;

    Room(String playerOneID){
        this.playerOneID = playerOneID;
        this.roomID = (int) (System.currentTimeMillis() % 1000) + (int) (Math.random() * 10);
        futureResult = new DeferredResult<>(30000L, ResponseEntity.ok().body(DataLoader.stringfy(this)));
    }

    public ResponseEntity<String> addPlayer(String playerTwoID){
        if (this.playerTwoID != null) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(DataLoader.stringfy("Room is full"));
        }
        if (playerOneID.equals(playerTwoID)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(DataLoader.stringfy("Player already in room"));
        }
        
        this.playerTwoID = playerTwoID;
        futureResult.setResult(ResponseEntity.ok().body(DataLoader.stringfy(this)));
        return ResponseEntity.ok().body(DataLoader.stringfy(this));
    }

    public DeferredResult<ResponseEntity<String>> requestToJoin(String payload){
        requestToJoin = true;
        playerTwoID = DataLoader.getPlayerID(payload);
        request = new DeferredResult<>(30000L, ResponseEntity.ok().body(DataLoader.stringfy(this)));
        futureResult.setResult(ResponseEntity.ok().body(DataLoader.stringfy(this)));
        return request;
    }

    public ResponseEntity<String> respondToJoin(String payload){
        boolean userChoice = DataLoader.userChoice(payload);
        requestToJoin = false;
        if (userChoice) {
            ResponseEntity<String> response = ResponseEntity.ok().body(DataLoader.stringfy(this));
            request.setResult(response);
            return response;
        } else {
            deniedPlayers.add(playerTwoID);
            playerTwoID = null;
            gs = null;
            request.setResult(ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(DataLoader.stringfy("Request denied")));
            return ResponseEntity.ok().body(DataLoader.stringfy(this));
        }
    }

    public ResponseEntity<String> init(String payload){
        if (playerOne == null) {
            playerOne = DataLoader.getPlayerObject(payload);
            if (playerOne == null) {
                return ResponseEntity.ok().body(DataLoader.stringfy("Was not able to create player"));
            }
            return ResponseEntity.ok().body(DataLoader.stringfy(this));
        } else if (playerTwo == null) {
            playerTwo = DataLoader.getPlayerObject(payload);
            gs = new GameState(playerOne, playerTwo);
            futureResult.setResult(ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs))));
            return ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs)));
        } else {
            return ResponseEntity.ok().body(DataLoader.stringfy("Game is full"));
        }
    }

    public ResponseEntity<String> play(String payload){
        Coordinate coord = DataLoader.getCoordinateObject(payload);
        if (coord != null) {
            gs.runTurnOnCoordinate(coord);
            futureResult.setResult(ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs))));
            return ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs)));
        }
         return ResponseEntity.ok().body(DataLoader.stringfy("Invalid coordinate"));
    }

    public DeferredResult<ResponseEntity<String>> poll(String payload) {
        int playerRevisionId = DataLoader.getRevisionId(payload);
        
        if (gs != null && playerRevisionId != gs.getRevisionId()) {
            futureResult = new DeferredResult<>(0L, ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs))));
        } else {
            if (gs == null) {
                futureResult = new DeferredResult<>(30000L, ResponseEntity.ok().body(DataLoader.stringfy(this)));
            } else {
                futureResult = new DeferredResult<>(30000L, ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs))));
            }
            
        }
        return futureResult;
    }

    public boolean canAccept(String playerTwoID){
        return  playerOne != null && 
                playerTwo == null &&
                !playerOneID.equals(playerTwoID) &&
                !deniedPlayers.contains(playerTwoID) &&
                !requestToJoin;
    }

    public String getPlayerOneID(){
        return this.playerOneID;
    }

    public String getPlayerTwoID(){
        return this.playerTwoID;
    }

    public int getRoomID(){
        return this.roomID;
    }

    public int getRevisionId(){
        return this.revisionId;
    }
}

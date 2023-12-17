package com.cs410.battleship.controller;

import com.cs410.battleship.*;

import java.util.concurrent.*;

import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class GameStateController {
    private GameState gs;
    private Player playerOne;
    private Player playerTwo;
    private DeferredResult<String> result;
    private ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    private ResponseEntity<String> initializeGame(String payload){
        if (playerOne == null) {
            playerOne = DataLoader.getPlayerObject(payload);
            if (playerOne == null) {
                return ResponseEntity.ok().body(DataLoader.stringfy("Was not able to create player"));
            }
            return ResponseEntity.ok().body(DataLoader.stringfy("Player one created"));
        } else if (playerTwo == null) {
            playerTwo = DataLoader.getPlayerObject(payload);
            gs = new GameState(playerOne, playerTwo);
            return ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs)));
        } else {
            return ResponseEntity.ok().body(DataLoader.stringfy("Game is full"));
        }
    }

    private ResponseEntity<String> playCoordinate(String payload){
        Coordinate coord = DataLoader.getCoordinateObject(payload);
        if (coord != null) {
            gs.runTurnOnCoordinate(coord);
            return ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs)));
        }
        return ResponseEntity.ok().body(DataLoader.stringfy("Invalid coordinate"));
    }

    @GetMapping("/")
    public String home(){
        return "index";
    }

    @GetMapping("/hello")
    public String hello(){
        return DataLoader.stringfy("hello world");
    }

    @GetMapping("/poll")
    public ResponseEntity<String> poll(){
        if (gs == null) {
            return ResponseEntity.ok().body(DataLoader.stringfy(Poll.nullPoll()));
        } else {
            return ResponseEntity.ok().body(DataLoader.stringfy(new Poll(gs)));
        }
    }

    @PostMapping("/play")
    public ResponseEntity<String> play(@RequestBody String payload){
        String actionType = DataLoader.getActionType(payload);

        if (actionType.equals("INIT")) {
            return initializeGame(payload);
        } else if (actionType.equals("Play")) {
            return playCoordinate(payload);
        } else {
            return ResponseEntity.ok().body(DataLoader.stringfy("Invalid action type"));
        }
    }
}

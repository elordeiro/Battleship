package com.cs410.battleship;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class GameStateController {
    private GameState gs;
    private Player playerOne;
    private Player playerTwo;

    @GetMapping("/poll")
    public ResponseEntity<Poll> pollData(){
        Player playerOne = new Player("Player One", new Ship[] {
                new Ship(ShipType.CARRIER, new Coordinate(0, 0), Alignment.HORIZONTAL),
                new Ship(ShipType.BATTLESHIP, new Coordinate(0, 1), Alignment.HORIZONTAL),
                new Ship(ShipType.CRUISER, new Coordinate(0, 2), Alignment.HORIZONTAL),
                new Ship(ShipType.SUBMARINE, new Coordinate(0, 3), Alignment.HORIZONTAL),
                new Ship(ShipType.DESTROYER, new Coordinate(0, 4), Alignment.HORIZONTAL)
        });

        Player playerTwo = new Player("Player Two", new Ship[] {
                new Ship(ShipType.CARRIER, new Coordinate(0, 0), Alignment.HORIZONTAL),
                new Ship(ShipType.BATTLESHIP, new Coordinate(0, 1), Alignment.HORIZONTAL),
                new Ship(ShipType.CRUISER, new Coordinate(0, 2), Alignment.HORIZONTAL),
                new Ship(ShipType.SUBMARINE, new Coordinate(0, 3), Alignment.HORIZONTAL),
                new Ship(ShipType.DESTROYER, new Coordinate(0, 4), Alignment.HORIZONTAL)
        });

        gs = new GameState(playerOne, playerTwo);
        gs.runTurnOnCoordinate(new Coordinate(0,0));
        Poll poll = new Poll(gs);
        return ResponseEntity.ok(poll);
    }
    @PostMapping("/play")
    public ResponseEntity<Void> playerAction(@RequestParam String actionType, @RequestParam int gameID, @RequestParam int playerID,
                                             @RequestParam int x,@RequestParam int y, @RequestParam Ship[] ships){
        switch(actionType){
            case "play":
                gs.runTurnOnCoordinate(new Coordinate(x,y));
                break;
            case "init":
                if(playerOne == null){
                    playerOne = new Player(Integer.toString(playerID), ships); //need to parse and init ships
                }
                else if(playerTwo == null){
                    playerTwo = new Player(Integer.toString(playerID), ships);
                    gs = new GameState(playerOne, playerTwo);
                }
                break;
        }
        return ResponseEntity.ok().build();
    }
}



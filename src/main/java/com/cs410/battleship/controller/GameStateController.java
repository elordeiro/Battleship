package com.cs410.battleship.controller;

import java.util.LinkedList;
import java.util.Queue;

import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api")
public class GameStateController {
    private Queue<Room> rooms = new LinkedList<>();

    private ResponseEntity<String> createRoom(String payload){
        String playerID = DataLoader.getPlayerID(payload);
        Room room = new Room(playerID);
        rooms.add(room);
        return ResponseEntity.ok().body(DataLoader.stringfy(room));
    }

    private ResponseEntity<String> joinRoom(String payload){
        int roomID = DataLoader.getRoomID(payload);
        Room room = rooms.stream().filter(r -> r.getRoomID() == roomID).findFirst().orElse(null);
        if (room != null) {
            return room.addPlayer(DataLoader.getPlayerID(payload));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(DataLoader.stringfy("Invalid room ID"));
    }

    private DeferredResult<ResponseEntity<String>> joinRandom(String payload){
        int roomID = DataLoader.getRoomID(payload);
        if (roomID == -1) {
            String playerTwoID = DataLoader.getPlayerID(payload);
            for (Room room : rooms) {
                if (room.canAccept(playerTwoID)) {
                    return room.requestToJoin(payload);
                }
            }
        }
        DeferredResult<ResponseEntity<String>> request = new DeferredResult<>();
        request.setResult(ResponseEntity.status(HttpStatus.NOT_FOUND).body(DataLoader.stringfy("No available rooms")));
        return request;
    }

    private ResponseEntity<String> respondToJoin(String payload){
        int roomID = DataLoader.getRoomID(payload);
        Room room = rooms.stream().filter(r -> r.getRoomID() == roomID).findFirst().orElse(null);
        if (room != null) {
            return room.respondToJoin(payload);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(DataLoader.stringfy("Invalid room ID"));
    }

    private ResponseEntity<String> initializeGame(String payload){
        int roomID = DataLoader.getRoomID(payload);
        Room room = rooms.stream().filter(r -> r.getRoomID() == roomID).findFirst().orElse(null);
        if (room != null) {
            return room.init(payload);
        }
        return ResponseEntity.ok().body(DataLoader.stringfy("Invalid room ID"));
    }

    private ResponseEntity<String> playCoordinate(String payload){
        int roomID = DataLoader.getRoomID(payload);
        Room room = rooms.stream().filter(r -> r.getRoomID() == roomID).findFirst().orElse(null);
        if (room != null) {
            ResponseEntity<String> response = room.play(payload);
            if (room.gs.isGameOver()) {
                rooms.remove(room);
            }
            return response;
        }
        return ResponseEntity.ok().body(DataLoader.stringfy("Invalid room ID"));
    }

    @GetMapping("/")
    public String home(){
        return "index";
    }

    @GetMapping("/hello")
    public String hello(){
        return DataLoader.stringfy("hello world");
    }

    @PostMapping("/poll")
    public DeferredResult<ResponseEntity<String>> poll(@RequestBody String payload){
        String actionType = DataLoader.getActionType(payload);

        if (actionType.equals("POLL")) {
            int roomID = DataLoader.getRoomID(payload);
            Room room = rooms.stream().filter(r -> r.getRoomID() == roomID).findFirst().orElse(null);
            if (room != null) {
                return room.poll(payload);
            }
            DeferredResult<ResponseEntity<String>> request = new DeferredResult<>();
            request.setResult(ResponseEntity.status(HttpStatus.NOT_FOUND).body(DataLoader.stringfy("Invalid room ID")));
            return request;
        } else if(actionType.equals("JOIN_RANDOM")) {
            return joinRandom(payload);
        } else {
            DeferredResult<ResponseEntity<String>> request = new DeferredResult<>();
            request.setResult(ResponseEntity.status(HttpStatus.NOT_FOUND).body(DataLoader.stringfy("Invalid action type")));
            return request;
        }
    }

    @PostMapping("/play")
    public ResponseEntity<String> play(@RequestBody String payload){
        String actionType = DataLoader.getActionType(payload);

        if (actionType.equals("INIT")) {
            return initializeGame(payload);
        } else if (actionType.equals("PLAY")) {
            return playCoordinate(payload);
        } else if (actionType.equals("NEW")) {
            return createRoom(payload);
        } else if (actionType.equals("JOIN")) {
            return joinRoom(payload);
        } else if (actionType.equals("RESPOND")) {
            return respondToJoin(payload);
        } else {
            return ResponseEntity.ok().body(DataLoader.stringfy("Invalid action type"));
        }
    }
}

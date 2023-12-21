package com.cs410.battleship.controller;

import com.cs410.battleship.Alignment;
import com.cs410.battleship.Coordinate;
import com.cs410.battleship.ShipType;
import com.cs410.battleship.Player;
import com.cs410.battleship.Ship;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class DataLoader {

    static ObjectMapper objectMapper = new ObjectMapper();

    public static String stringfy(Object obj) {
        try {
            String json = objectMapper.writeValueAsString(obj);
            return json;
        } catch (Exception e) {
            return "error";
        }
    }

    public static String getPlayerID(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            String playerID = node.get("playerID").asText();
            return playerID;
        } catch (Exception e) {
            return e.toString();
        }
    }

    public static int getRoomID(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            int roomID = node.get("roomID").asInt();
            return roomID;
        } catch (Exception e) {
            return -1;
        }
    }

    public static int getRevisionId(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            int revisionId = node.get("revisionId").asInt();
            return revisionId;
        } catch (Exception e) {
            return -1;
        }
    }

    public static boolean userChoice(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            boolean userChoice = node.get("choice").asBoolean();
            return userChoice;
        } catch (Exception e) {
            return false;
        }
    }

    public static String getActionType (String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            String actionType = node.get("actionType").asText();
            return actionType;
        } catch (Exception e) {
            return e.toString();
        }
    }

    public static Coordinate getCoordinateObject(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            JsonNode coord = node.get("coordinates");
            int x = coord.get("x").asInt();
            int y = coord.get("y").asInt();
            return new Coordinate(x, y);
        } catch (Exception e) {
            return null;
        }
    }

    private static Ship getShipObject(JsonNode ship) {
        try {
            String type = ship.get("type").asText();
            ShipType shipType = ShipType.valueOf(type);
            JsonNode coord = ship.get("coordinates");
            int x = coord.get("x").asInt();
            int y = coord.get("y").asInt();
            Coordinate coordinate = new Coordinate(x, y);
            String orientation = ship.get("alignment").asText();
            Alignment alignment = Alignment.valueOf(orientation);

            return new Ship(shipType, coordinate, alignment);
        } catch (Exception e) {
            return null;
        }
    }

    public static Player getPlayerObject(String payload) {
        try {
            JsonNode node = objectMapper.readTree(payload);
            String playerID = node.get("playerID").asText();
            JsonNode shipsArray = node.get("ships");
            Ship[] ships = new Ship[5];
            int i = 0;
            for (JsonNode ship : shipsArray) {
                ships[i] = getShipObject(ship);
                i++;
            }
            
            return new Player(playerID, ships);
        } catch (Exception e) {
            return null;
        }
    }
}

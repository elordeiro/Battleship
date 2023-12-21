package com.cs410.battleship;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GameStateTest {
    private static Ship[] ships = new Ship[] {
        Ship.of(ShipType.CARRIER, Coordinate.of(0, 0), Alignment.HORIZONTAL),
        Ship.of(ShipType.BATTLESHIP, Coordinate.of(0, 1), Alignment.HORIZONTAL),
        Ship.of(ShipType.CRUISER, Coordinate.of(0, 2), Alignment.HORIZONTAL),
        Ship.of(ShipType.SUBMARINE, Coordinate.of(0, 3), Alignment.HORIZONTAL),
        Ship.of(ShipType.DESTROYER, Coordinate.of(0, 4), Alignment.HORIZONTAL)
    };

    @Test
    void testGameStateCreation() {
        Player playerOne = new Player("Player 1", ships);
        Player playerTwo = new Player("Player 2", ships);
        GameState gameState = new GameState(playerOne, playerTwo);
        assertEquals(playerOne, gameState.activePlayer);
        assertFalse(gameState.gameOver);
        assertNull(gameState.winner);
    }

    @Test
    void testRunTurnOnCoordinate() {
        Player playerOne = new Player("Player 1", ships);
        Player playerTwo = new Player("Player 2", ships);
        GameState gameState = new GameState(playerOne, playerTwo);
        Coordinate coordinate = new Coordinate(0, 0);
        gameState.runTurnOnCoordinate(coordinate);
        assertEquals(playerTwo, gameState.activePlayer);
    }

    Ship[] justOneShip() {
        return new Ship[] {
            new Ship (ShipType.DESTROYER, Coordinate.of(0, 0), Alignment.HORIZONTAL)
        };
    }
    @Test
    void testCheckGameOver() {
        Player playerOne = new Player("Player 1", justOneShip());
        Player playerTwo = new Player("Player 2", justOneShip());
        GameState gameState = new GameState(playerOne, playerTwo);
        
        gameState.runTurnOnCoordinate(Coordinate.of(0, 0));
        gameState.runTurnOnCoordinate(Coordinate.of(0, 0));
        gameState.runTurnOnCoordinate(Coordinate.of(1, 0));
        assertTrue(gameState.isGameOver());
        assertEquals(playerOne, gameState.winner);
    }

    @Test
    void testValidateTurn() {
        Player playerOne = new Player("Player 1", justOneShip());
        Player playerTwo = new Player("Player 2", justOneShip());
        GameState gameState = new GameState(playerOne, playerTwo);
        
        gameState.runTurnOnCoordinate(Coordinate.of(0, 0));
        assertEquals("HIT", gameState.getActionResult());
        assertEquals(null, gameState.getSinkingEvent());
        
        gameState.runTurnOnCoordinate(Coordinate.of(5, 5));
        assertEquals("MISS", gameState.getActionResult());

        gameState.runTurnOnCoordinate(Coordinate.of(1, 0));
        assertEquals("HIT", gameState.getActionResult());
        assertEquals("DESTROYER", gameState.getSinkingEvent());
    }

    @Test
    void testGetRevisionId() {
        Player playerOne = new Player("Player 1", ships);
        Player playerTwo = new Player("Player 2", ships);
        GameState gameState = new GameState(playerOne, playerTwo);
        assertEquals(0, gameState.getRevisionId());
    }
}
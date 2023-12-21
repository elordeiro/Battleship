package com.cs410.battleship;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

class PlayerTest {

    @Test
    void testAttackHit() {
        Player player = new Player("Michael", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });
        Player opponent = new Player("Estevao", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });

        // Attacks hit opponent's ship
        assertEquals(Optional.empty(), player.attack(opponent, Coordinate.of(0, 0)));
        assertEquals(Optional.empty(), opponent.attack(player, Coordinate.of(0, 0)));

        // Attacks hit opponent's ship and sinks it
        assertEquals(ShipType.DESTROYER, player.attack(opponent, Coordinate.of(1, 0)).get().shipType);
        assertEquals(ShipType.DESTROYER, opponent.attack(player, Coordinate.of(1, 0)).get().shipType);
    }

    // test for when player misses attack on opponent
    @Test
    void testAttackMiss() {
        Player player = new Player("Michael", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });
        Player opponent = new Player("Estevao", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });

        // Adjacent to opponent's ship
        assertEquals(Optional.empty(), player.attack(opponent, Coordinate.of(2, 0)));
        assertEquals(Optional.empty(), opponent.attack(player, Coordinate.of(2, 0)));

        assertEquals(Optional.empty(), player.attack(opponent, Coordinate.of(0, 2)));
        assertEquals(Optional.empty(), opponent.attack(player, Coordinate.of(0, 2)));

        // Far from opponent's ship
        assertEquals(Optional.empty(), player.attack(opponent, Coordinate.of(5, 5)));
        assertEquals(Optional.empty(), opponent.attack(player, Coordinate.of(5, 5)));

    }

    // tests hasLost with cases for whether all the ships are sunk or not
    @Test
    void testHasLost() {
        Player player = new Player("Michael", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });
        Player opponent = new Player("Estevao", new Ship[] {
            Ship.of(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        });

        // Player has not lost
        assertFalse(player.hasLost());
        assertFalse(opponent.hasLost());
        
        // Player has lost
        player.attack(opponent, Coordinate.of(0, 0));
        player.attack(opponent, Coordinate.of(1, 0));
        opponent.attack(player, Coordinate.of(0, 0));
        opponent.attack(player, Coordinate.of(1, 0));
        assertTrue(player.hasLost());
        assertTrue(opponent.hasLost());
    }

    // test if a player attempts to attack opponent out of bounds
    @Test
    void testAttackOutOfBounds() {
        Ship[] ships = {
            new Ship(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        };
        Player player = new Player("Michael", ships);

        // Player attacks out of bounds
        assertFalse(player.canReceiveAttack(Coordinate.of(-1, 0)));
        assertFalse(player.canReceiveAttack(Coordinate.of(0, -1)));
        assertFalse(player.canReceiveAttack(Coordinate.of(10, 0)));
        assertFalse(player.canReceiveAttack(Coordinate.of(0, 10)));
    }

    // test if a player attempts to attack opponent on a coordinate that has already been attacked
    @Test
    void testAttackSameCoordinate() {
        Ship[] ships = {
            new Ship(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
        };
        Player player = new Player("Michael", ships);
        Player opponent = new Player("Estevao", ships);

        // Player attacks a HIT coordinate
        player.attack(opponent, Coordinate.of(0, 0));
        assertFalse(opponent.canReceiveAttack(Coordinate.of(0, 0)));

        // Player attacks a MISS coordinate
        player.attack(opponent, Coordinate.of(5, 0));
        assertFalse(opponent.canReceiveAttack(Coordinate.of(5, 0)));
    }
}
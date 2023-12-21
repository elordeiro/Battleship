package com.cs410.battleship;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ShipTest {

    @Test
    void testShipCreation() {
        Coordinate coordinate = Coordinate.of(0, 0);
        Ship ship = Ship.of(ShipType.CARRIER, coordinate, Alignment.HORIZONTAL);
        assertEquals(ShipType.CARRIER, ship.shipType);
        assertEquals(5, ship.length);
        assertEquals(coordinate, ship.coordinate);
        assertEquals(Alignment.HORIZONTAL, ship.alignment);
    }

    @Test
    void testOutOfBoundsShipCreation() {
        assertThrows(IllegalArgumentException.class, () -> {
            Ship.of(ShipType.CARRIER, Coordinate.of(10, 10), Alignment.HORIZONTAL);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            Ship.of(ShipType.CARRIER, Coordinate.of(0, 10), Alignment.HORIZONTAL);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            Ship.of(ShipType.CARRIER, Coordinate.of(10, 0), Alignment.HORIZONTAL);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            Ship.of(ShipType.CARRIER, Coordinate.of(-1, 0), Alignment.HORIZONTAL);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            Ship.of(ShipType.CARRIER, Coordinate.of(0, -1), Alignment.HORIZONTAL);
        });
    }

    @Test
    void testIsSunk() {
        Coordinate coordinate = Coordinate.of(0, 0);
        Ship ship = Ship.of(ShipType.DESTROYER, coordinate, Alignment.HORIZONTAL);
        assertFalse(ship.isSunk());
        ship.wasHit(Coordinate.of(0, 0));
        ship.wasHit(Coordinate.of(1, 0));
        assertTrue(ship.isSunk());
    }

    @Test
    void testWasHit() {
        Coordinate coordinate = Coordinate.of(0, 0);
        Ship ship = Ship.of(ShipType.DESTROYER, coordinate, Alignment.HORIZONTAL);
        assertTrue(ship.wasHit(Coordinate.of(0, 0)));
        assertTrue(ship.wasHit(Coordinate.of(1, 0)));
        assertFalse(ship.wasHit(Coordinate.of(2, 0)));
    }
}
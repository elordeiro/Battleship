package com.cs410.battleship;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class GridTest {
    static Ship CARRIER = Ship.of(ShipType.CARRIER, Coordinate.of(0, 0), Alignment.HORIZONTAL);
    static Ship BATTLESHIP = Ship.of(ShipType.BATTLESHIP, Coordinate.of(0, 1), Alignment.HORIZONTAL);
    static Ship CRUISER = Ship.of(ShipType.CRUISER, Coordinate.of(0, 2), Alignment.HORIZONTAL);
    static Ship SUBMARINE = Ship.of(ShipType.SUBMARINE, Coordinate.of(0, 3), Alignment.HORIZONTAL);
    static Ship DESTROYER = Ship.of(ShipType.DESTROYER, Coordinate.of(0, 4), Alignment.HORIZONTAL);
    
    static Grid grid = new Grid(new Ship[] {CARRIER, BATTLESHIP, CRUISER, SUBMARINE, DESTROYER});
    /*
     * Ocean Grid looks like this:
     *   0 1 2 3 4 5 6 7 8 9
     * 0 S S S S S ~ ~ ~ ~ ~
     * 1 S S S S ~ ~ ~ ~ ~ ~
     * 2 S S S ~ ~ ~ ~ ~ ~ ~
     * 3 S S S ~ ~ ~ ~ ~ ~ ~
     * 4 S S ~ ~ ~ ~ ~ ~ ~ ~
     * 5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
     * 6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
     * 7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
     * 8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
     * 9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
     */
    @Test
    void testCanReceiveAttack() {
        // Test that grid can receive attacks on all ships
        assert grid.canReceiveAttack(Coordinate.of(0, 0));
        assert grid.canReceiveAttack(Coordinate.of(4, 0));

        assert grid.canReceiveAttack(Coordinate.of(0, 1));
        assert grid.canReceiveAttack(Coordinate.of(3, 1));

        assert grid.canReceiveAttack(Coordinate.of(0, 2));
        assert grid.canReceiveAttack(Coordinate.of(2, 2));

        assert grid.canReceiveAttack(Coordinate.of(0, 3));
        assert grid.canReceiveAttack(Coordinate.of(2, 3));

        assert grid.canReceiveAttack(Coordinate.of(0, 4));
        assert grid.canReceiveAttack(Coordinate.of(1, 4));

        // Test that grid can receive attacks on squares that are not ships
        // Adjacent to ships
        assert grid.canReceiveAttack(Coordinate.of(0, 5));
        assert grid.canReceiveAttack(Coordinate.of(1, 5));
        assert grid.canReceiveAttack(Coordinate.of(2, 4));
        assert grid.canReceiveAttack(Coordinate.of(3, 2));
        assert grid.canReceiveAttack(Coordinate.of(4, 1));
        assert grid.canReceiveAttack(Coordinate.of(5, 0));
        
        // Around the board
        assert grid.canReceiveAttack(Coordinate.of(5, 5));
        assert grid.canReceiveAttack(Coordinate.of(6, 6));
        assert grid.canReceiveAttack(Coordinate.of(7, 7));
        assert grid.canReceiveAttack(Coordinate.of(8, 8));
        assert grid.canReceiveAttack(Coordinate.of(9, 9));

        // Test that grid cannot receive attacks on squares that are out of bounds
        assert !grid.canReceiveAttack(Coordinate.of(-1, 0));
        assert !grid.canReceiveAttack(Coordinate.of(0, -1));
        assert !grid.canReceiveAttack(Coordinate.of(10, 0));
        assert !grid.canReceiveAttack(Coordinate.of(0, 10));
        assert !grid.canReceiveAttack(Coordinate.of(10, 10));

        // Test that grid cannot receive attacks on squares that have already been attacked
        grid.receiveAttack(Coordinate.of(1, 2));
        assert !grid.canReceiveAttack(Coordinate.of(1, 2));
        grid.receiveAttack(Coordinate.of(0, 9));
        assert !grid.canReceiveAttack(Coordinate.of(0, 9));
    }

    // tests cases for both being able to receive an attack and not being able to receive attack
    @Test
    void testCanReceiveAttack2() {
        Grid grid = new Grid();
        // check if coordinates on an empty grid can receive an attack
        assertTrue(grid.canReceiveAttack(new Coordinate(5, 5)));
        grid.receiveAttack(new Coordinate(5, 5));
        // after attacking the coordinate, makes sure that spot cannot receive an attack
        assertFalse(grid.canReceiveAttack(new Coordinate(5, 5)));
    }
    
    // checks that adding overlapping ships throws an illegal arg exception
    @Test
    void testAddShipOverlapping() {
        Grid grid = new Grid();
        Ship ship1 = new Ship(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL);
        Ship ship2 = new Ship(ShipType.SUBMARINE, new Coordinate(0, 0), Alignment.VERTICAL);
        grid.addShip(ship1);
        assertThrows(IllegalArgumentException.class, () -> grid.addShip(ship2));
    }

    // test the ability of adding multiple ships in a ship array. Two separate cases within
    // 1 - adding multiple ships does not throw an illegal argument exception
    // 2 - adding multiple ships containing overlapping ships throws IAE
    // 3 - adding an empty array does nothing
    @Test
    void testAddShips() {
        Grid grid = new Grid();
        Grid grid2 = new Grid();
        Grid grid3 = new Grid();
        Ship[] ships = {
                new Ship(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
                new Ship(ShipType.SUBMARINE, new Coordinate(5, 5), Alignment.VERTICAL),
                new Ship(ShipType.CARRIER, new Coordinate(3, 3), Alignment.VERTICAL)
        };
        // overlapping ships that share the same coordinates
        Ship[] shipsOverlapping = {
                new Ship(ShipType.DESTROYER, new Coordinate(0, 0), Alignment.HORIZONTAL),
                new Ship(ShipType.SUBMARINE, new Coordinate(0, 0), Alignment.VERTICAL),
                new Ship(ShipType.CARRIER, new Coordinate(3, 3), Alignment.VERTICAL)
        };
        Ship[] shipsEmpty = {};
        assertDoesNotThrow(() -> grid.addShips(ships));
        assertThrows(IllegalArgumentException.class, () -> grid2.addShips(shipsOverlapping));
        assertDoesNotThrow(() -> grid3.addShips(shipsEmpty));
    }

    // tests that you cannot receive an attack if it is outside the boundaries of the grid
    @Test
    void testCanReceiveAttackOutOfBounds() {
        Grid grid = new Grid();
        assertFalse(grid.canReceiveAttack(new Coordinate(10, 10)));
    }

        // test to assert that a ship on a coordinate can receive an attack
    @Test
    void testCanReceiveAttackOnShip() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(3, 3);
        grid.addShip(new Ship(ShipType.DESTROYER, coordinate, Alignment.HORIZONTAL));
        assertTrue(grid.canReceiveAttack(coordinate));
    }

    // if a ship receives an attack the coordinate is marked as hit
    @Test
    void testReceiveAttackHit() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(3, 3);
        grid.addShip(new Ship(ShipType.DESTROYER, coordinate, Alignment.HORIZONTAL));
        assertEquals(Square.HIT, grid.receiveAttack(coordinate));
    }

    // an empty grid, making sure an attack is registered as a miss
    @Test
    void testReceiveAttackMiss() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(1, 1);
        assertEquals(Square.MISS, grid.receiveAttack(coordinate));
        assertEquals(Square.MISS, grid.grid[coordinate.x][coordinate.y]);
    }

    // when a square is set to hit, makes sure it is marked as hit and also not set to miss
    @Test
    void testSetSquareHit() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(5, 5);
        assertDoesNotThrow(() -> grid.setSquare(Square.HIT, coordinate));
        assertEquals(Square.HIT, grid.grid[coordinate.x][coordinate.y]);
        assertNotEquals(Square.MISS, grid.grid[coordinate.x][coordinate.y]);
    }

    // similarly, checks to see a square set to miss should be a miss at the coordinates it was assigned
    @Test
    void testSetSquareMiss() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(5, 5);
        assertDoesNotThrow(() -> grid.setSquare(Square.MISS, coordinate));
        assertEquals(Square.MISS, grid.grid[coordinate.x][coordinate.y]);
        assertNotEquals(Square.HIT, grid.grid[coordinate.x][coordinate.y]);
    }

    // testing that illegal argument works as intended in setSquare
    @Test
    void testSetSquareShip() {
        Grid grid = new Grid();
        Coordinate coordinate = new Coordinate(5, 5);
        assertThrows(IllegalArgumentException.class, () -> grid.setSquare(Square.SHIP, coordinate));
    }

    @Test
    void testReceiveAttack() {
        // Test that the grid will return Square.HIT when a ship is hit
        assert grid.receiveAttack(Coordinate.of(0, 0)) == Square.HIT;
        assert grid.receiveAttack(Coordinate.of(4, 0)) == Square.HIT;

        assert grid.receiveAttack(Coordinate.of(0, 1)) == Square.HIT;
        assert grid.receiveAttack(Coordinate.of(3, 1)) == Square.HIT;

        assert grid.receiveAttack(Coordinate.of(0, 2)) == Square.HIT;
        assert grid.receiveAttack(Coordinate.of(2, 2)) == Square.HIT;

        assert grid.receiveAttack(Coordinate.of(0, 3)) == Square.HIT;
        assert grid.receiveAttack(Coordinate.of(2, 3)) == Square.HIT;

        assert grid.receiveAttack(Coordinate.of(0, 4)) == Square.HIT;
        assert grid.receiveAttack(Coordinate.of(1, 4)) == Square.HIT;

        // Test that the grid will return Square.MISS when a ship is not hit
        assert grid.receiveAttack(Coordinate.of(0, 5)) == Square.MISS;
        assert grid.receiveAttack(Coordinate.of(1, 5)) == Square.MISS;
        assert grid.receiveAttack(Coordinate.of(2, 4)) == Square.MISS;
        assert grid.receiveAttack(Coordinate.of(3, 2)) == Square.MISS;
        assert grid.receiveAttack(Coordinate.of(4, 1)) == Square.MISS;
        assert grid.receiveAttack(Coordinate.of(5, 0)) == Square.MISS;


    }

    @Test
    void testSetSquare() {
        // Test that the grid will throw an exception when setting a square to a ship outside of the constructor
        assertThrows(IllegalArgumentException.class, () -> grid.setSquare(Square.SHIP, Coordinate.of(0, 0)));
        assertThrows(IllegalArgumentException.class, () -> grid.setSquare(Square.SHIP, Coordinate.of(4, 0)));

        // Test that the grid will set a square to a hit or miss
        grid.setSquare(Square.HIT, Coordinate.of(0, 5));
        assertEquals(grid.getSquare(Coordinate.of(0, 5)), Square.HIT);

        grid.setSquare(Square.MISS, Coordinate.of(1, 5));
        assertEquals(grid.getSquare(Coordinate.of(1, 5)), Square.MISS);

        grid.setSquare(Square.HIT, Coordinate.of(2, 4));
        assertEquals(grid.getSquare(Coordinate.of(2, 4)), Square.HIT);

        grid.setSquare(Square.MISS, Coordinate.of(3, 2));
        assertEquals(grid.getSquare(Coordinate.of(3, 2)), Square.MISS);
    }
}

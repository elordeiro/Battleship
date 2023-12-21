package com.cs410.battleship;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Ship:
 *  A ship is a collection of squares
 *  Responsible for:
 *  - Checking if the ship is sunk
 *  - Checking if the ship was hit
 * Invariants:
 * - A ship can only be sunk if the number of hits is equal to the length of the ship
 * - A ship can only be hit if the coordinate is in bounds and the coordinate is part of the ship
 * - A ship can only be created if the ship is in bounds
 */
public class Ship {

    @JsonProperty(value="type")
    final ShipType shipType;
    final int length;
    @JsonProperty(value="coordinates")
    final Coordinate coordinate;
    @JsonProperty(value="alignment")
    final Alignment alignment;
    int hits;

    /**
     * Constructs a new ship
     * @param type The type of ship
     * @param coordinate The coordinate of the ship
     * @param alignment The alignment of the ship
     * @throws IllegalArgumentException if the ship is out of bounds
     */
    public Ship(ShipType type, Coordinate coordinate, Alignment alignment) {
        checkCoordinate(coordinate);
        shipType = type;
        switch (type) {
        case CARRIER:
            length = 5;
            break;
        case BATTLESHIP:
            length = 4;
            break;
        case CRUISER:
            length = 3;
            break;
        case SUBMARINE:
            length = 3;
            break;
        case DESTROYER:
            length = 2;
            break;
        default:
            length = 0;
            break;
        }
        
        hits = 0;
        this.coordinate = coordinate;
        this.alignment = alignment;
    }

    public static Ship of (ShipType type, Coordinate coordinate, Alignment alignment) {
        return new Ship(type, coordinate, alignment);
    }

    /**
     * Checks if the coordinate is in bounds
     * @param coordinate The coordinate of the ship
     * @throws IllegalArgumentException if the ship is out of bounds
     */
    private void checkCoordinate(Coordinate coordinate) {
        if (coordinate.x < 0 || coordinate.x > 9 || coordinate.y < 0 || coordinate.y > 9) {
            throw new IllegalArgumentException("Coordinate out of bounds");
        }
        if (coordinate.x + length > 9 || coordinate.y + length > 9) {
            throw new IllegalArgumentException("Ship out of bounds");
        }
    }

    /**
     * Checks if the ship is sunk
     * @return true if the ship is sunk, false otherwise
     */
    public boolean isSunk() {
        return hits == length;
    }

    /**
     * Checks if the ship was hit
     * Deals damage to the ship if the ship was hit
     * @param coordinate The coordinate to check
     * @return true if the ship was hit, false otherwise
     */
    public boolean wasHit(Coordinate coordinate) {
        int x = coordinate.x;
        int y = coordinate.y;
        
        if (this.alignment == Alignment.HORIZONTAL) {
            if (x >= this.coordinate.x && x < this.coordinate.x + this.length && y == this.coordinate.y) {
                hits++;
                return true;
            }
        } else if (this.alignment == Alignment.VERTICAL) {
            if (y >= this.coordinate.y && y < this.coordinate.y + this.length && x == this.coordinate.x) {
                hits++;
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the string representation of the ship
     * @return the string representation of the ship
     * @Override
     */
    public String toString() {
        return shipType.toString();
    }

}

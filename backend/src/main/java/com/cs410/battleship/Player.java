package com.cs410.battleship;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Optional;

/**
 * Player:
 *  A player is a person who plays the game
 *  Responsible for:
 *  - Attacking another player
 *  - If attack is a hit, dealing damage to the ship
 *  - Checking if they have lost
 *  - Checking if their ocean grid can receive an attack
 *  - Receiving an attack on their ocean grid
 * Invariants:
 * - A player will only attack if the grid can receive an attack
 * - The result of an attack will be recorded in the target grid as a hit or miss
 * - If the attack is a hit, the ship will take damage
 * - Attack will return the ship that was sunk if the attack sunk a ship
 */
public class Player {
    @JsonProperty(value="oceanGrid")
    private Grid oceanGrid;

    @JsonProperty(value="targetGrid")
    private Grid targetGrid;
    @JsonProperty(value="ships")
    private Ship[] ships;

    @JsonProperty(value="playerName")
    public final String name;
    
    /**
     * Constructs a new player
     * @param name The name of the player
     * @param ships The ships that the player will place on their ocean grid
     */
    Player(String name, Ship[] ships) {
        this.name = name;
        this.ships = ships;
        targetGrid = new Grid();
        oceanGrid = new Grid();
        
        oceanGrid.addShips(this.ships);
    }

    /**
     * Checks if the player has lost
     * @return true if the player has lost, false otherwise
     */
    public boolean hasLost() {
        for (Ship ship : ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Attacks another player
     * @param opponent The player to attack
     * @param coordinate The coordinate to attack
     * @return The ship that was sunk if the attack sunk a ship, empty otherwise
     * @throws IllegalArgumentException if the coordinate is out of bounds
     */
    public Optional<Ship> attack(Player opponent, Coordinate coordinate) {
        Square square = opponent.receiveAttack(coordinate);
        targetGrid.receiveAttack(coordinate);
        if (square == Square.HIT) {
            return opponent.dealDamage(coordinate);
        }
        return Optional.empty();
    }

    /**
     * Checks if the player can receive an attack on a coordinate
     * @param coordinate The coordinate to check
     * @return true if the coordinate is in bounds and is either neutral or a ship
     */
    public boolean canReceiveAttack(Coordinate coordinate) {
        return oceanGrid.canReceiveAttack(coordinate);
    }

    /**
     * Receives an attack on a coordinate
     * @param coordinate The coordinate to attack
     * @return Square.HIT if the coordinate was a ship, Square.MISS if the coordinate was neutral
     */
    private Square receiveAttack(Coordinate coordinate) {
        return oceanGrid.receiveAttack(coordinate);
    }

    /**
     * Deals damage to a ship if the coordinate was a hit
     * @param coordinate The coordinate to check
     * @return The ship that was sunk if the attack sunk a ship, empty otherwise
     */
    private Optional<Ship> dealDamage(Coordinate coordinate) {
        for (Ship ship : ships) {
            if (ship.wasHit(coordinate)) {
                if (ship.isSunk()) {
                    return Optional.of(ship);
                }
            }
        }
        return Optional.empty();
    }

    /**
     * Prints the player's ocean grid and target grid
     */
    public void printBoard() {
        System.out.println(name + "'s board");
        System.out.println("Ocean Grid");
        oceanGrid.printGrid();
        System.out.println("Target Grid");
        targetGrid.printGrid();
    }

    public Grid getOceanGrid(){
        return oceanGrid;
    }

}

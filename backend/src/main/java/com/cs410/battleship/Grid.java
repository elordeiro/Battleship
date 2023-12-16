package com.cs410.battleship;
import com.fasterxml.jackson.annotation.JsonProperty;

enum Square {
    @JsonProperty("HIT")
    HIT,
    @JsonProperty("MISS")
    MISS,
    @JsonProperty("NEUTRAL")
    NEUTRAL,
    @JsonProperty("SHIP")
    SHIP
}
/**
 * Grid:
 *  A grid is a 10x10 board that contains squares
 *  A square can be either a ship, a hit, a miss, or neutral
 *  Responsible for:
 *  - Placing ships
 *  - Checking if a coordinate can be attacked
 *  - Receive an attack on a coordinate
 *  - Setting a square in the target grid to a hit or miss
 * Invariants:
 * - A grid can only contain ships, hits, misses, or neutral squares
 * - A grid can only be attacked if the coordinate is in bounds 
 * - A grid can only be attacked if the coordinate is either neutral or a ship
 * - A grid can only place a ship if the ship is in bounds and does not overlap with another ship
 * - A grid cannot set a square in the target grid to a ship
 */
class Grid {
    @JsonProperty("grid")
    protected Square[][] grid;

    /**
     * Constructs a new grid
     * Initializes all squares to neutral
     */
    public Grid() {
        grid = new Square[10][10];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                grid[i][j] = Square.NEUTRAL;
            }
        }
    }

    /**
     * Constructs a new grid from an array of ships
     * @param ships The ships to add
     */
    public Grid(Ship[] ships) {
        this();
        addShips(ships);
    }


    /**
     * Adds a ship to the grid
     * @param ship The ship to add
     * @throws IllegalArgumentException if the ship is out of bounds or overlaps with another ship
     */
    public void addShip(Ship ship) {
        Coordinate coordinate = ship.coordinate;
        int x = coordinate.x;
        int y = coordinate.y;
        
        for (int i = 0; i < ship.length; i++) {
            if (ship.alignment == Alignment.HORIZONTAL) {
                if (grid[x + i][y] == Square.SHIP) {
                    throw new IllegalArgumentException("Ship overlaps with another ship");
                }
                grid[x + i][y] = Square.SHIP;
            } else {
                if (grid[x][y + i] == Square.SHIP) {
                    throw new IllegalArgumentException("Ship overlaps with another ship");
                }
                grid[x][y + i] = Square.SHIP;
            }
        }
    }

    /**
     * Adds an array of ships to the grid
     * @param ships The ships to add
     * @throws IllegalArgumentException if any ship is out of bounds or overlaps with another ship
     */
    public void addShips(Ship[] ships) {
        for (Ship ship : ships) {
            addShip(ship);
        }
    }

    /**
     * Checks if a coordinate can be attacked
     * @param coordinate The coordinate to check
     * @return true if the coordinate is in bounds and is either neutral or a ship
     */
    public boolean canReceiveAttack(Coordinate coordinate) {
        if (coordinate.x < 0 || coordinate.x > 9 || coordinate.y < 0 || coordinate.y > 9) {
            return false;
        }
        int x = coordinate.x;
        int y = coordinate.y;
        return grid[x][y] == Square.NEUTRAL || grid[x][y] == Square.SHIP;
    }

    /**
     * Receives an attack on a coordinate
     * @param coordinate The coordinate to attack
     * @return Square.HIT if the coordinate was a ship, Square.MISS if the coordinate was neutral
     */
    public Square receiveAttack(Coordinate coordinate) {
        int x = coordinate.x;
        int y = coordinate.y;
        if (grid[x][y] == Square.SHIP) {
            grid[x][y] = Square.HIT;
            return Square.HIT;
        } else {
            grid[x][y] = Square.MISS;
            return Square.MISS;
        }
    }

    /**
     * Sets a square in the target grid to a hit or miss
     * @param square The square to set
     * @param coordinate The coordinate of the square
     * @throws IllegalArgumentException if the square is a ship
     */
    public void setSquare(Square square, Coordinate coordinate) {
        if (square == Square.SHIP) {
            throw new IllegalArgumentException("Cannot set square to ship");
        }
        grid[coordinate.x][coordinate.y] = square;
    }

    /**
     * Get a square from the grid
     * @param coordinate The coordinate of the square
     */
    public Square getSquare(Coordinate coordinate) {
        return grid[coordinate.x][coordinate.y];
    }

    /**
     * Prints the grid to the console
     */
    public void printGrid() {
        System.out.println("  0 1 2 3 4 5 6 7 8 9");
        for (int i = 0; i < 10; i++) {
            System.out.print(i + " ");
            for (int j = 0; j < 10; j++) {
                switch (grid[j][i]) {
                case HIT:
                    System.out.print("X ");
                    break;
                case MISS:
                    System.out.print("O ");
                    break;
                case NEUTRAL:
                    System.out.print("~ ");
                    break;
                case SHIP:
                    System.out.print("S ");
                    break;
                }
            }
            System.out.println();
        }
    }

    public String getSquareStatus(Coordinate coordinate) {
        Square sqr =  grid[coordinate.x][coordinate.y];
        if(sqr == Square.MISS){
            return "MISS";
        }
        else if(sqr == Square.HIT){
            return "HIT";
        }
        else{
            throw new IllegalStateException("called status is not a hit or miss.");
        }
    }
}

package com.cs410.battleship;
import java.util.Optional;

/**
 * GameState:
 *  A game state is the state of the game at a given time
 *  Responsible for:
 *  - Running a turn on a coordinate
 *  - Checking if the game is over
 *  - Validating a turn
 * Invariants:
 * - If a coordinate is invalid for a player, the player will be prompted to enter a new coordinate
 * - A turn will only be run if the coordinate is valid for the player
 * - If a ship is sunk as a result of an attack, the player will be notified
 */
public class GameState {
    Player playerOne;
    Player playerTwo;
    Player activePlayer;
    Player winner;
    boolean gameOver;
    int revisionId;


    String actionResult;
    int actionXCoord;
    int actionYCoord;
    String sinkingEvent;

    /**
     * Constructs a new game state
     * @param playerOne The first player
     * @param playerTwo The second player
     */
    public GameState(Player playerOne, Player playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.activePlayer = playerOne;
        this.gameOver = false;
        sinkingEvent = null;
        winner = null;
        revisionId = 0;
    }



    /**
     * Runs a turn on a coordinate
     * @param coordinate The coordinate to attack
     */
    public void runTurnOnCoordinate(Coordinate coordinate) {
        if (activePlayer == playerOne) {
            validateTurn(playerOne, playerTwo, coordinate);
            activePlayer = playerTwo;
        } else {
            validateTurn(playerTwo, playerOne, coordinate);
            activePlayer = playerOne;
        }
        checkGameOver();
        revisionId++;
        actionXCoord = coordinate.x;
        actionYCoord = coordinate.y;
    }

    /**
     * Checks if the game is over
     * @return true if the game is over, false otherwise
     */
    private void checkGameOver() {
        if (playerOne.hasLost()) {
            gameOver = true;
            winner = playerTwo;
        } else if (playerTwo.hasLost()) {
            gameOver = true;
            winner = playerOne;
        }
    }

    /**
     * Validates a turn
     * If the coordinate is invalid, the player will be prompted to enter a new coordinate
     * If the coordinate is valid, the turn will be run
     * If a ship is sunk as a result of the attack, the player will be notified
     * @param attacker The player attacking
     * @param defender The player defending
     * @param coordinate The coordinate to attack
     */
    private void validateTurn(Player attacker, Player defender, Coordinate coordinate) {
        // Scanner scanner = new Scanner(System.in);
        if (!defender.canReceiveAttack(coordinate)) {
            System.out.println("Invalid attack, try again");
            // int x = scanner.nextInt();
            // int y = scanner.nextInt();
            // coordinate = new Coordinate(x, y);
        }

        Optional<Ship> ship = attacker.attack(defender, coordinate);
        actionResult = getActionResult(defender, coordinate);
        if (ship.isPresent()) {
            System.out.println(defender.name + "'s " + ship.get().shipType + " was sunk!");
            sinkingEvent = String.valueOf(ship.get().shipType);
            sinkingEvent += " " + ship.get().alignment;
            Coordinate c = ship.get().coordinate;
            sinkingEvent += " " + c.x + " " + c.y;
            // System.out.println("Press enter to continue");
            // if (scanner.hasNextLine()) {
            //     scanner.nextLine();
            // }
            // scanner.nextLine();
        }
        else{
            sinkingEvent = null;
        }
    }

    private String getActionResult(Player defender, Coordinate coordinate) {
        return defender.getOceanGrid().getSquareStatus(coordinate);
    }

    /**
     * Gets the current revision id
     * @return The current revision id
     */
    public int getRevisionId() {
        return revisionId;
    }

    /**
     * Checks if the game is over
     * @return true if the game is over, false otherwise
     */
    public boolean isGameOver() {
        return gameOver;
    }


    public String getWinner() {
        if(winner != null){
            return winner.name;
        }
        else{
            return null;
        }
    }

    public String getActivePlayer() {return activePlayer.name; }

    public int getActionXCoord() {return actionXCoord; }

    public int getActionYCoord() {return actionYCoord; }

    public String getActionResult() {return actionResult; }

    public String getSinkingEvent(){return sinkingEvent; }
}
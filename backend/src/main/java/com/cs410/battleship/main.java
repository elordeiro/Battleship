package com.cs410.battleship;
import java.util.Scanner;

public class main {
    public static Scanner scanner;
    
    public static void main (String[] args) {
        Player playerOne = new Player("Player One", new Ship[] {
            new Ship(ShipType.CARRIER, new Coordinate(0, 0), Alignment.HORIZONTAL),
            new Ship(ShipType.BATTLESHIP, new Coordinate(0, 1), Alignment.HORIZONTAL),
            new Ship(ShipType.CRUISER, new Coordinate(0, 2), Alignment.HORIZONTAL),
            new Ship(ShipType.SUBMARINE, new Coordinate(0, 3), Alignment.HORIZONTAL),
            new Ship(ShipType.DESTROYER, new Coordinate(0, 4), Alignment.HORIZONTAL)
        });

        Player playerTwo = new Player("Player Two", new Ship[] {
            new Ship(ShipType.CARRIER, new Coordinate(0, 0), Alignment.HORIZONTAL),
            new Ship(ShipType.BATTLESHIP, new Coordinate(0, 1), Alignment.HORIZONTAL),
            new Ship(ShipType.CRUISER, new Coordinate(0, 2), Alignment.HORIZONTAL),
            new Ship(ShipType.SUBMARINE, new Coordinate(0, 3), Alignment.HORIZONTAL),
            new Ship(ShipType.DESTROYER, new Coordinate(0, 4), Alignment.HORIZONTAL)
        });

        GameState gameState = new GameState(playerOne, playerTwo);
        
        System.out.print("\033[H\033[2J");  // clear screen
        scanner = new Scanner(System.in);
        while (!gameState.isGameOver()) {
            System.out.println(gameState.activePlayer.name + "'s turn");
            gameState.activePlayer.printBoard();
            
            System.out.println("Enter x and y coordinates to attack");
            int x = scanner.nextInt();
            int y = scanner.nextInt();
            gameState.runTurnOnCoordinate(new Coordinate(x, y));
            System.out.print("\033[H\033[2J");  // clear screen
        }
        scanner.close();
        System.out.println(gameState.winner.name + " wins!");
    }
}

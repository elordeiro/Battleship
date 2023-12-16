# Battleship

### Team
- Nathan Brilmayer
- Nguyen Huynh 
- Estevao Lordeiro
- Michael Perez

### Overview
Battleship is played with two people. Each player has the following:  
- 1 Ocean grid
- 1 Targeting grid
- A fleet of 5 ships

### Grid Specs
- Grids are 10 x 10
- X axis is marked numerically
- Y axis is marked alphabetically

### Ship Specs
- Destroyer: (1 x 2)
- Submarine: (1 x 3)
- Cruiser:(1 x 3)
- Battleship: (1 x 4)
- Carrier: (1 x 5)

### Game Play

- The game is initialized with both players placing their fleet of ships consisting of one of each type onto the ocean grid. 
- Ships can only be placed horizontally and vertically, diagonal placement isn’t allowed.
- A player can only view their own board and not the opponents.  
- The game is turn based.  
- To complete a turn, each player will:  
  1. Select one coordinate on their targeting grid to fire upon. 
  2. The result of targeted squared will is a miss or a hit of a ship. 
  3. The targeted coordinate is compared to the opponent’s ocean grid.  
     If a ship is present at that coordinate the ship is hit.  
     If no ship is present then the shot is a miss.  
- The player’s target grid will mark the result of a shot. 
- A white marker represents a miss, and red marker represents a hit. 
- When a ship is hit, the ship owner’s ocean grid will be updated with a red marker of the result. 
- A player cannot target a coordinate that is already marked from a previous turn.
- If all coordinates of a ship is marked hit, the ship is sunk, and the opponent is notified of sinking and type of ship. 
- The game is won when a player sinks all of the opponents ships.

### Board Example

|   | A | B | C | D | E | F | G | H | I | J |   | + |   | A | B | C | D | E | F | G | H | I | J |   | 
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 |[D]|   |   | A | A | A | A | A |   |   |   | + |   | O | H | H | O | O | O | O | O | O | O |   |
| 2 | D |   |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 3 |   | S |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 4 |   | S |   |   |   |   |   |   |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 5 |   |[S]|   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 6 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | M | O | M | O | O |   |
| 7 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 8 |   |   |   |   |   |   |   | B |   |   |   | + |   | O | O | O | O | O | O | O | O | O | O |   |
| 9 |   |   | C | C | C |   |   |   |   |   |   | + |   | O | H | M | O | O | O | O | O | O | O |   |
|10 |   |   |   |   |   |   |   |   |   |   |   | + |   | O | O | M | O | O | O | O | O | O | O |   |
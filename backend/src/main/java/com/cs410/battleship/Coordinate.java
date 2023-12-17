package com.cs410.battleship;

public class Coordinate {
    int x;
    int y;
    public Coordinate(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public static Coordinate of(int x, int y) {
        return new Coordinate(x, y);
    }
}

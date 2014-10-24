'use strict';
/**
 * Tic-tac-toe model and logic (but not computer strategies)
 * @author njacobs5074
 * @since 1.0
 */
function TicTacToeBoard() {
    this.grid = makeEmptyGrid();
    this.callbacks = new SimpleEventUtil();
}

TicTacToeBoard.prototype.setTileXorO = function (row, col, player) {
    this.checkBounds(row, col);
    if (player !== "X" && player !== "O")
        throw new Error("Illegal player value: `" + player + "'");

    if (!this.grid[row][col].unset())
        throw new Error("Cannot overwrite " + this.grid[row][col].player + " at " + row + "," + col);

    this.grid[row][col] = new Tile(player, row, col);

    // Alert any listeners that we've updated a cell.
    this.callbacks.fire(this.grid[row][col]);
};

TicTacToeBoard.prototype.getTile = function (row, col) {
    this.checkBounds(row, col);

    return this.grid[row][col];
};

TicTacToeBoard.prototype.reset = function () {
    this.grid = makeEmptyGrid();
    this.callbacks.empty();
};

TicTacToeBoard.prototype.isThereAWinner = function () {

    var player = null, found = false;
    // Check horizontally
    for (var row = 0; row < 3; row++) {
        if (this.grid[row][0].unset())
            continue;

        player = this.grid[row][0].player;
        found = player === this.grid[row][1].player && player === this.grid[row][2].player;

        if (found) {
            return {
                found: found,
                player: player
            }
        }
    }

    // Check vertically
    for (var col = 0; col < 3; col++) {
        if (this.grid[0][col].unset())
            continue;

        player = this.grid[0][col].player;
        found = player === this.grid[1][col].player && player === this.grid[2][col].player;

        if (found) {
            return {
                found: found,
                player: player
            }
        }
    }

    // Check diagonally
    if (!this.grid[0][0].unset() && this.grid[0][0].player === this.grid[1][1].player && this.grid[0][0].player === this.grid[2][2].player) {
        return {
            found: true,
            player: this.grid[0][0].player
        }
    }
    else if (!this.grid[0][2].unset() && this.grid[0][2].player === this.grid[1][1].player && this.grid[0][2].player === this.grid[2][0].player) {
        return {
            found: true,
            player: this.grid[0][2].player
        }
    }

    return null;
};

TicTacToeBoard.prototype.isThereADraw = function () {
    var emptyCell = false;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (this.grid[i][j].unset()) {
                emptyCell = true;
                break;
            }
        }
    }
    return !emptyCell && !this.isThereAWinner();
};

TicTacToeBoard.prototype.toString = function () {
    var buf = "";
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            console.log(this.grid[i][j].player);
            buf += "[" + i + "," + j + "]=" + this.grid[i][j].unset() ? " " : this.grid[i][j].player;
        }
        buf += "\n";
    }
    return buf;
};

TicTacToeBoard.prototype.checkBounds = function (row, col) {
    if (row < 0 || row > this.grid.length)
        throw new Error("Array out of bounds exception on row=" + row);
    else if (col < 0 || col > this.grid[0].length)
        throw new Error("Array out of bounds exception on col=" + col);
};

TicTacToeBoard.prototype.addListener = function (callback, cbdata) {
    this.callbacks.add(callback, cbdata);
};

TicTacToeBoard.prototype.removeListener = function (callback) {
    this.callbacks.remove(callback);
};

TicTacToeBoard.prototype.copyBoard = function() {

    var gridCopy = makeEmptyGrid();

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            gridCopy[i][j] = this.grid[i][j].clone();
        }
    }

    var newBoard = new TicTacToeBoard();
    newBoard.grid = gridCopy;

    return newBoard;
};

TicTacToeBoard.prototype.toStringBoard = function() {
    var s = "\n";
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tile = this.grid[i][j];
            s += tile.player == "" ? " " : tile.player;
            s += "|";
        }
        s += "\n";
    }

    return s;
};

/* Utility function to create an empty board */
function makeEmptyGrid() {
    var grid = [];
    for (var i = 0; i < 3; i++) {
        grid[i] = [];
        for (var j = 0; j < 3; j++) {
            grid[i][j] = new Tile("", i, j);
        }
    }
    return grid;
}

/**
 * Data holder class to manage a single tile on the board.
 * It contains the row & column as well as "X" or "O", or
 * the empty string if unset.
 */
function Tile(player, row, col) {
    this.player = player;
    this.row = row;
    this.col = col;
}

Tile.prototype.unset = function () {
    return this.player == null || this.player === "";
};

Tile.prototype.clone = function() {
    return new Tile(this.player, this.row, this.col);
};

Tile.prototype.equals = function (that) {
    return that != null &&
           that.constructor === Tile &&
           this.row === that.row &&
           this.col === that.col &&
           this.player === that.player;
};

Tile.prototype.toString = function () {
    return "{ row = " + this.row + ", col = " + this.col + ", player = " + this.player + "}";
};


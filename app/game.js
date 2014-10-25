'use strict';

/**
 * Implements "game" component which is responsible for keeping track of the turn as well as whether the game has been
 * won or played to a draw.
 *
 * @author njacobs5074
 * @since 1.0
 */
function TicTacToeGame(board) {
    if (board == null || board == undefined)
        throw new Error("Req'd argument `board' is null");

    this.board = board;
    this.numOfPlayersSeenThisTurn = 0;
    this.turn = 1;
    this.gamestate = TicTacToeGame.UNKNOWN;
    this.winner = null;
    this.callbacks = new SimpleEventUtil();

    this.board.addListener(TicTacToeGame.listener, this);
}

TicTacToeGame.prototype.reset = function () {
    this.turn = 1;
    this.gamestate = TicTacToeGame.UNKNOWN;
    this.winner = null;
    this.callbacks.empty();

    this.board.addListener(TicTacToeGame.listener, this);
};

TicTacToeGame.UNKNOWN = -1;
TicTacToeGame.WE_HAVE_A_WINNER = 0;
TicTacToeGame.PLAYED_TO_A_DRAW = 1;

// Game listener - Note it is implemented as 'static' function because our
// simple event listener class doesn't know how to handle instance functions.
TicTacToeGame.listener = function (event, thisPtr) {

    thisPtr.numOfPlayersSeenThisTurn++;

    // Check if the game has been won or drawn.
    var winnerResult = thisPtr.board.isThereAWinner();
    if (winnerResult != null && winnerResult.found) {
        thisPtr.gamestate = TicTacToeGame.WE_HAVE_A_WINNER;
        thisPtr.winner = winnerResult.player;
        thisPtr.board.removeListener(thisPtr.listener);
    }
    else {
        var drawResult = thisPtr.board.isThereADraw();
        if (drawResult) {
            thisPtr.gamestate = TicTacToeGame.PLAYED_TO_A_DRAW;
            thisPtr.board.removeListener(thisPtr.listener);
        }
    }

    // Alert our listeners that the game has progressed.
    thisPtr.callbacks.fire(thisPtr);

    // Advance the game turn if both players have gone.
    if (thisPtr.numOfPlayersSeenThisTurn == 2) {
        thisPtr.turn++;
        thisPtr.numOfPlayersSeenThisTurn = 0;
    }
};

TicTacToeGame.prototype.addListener = function (callback, cbdata) {
    this.callbacks.add(callback, cbdata);
};

TicTacToeGame.prototype.removeListener = function (callback) {
    this.callbacks.remove(callback);
};

TicTacToeGame.prototype.toString = function () {
    return "{ turn = " + this.turn + ", gamestate = " + this.gamestate + ", winner = " + this.winner + "}";
};

/**
 * Class to represent a player - just their name and the letter they're playing: "X" or "O".
 * @constructor
 */
function Player(name, letter) {
    this.name = name;
    this.letter = letter;
}

Player.prototype.toString = function () {
    return "{name = " + this.name + ", letter = " + this.letter + "}";
};

// Utility function that randomly chooses whether a player will be "X" or "O"
Player.randomChooseLetter = function () {
    return Math.random() < 0.5 ? "X" : "O";
};
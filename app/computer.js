'use strict';

/**
 * Classes that implement computer played Tic-tac-toe.
 *
 * @author njacobs5074
 * @since 1.0
 * @see http://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
 */
function ComputerPlayer(board, game, me) {
    this.board = board;
    this.game = game;
    this.me = me;
    this.stopPlaying = false;

    this.initStrategies();
    this.addListeners();
}

ComputerPlayer.prototype.initStrategies = function () {
    var opponentLetter = this.me.letter == "X" ? "O" : "X";
    this.strategies = [];
    this.strategies[0] = new TurnOneStrategy(this.game, this.me.letter);
    this.strategies[1] = new WinStrategy(this.board, this.me.letter);
    this.strategies[2] = new BlockWinStrategy(this.board, opponentLetter, this.me.letter);
    this.strategies[3] = new ForkStrategy(this.board, this.me.letter);
    this.strategies[4] = new BlockForkStrategy(this.board, opponentLetter, this.me.letter);
    this.strategies[5] = new CenterStrategy(this.board, this.me.letter);
    this.strategies[6] = new OppositeCornerStrategy(this.board, opponentLetter, this.me.letter);
    this.strategies[7] = new CornerStrategy(this.board, this.me.letter);
    this.strategies[8] = new EmptySideStrategy(this.board, this.me.letter);
};

ComputerPlayer.prototype.addListeners = function() {
    this.game.addListener(ComputerPlayer.gameListener, this);
    this.board.addListener(ComputerPlayer.boardListener, this);
};

ComputerPlayer.boardListener = function (event, thisPtr) {
    // If we've been told to stop playing, make sure we don't process the board any further.
    // Also, since we get told about all events, we need to make sure we ignore our own plays.
    if (thisPtr.stopPlaying)
        return;
    else if (event.player == thisPtr.me.letter)
        return;

    console.log("Trying " + thisPtr.strategies.length + " strategies...");
    for (var i = 0; i < thisPtr.strategies.length; i++) {
        if (thisPtr.strategies[i].play())
            break;
    }
};

ComputerPlayer.gameListener = function (event, thisPtr) {
    if (event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER || event.gamestate == TicTacToeGame.PLAYED_TO_A_DRAW) {
        thisPtr.stopPlaying = true;
    }
};

// On turn 1, computer will always play a corner if it is "X".  Otherwise
// it does nothing here since it has to wait for the human to make their
// first play.
ComputerPlayer.prototype.start = function () {
    if (this.me.letter == "X") {
        this.board.setTileXorO(0, 0, "X");
    }
};

ComputerPlayer.prototype.reset = function (me) {
    this.me = me;
    this.stopPlaying = false;
    this.initStrategies();
    this.addListeners();
};

ComputerPlayer.findTwoInARow = function (board, letter) {
    var i;

    // Check horizontal 2 in a row
    for (i = 0; i < 3; i++) {
        if (board.getTile(i, 0).player == letter && board.getTile(i, 1).player == letter && board.getTile(i, 2).unset()) {
            return new TwoInARow(i, 0, TwoInARow.HORIZONTAL, i, 2);
        }
        else if (board.getTile(i, 1).player == letter && board.getTile(i, 2).player == letter && board.getTile(i, 0).unset()) {
            return new TwoInARow(i, 1, TwoInARow.HORIZONTAL, i, 0);
        }
        else if (board.getTile(i, 0).player == letter && board.getTile(i, 2).player == letter && board.getTile(i, 1).unset()) {
            return new TwoInARow(i, 0, TwoInARow.HORIZONTAL, i,1);
        }
    }

    // Didn't find one horizontally, check vertically
    for (i = 0; i < 3; i++) {
        if (board.getTile(0, i).player == letter && board.getTile(1, i).player == letter && board.getTile(2, i).unset()) {
            return new TwoInARow(0, i, TwoInARow.VERTICAL, 2, i);
        }
        else if (board.getTile(1, i).player == letter && board.getTile(2, i).player == letter && board.getTile(0, i).unset()) {
            return new TwoInARow(1, i, TwoInARow.VERTICAL, 0, i);
        }
        else if (board.getTile(0, i).player == letter && board.getTile(2, i).player == letter && board.getTile(1, i).unset()) {
            return new TwoInARow(0, i, TwoInARow.VERTICAL, 1, i);
        }
    }

    // Finally, we check for diagonal 2 in a row.
    if (board.getTile(0, 0).player == letter && board.getTile(1, 1).player == letter && board.getTile(2, 2).unset()) {
        return new TwoInARow(0, 0, TwoInARow.DIAGONAL, 2, 2);
    }
    else if (board.getTile(1, 1).player == letter && board.getTile(2, 2).player == letter && board.getTile(0, 0).unset()) {
        return new TwoInARow(0, 0, TwoInARow.DIAGONAL, 0, 0);
    }
    else if (board.getTile(2, 0).player == letter && board.getTile(1, 1).player == letter && board.getTile(0, 2).unset()) {
        return new TwoInARow(2, 0, TwoInARow.DIAGONAL, 0, 2);
    }
    else if (board.getTile(1, 1).player == letter && board.getTile(0, 2).player == letter && board.getTile(2, 0).unset()) {
        return new TwoInARow(2, 0, TwoInARow.DIAGONAL, 2, 0);
    }
    else if (board.getTile(0, 2).player == letter && board.getTile(2, 0).player == letter && board.getTile(1, 1).unset()) {
        return new TwoInARow(0, 2, TwoInARow.DIAGONAL, 1, 1);
    }
    else if (board.getTile(0, 0).player == letter && board.getTile(2, 2).player == letter && board.getTile(1, 1).unset()) {
        return new TwoInARow(0, 0, TwoInARow.DIAGONAL, 1, 1);
    }

    return null;
};

ComputerPlayer.findAllTwoInARow = function (board, letter) {
    var i, j = 0;
    var twoInARows = [];

    // Check horizontal 2 in a row
    for (i = 0; i < 3; i++) {
        if (board.getTile(i, 0).player == letter && board.getTile(i, 1).player == letter && board.getTile(i, 2).unset()) {
            twoInARows[j] = new TwoInARow(i, 0, TwoInARow.HORIZONTAL);
            j++;
        }
        else if (board.getTile(i, 1).player == letter && board.getTile(i, 2).player == letter && board.getTile(i, 0).unset()) {
            twoInARows[j] = new TwoInARow(i, 1, TwoInARow.HORIZONTAL);
            j++;
        }
    }

    if (j == 0) {
        // Didn't find one horizontally, check vertically
        for (i = 0; i < 3; i++) {
            if (board.getTile(0, i).player == letter && board.getTile(1, i).player == letter && board.getTile(2, i).unset()) {
                twoInARows[j] = new TwoInARow(0, i, TwoInARow.VERTICAL);
                j++;
            }
            else if (board.getTile(1, i).player == letter && board.getTile(2, i).player == letter && board.getTile(0, i).unset()) {
                twoInARows[j] = new TwoInARow(1, i, TwoInARow.VERTICAL);
                j++;
            }
            else if (board.getTile(2, 0).player == letter && board.getTile(1, 1).player == letter && board.getTile(0, 2).unset()) {
                twoInARows[j] = new TwoInARow(2, 0, TwoInARow.DIAGONAL);
                j++
            }
            else if (board.getTile(1, 1).player == letter && board.getTile(0, 2).player == letter && board.getTile(2, 0).unset()) {
                twoInARows[j] = new TwoInARow(1, 1, TwoInARow.DIAGONAL);
                j++
            }
        }
    }

    // Finally, we check for diagonal 2 in a row.
    if (board.getTile(0, 0).player == letter && board.getTile(1, 1).player == letter && board.getTile(2, 2).unset()) {
        twoInARows[j] = new TwoInARow(0, 0, TwoInARow.DIAGONAL, 2, 2);
    }
    else if (board.getTile(1, 1).player == letter && board.getTile(2, 2).player == letter && board.getTile(0, 0).unset()) {
        twoInARows[j] = new TwoInARow(0, 0, TwoInARow.DIAGONAL, 0, 0);
    }
    else if (board.getTile(2, 0).player == letter && board.getTile(1, 1).player == letter && board.getTile(0, 2).unset()) {
        twoInARows[j] = new TwoInARow(2, 0, TwoInARow.DIAGONAL, 0, 2);
    }
    else if (board.getTile(1, 1).player == letter && board.getTile(0, 2).player == letter && board.getTile(2, 0).unset()) {
        twoInARows[j] = new TwoInARow(2, 0, TwoInARow.DIAGONAL, 2, 0);
    }
    else if (board.getTile(0, 2).player == letter && board.getTile(2, 0).player == letter && board.getTile(1, 1).unset()) {
        twoInARows[j] = new TwoInARow(0, 2, TwoInARow.DIAGONAL, 1, 1);
    }
    else if (board.getTile(0, 0).player == letter && board.getTile(2, 2).player == letter && board.getTile(1, 1).unset()) {
        twoInARows[j] = new TwoInARow(0, 0, TwoInARow.DIAGONAL, 1, 1);
    }
    return twoInARows;
};

/**
 * Class to maintain the state for a 2-in-a-row
 * @param row
 * @param col
 * @param orientation
 * @param unsetRow (optional)
 * @param unsetCol (optional)
 * @constructor
 */
function TwoInARow(row, col, orientation, unsetRow, unsetCol) {
    this.row = row;
    this.col = col;
    this.orientation = orientation;
    this.unsetRow = unsetRow;
    this.unsetCol = unsetCol;
}

TwoInARow.HORIZONTAL = 0;
TwoInARow.VERTICAL = 1;
TwoInARow.DIAGONAL = 2;

/**
 * Board strategies.  We implement these in a "command" style pattern.  Each
 * one is given an opportunity to do its move.  If a strategy applies with
 * regard to the current state of the board, it makes its move and returns true.
 * Otherwise, it returns false so that another strategy can be tried.
 *
 * Note that we depend upon the strategies being invoked in a particular order.
 */

// Turn 1 strategy
function TurnOneStrategy(game, letter) {
    this.game = game;
    this.letter = letter;
}

TurnOneStrategy.prototype.play = function() {
    console.log("TurnOneStrategy: Turn = " + this.game.turn);

    if (this.game.turn == 1 && this.letter == 'O' && this.game.board.getTile(1, 1).unset()) {
        this.game.board.setTileXorO(1, 1, this.letter);
        return true;
    }
    return false;
};

// Win strategy looks for 2 in a row of our own letter and if it finds it,
// plays that move.
function WinStrategy(board, letter) {
    this.board = board;
    this.letter = letter;
}

WinStrategy.prototype.play = function () {
    console.log("WinStrategy: Looking for 2 in a row: " + this.letter);
    var result = ComputerPlayer.findTwoInARow(this.board, this.letter);
    if (result != null) {
        this.board.setTileXorO(result.unsetRow, result.unsetCol, this.letter);
        return true;
    }

    return false;
};

// Block strategy looks for 2 in a row of the opponent's letter and it find its,
// blocks the 3rd spot.
function BlockWinStrategy(board, opponentLetter, myLetter) {
    this.board = board;
    this.opponentLetter = opponentLetter;
    this.myLetter = myLetter;
}

BlockWinStrategy.prototype.play = function () {
    console.log("BlockWinStrategy: Looking for 2 in a row: " + this.opponentLetter);
    var result = ComputerPlayer.findTwoInARow(this.board, this.opponentLetter);
    if (result != null) {
        this.board.setTileXorO(result.unsetRow, result.unsetCol, this.myLetter);
        return true;
    }

    return false;
};

// Fork strategy looks at hypothetical placements of the computer's letter such that
// it creates 2x two in a row threats.  This is essentially a coup d'état as the
// opponent cannot block both.
function ForkStrategy(board, letter) {
    this.board = board;
    this.letter = letter;
}

ForkStrategy.prototype.play = function () {
    console.log("ForkStrategy: Looking for a fork: " + this.letter);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var copyOfBoard = this.board.copyBoard();

            if (copyOfBoard.getTile(i, j).unset()) {
                copyOfBoard.setTileXorO(i, j, this.letter);

                var twoInARows = ComputerPlayer.findAllTwoInARow(copyOfBoard, this.letter);
                if (twoInARows.length >= 2) {
                    this.board.setTileXorO(i, j, this.letter);
                    return true;
                }
            }
        }
    }
    return false;
};

// Block opponent's potential fork strategies
function BlockForkStrategy(board, opponentLetter, myLetter) {
    this.board = board;
    this.opponentLetter = opponentLetter;
    this.myLetter = myLetter;
}

BlockForkStrategy.prototype.play = function () {
    console.log("BlockForkStrategy: Looking for opponent fork: " + this.opponentLetter);

    var copyOfBoard = null, i, j, opponentForkStrategy;

    // Look for a place to put our letter such that it does not open up an opponent fork.
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            copyOfBoard = this.board.copyBoard();

            if (copyOfBoard.getTile(i, j).unset()) {
                copyOfBoard.setTileXorO(i, j, this.myLetter);

                // Look to see if this creates an opportunity for the opponent to fork.
                opponentForkStrategy = new ForkStrategy(copyOfBoard, this.opponentLetter);
                if (!opponentForkStrategy.play()) {
                    this.board.setTileXorO(i, j, this.myLetter);
                    return true;
                }
            }
        }
    }

    // Check to see if there is a configuration where opponent can fork without us having done
    // a move yet.

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            copyOfBoard = this.board.copyBoard();

            // We add a listener to the copied game board.  If the event is fired, it means
            // that the ForkStrategy object below was able to make a play.  Our listener
            // will capture the location where the play was made.
            var forkedTile = null;
            copyOfBoard.addListener(function (event) {
                forkedTile = event;
            });

            opponentForkStrategy = new ForkStrategy(copyOfBoard, this.opponentLetter);
            if (opponentForkStrategy.play()) {
                // Instead - we play our piece where the human would've played their piece.
                this.board.setTileXorO(forkedTile.row, forkedTile.col, this.myLetter);
                return true;
            }
        }
    }

    return false;
};

// Play the center if it's empty.
function CenterStrategy(board, letter) {
    this.board = board;
    this.letter = letter;
}

CenterStrategy.prototype.play = function () {
    console.log("CenterStrategy: Playing center if empty");
    if (this.board.getTile(1, 1).unset())
        this.board.setTileXorO(1, 1, this.letter);
};

// Play a corner if the opponent is in the corner and the opposite one is empty.
function OppositeCornerStrategy(board, opponentLetter, myLetter) {
    this.board = board;
    this.opponentLetter = opponentLetter;
    this.myLetter = myLetter;
}

OppositeCornerStrategy.prototype.play = function () {
    console.log("OppositeCornerStrategy: Playing opposite corner if opponent has one");

    var corners = null, i;
    if (this.board.getTile(0, 0).player == this.opponentLetter) {
        corners = [
            {row: 0, col: 2},
            {row: 2, col: 0},
            {row: 2, col: 2}
        ];
        for (i = 0; i < corners.length; i++) {
            if (this.checkIfUnsetAndSet(corners[i]))
                break;
        }
    }
    else if (this.board.getTile(0, 2).player == this.opponentLetter) {
        corners = [
            {row: 0, col: 0},
            {row: 2, col: 0},
            {row: 2, col: 2}
        ];
        for (i = 0; i < corners.length; i++) {
            if (this.checkIfUnsetAndSet(corners[i]))
                break;
        }
    }
    else if (this.board.getTile(2, 0).player == this.opponentLetter) {
        corners = [
            {row: 0, col: 0},
            {row: 0, col: 2},
            {row: 2, col: 2}
        ];
        for (i = 0; i < corners.length; i++) {
            if (this.checkIfUnsetAndSet(corners[i]))
                break;
        }
    }
    else if (this.board.getTile(2, 2).player == this.opponentLetter) {
        corners = [
            {row: 0, col: 0},
            {row: 0, col: 2},
            {row: 2, col: 0}
        ];
        for (i = 0; i < corners.length; i++) {
            if (this.checkIfUnsetAndSet(corners[i]))
                break;
        }
    }
    return false;
};

OppositeCornerStrategy.prototype.checkIfUnsetAndSet = function (corner) {

    if (!this.board.getTile(corner.row, corner.col).unset())
        return false;

    this.board.setTileXorO(corner.row, corner.col, this.myLetter);
    return true;
};

// Just play a corner.  Any corner will do.
function CornerStrategy(board, letter) {
    this.board = board;
    this.letter = letter;
}

CornerStrategy.prototype.play = function () {

    var corners = [
        {row: 0, col: 0},
        {row: 0, col: 2},
        {row: 2, col: 0},
        {row: 2, col: 2}
    ];
    for (var i = 0; i < corners.length; i++) {
        if (!this.board.getTile(corners[i].row, corners[i].col).unset()) {
            this.board.setTileXorO(corners[i].row, corners[i].col, this.letter);
            return true;
        }
    }

    return false;
};

// Just play a side.  Any empty side will do.
function EmptySideStrategy(board, letter) {
    this.board = board;
    this.letter = letter;
}

EmptySideStrategy.prototype.play = function () {

    var sides = [
        {row: 0, col: 1},
        {row: 1, col: 0},
        {row: 1, col: 2},
        {row: 2, col: 1}
    ];
    for (var i = 0; i < sides.length; i++) {
        if (!this.board.getTile(sides[i].row, sides[i].col).unset()) {
            this.board.setTileXorO(sides[i].row, sides[i].col, this.letter);
            return true;
        }
    }

    return false;
};
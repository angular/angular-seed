'use strict';

/**
 * Tests for TicTacToeGame class.
 *
 * @author njacobs5074
 * @since 1.0
 */
describe('TicTacToeGame', function () {
    var board = new TicTacToeBoard();
    var game = new TicTacToeGame(board);
    var gameWasWon, gameWasDraw, winningPlayer;

    beforeEach(function () {
        gameWasWon = false;
        gameWasDraw = false;
        winningPlayer = null;

        game.addListener(function (event) {
            if (event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER) {
                gameWasWon = true;
                gameWasDraw = false;
                winningPlayer = event.winner;
            }
            else if (event.gamestate == TicTacToeGame.PLAYED_TO_A_DRAW) {
                gameWasWon = false;
                gameWasDraw = true;
            }
        });
    });

    afterEach(function () {
        board.reset();
        game.reset();
    });

    it('should be that X wins the game', function () {
        board.setTileXorO(0, 0, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 1, "O");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(0, 2, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(0, 1, "O");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(2, 0, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 2, "O"); // whoops!
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 0, "X");
        expect(gameWasDraw).toEqual(false);
        expect(gameWasWon).toEqual(true);
        expect(winningPlayer).toEqual("X");
    });

    it('should be that we have a draw', function () {
        board.setTileXorO(0, 0, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(0, 1, "O");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(0, 2, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 0, "O");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 1, "X");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(1, 2, "O");
        expect(gameWasWon).toEqual(false);
        expect(gameWasDraw).toEqual(false);
        board.setTileXorO(2, 1, "X");
        expect(gameWasDraw).toEqual(false);
        expect(gameWasWon).toEqual(false);
        board.setTileXorO(2, 0, "O");
        expect(gameWasDraw).toEqual(false);
        expect(gameWasWon).toEqual(false);
        board.setTileXorO(2, 2, "O");
        expect(gameWasDraw).toEqual(true);
        expect(gameWasWon).toEqual(false);

    });
});
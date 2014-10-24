'use strict';

/**
 * Various tests for the TicTacToeBoard itself.
 * @author njacobs5074
 * @since 1.0
 */
describe('TicTacToeBoard Tests', function () {

    var game = new TicTacToeBoard();
    afterEach(function () {
        game.reset();
    });

    it('should have 3x3 grid', function () {
        expect(game.grid.length).toEqual(3);
        for (var i = 0; i < 3; i++) {
            expect(game.grid[i].length).toEqual(3);
        }
    });

    // Here we implicitly test the "afterEach" function invoked after each test.
    it('should have an empty grid', function () {
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                expect(game.getTile(i, j).unset()).toEqual(true);
    });


    it('should set \'X\' at 0,0', function () {
        expect(game.getTile(0, 0)).toNotBe(null);
        expect(game.getTile(0, 0).row).toEqual(0);
        expect(game.getTile(0, 0).col).toEqual(0);
        game.setTileXorO(0, 0, "X");
        expect(game.getTile(0, 0).player).toEqual("X");
    });

    it('should set \'O\' at 0,1', function () {
        expect(game.getTile(0, 1)).toNotBe(null);
        expect(game.getTile(0, 1).row).toEqual(0);
        expect(game.getTile(0, 1).col).toEqual(1);
        game.setTileXorO(0, 1, "O");
        expect(game.getTile(0, 1).player).toEqual("O");
    });

    it('should not be able to overwrite existing value', function () {
        try {
            game.setTileXorO(0, 0, "X");
            game.setTileXorO(0, 0, "O");
            expect(false).toEqual(true);
        }
        catch (err) {
            expect(true).toEqual(true);
        }
    });

    it('should not be possible to write nonsensical row/col', function() {
        try {
            game.setTileXorO(4, 4, "X");
            expect(false).toEqual(true);
        }
        catch (err) {
            expect(true).toEqual(true);
        }
    });

    it('unplayed game should not have a winner', function () {
        var results = game.isThereAWinner();
        expect(results).toBeNull();
    });

    it('played game with 3 in a row should have a winner', function () {
        game.setTileXorO(0, 0, "X");
        game.setTileXorO(0, 1, "X");
        game.setTileXorO(0, 2, "X");

        var results = game.isThereAWinner();
        expect(results).toNotEqual(null);
        expect(results.found).toEqual(true);
        expect(results.player).toEqual("X");
    });

    it('played game without 3 in a row should not have a winner', function () {
        game.setTileXorO(0, 0, "X");
        game.setTileXorO(0, 1, "X");
        game.setTileXorO(0, 2, "O");

        var results = game.isThereAWinner();
        expect(results).toEqual(null);
    });

    it('played game to draw should not have a winner', function() {
        // Simulate a game played to a draw.
        game.setTileXorO(0, 0, "X"); game.setTileXorO(0, 1, "O"); game.setTileXorO(0, 2, "X");
        game.setTileXorO(1, 0, "O"); game.setTileXorO(1, 1, "X"); game.setTileXorO(1, 2, "O");
        game.setTileXorO(2, 0, "O"); game.setTileXorO(2, 1, "X"); game.setTileXorO(2, 2, "O");

        expect(game.isThereAWinner()).toEqual(null);
        expect(game.isThereADraw()).toEqual(true);
    });
});

describe('TicTacToeBoard Callback Tests', function () {

    var board = new TicTacToeBoard();
    var player1Called, player2Called;

    var player1Listener = function(arg) {
        if (arg.player === "X")
            player1Called = true;
    };

    var player2Listener = function(arg) {
        if (arg.player === "O")
            player2Called = true;
    };

    beforeEach(function() {
        player1Called = false;
        player2Called = false;
    });

    afterEach(function () {
        board.reset();
    });

    it('should alert the other player when they make a move', function() {
        board.addListener(player1Listener);
        board.addListener(player2Listener);

        board.setTileXorO(0, 0, "X");
        board.setTileXorO(0, 1, "O");

        expect(player1Called).toBeTruthy();
        expect(player2Called).toBeTruthy();
    });

    it('should not alert the other player when they make a move', function() {

        board.setTileXorO(0, 0, "X");
        board.setTileXorO(0, 1, "O");

        expect(player1Called).toNotBe(true);
        expect(player2Called).toNotBe(true);
    });


});
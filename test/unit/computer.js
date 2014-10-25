'use strict';

/**
 * Unit tests for Computer & related classes.
 *
 * @author njacobs5074
 * @since 1.0
 */
describe('ComputerStrategy COMPUTER IS X', function () {
    var board = new TicTacToeBoard();
    var game = new TicTacToeGame(board);
    var computerPlayer = new Player("COMPUTER", "X");
    var computer = new ComputerPlayer(board, game, computerPlayer);
    var computerWon, playerWon, wasDraw;

    beforeEach(function () {
        game.addListener(function (event) {
            computerWon = false;
            playerWon = false;
            wasDraw = false;

            if (event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER) {
                computerWon = event.winner == "X";
                playerWon = event.winner == "O";
            }
            else if (event.gamestate == TicTacToeGame.PLAYED_TO_A_DRAW) {
                wasDraw = true;
            }
        });

        game.addListener(function (event) {
            console.log(event.toString());
            console.log(event.board.toStringBoard());
        })
    });

    afterEach(function () {
        board.reset();
        game.reset();
        computer.reset(computerPlayer);
    });

    it('should be that X wins (1)', function () {
        computer.start();
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(1, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 0, "O");
        expect(computerWon).toBeTruthy();
        expect(playerWon).toBeFalsy();
    });

    it('should be that X wins (2)', function () {
        computer.start();
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(0, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(1, 2, "O");
        expect(computerWon).toBeTruthy();
        expect(playerWon).toBeFalsy();
    });

    it('should be that we play to a draw (1)', function () {
        computer.start();
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(1, 1, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(0, 1, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(1, 0, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();
        expect(wasDraw).toBeTruthy();
    });

    it('should be that we play to a draw (2)', function () {
        computer.start();
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(0, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(1, 0, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 1, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();
    });
});

describe('ComputerStrategy COMPUTER IS O', function () {
    var board = new TicTacToeBoard();
    var game = new TicTacToeGame(board);
    var computerPlayer = new Player("COMPUTER", "O");
    var computer = new ComputerPlayer(board, game, computerPlayer);
    var computerWon, playerWon, wasDraw;

    beforeEach(function () {
        game.addListener(function (event) {
            computerWon = false;
            playerWon = false;
            wasDraw = false;

            if (event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER) {
                computerWon = event.winner == "O";
                playerWon = event.winner == "X";
            }
            else if (event.gamestate == TicTacToeGame.PLAYED_TO_A_DRAW) {
                wasDraw = true;
            }
        });

        game.addListener(function (event) {
            console.log(event.toString());
            console.log(event.board.toStringBoard());
        })
    });

    afterEach(function () {
        board.reset();
        game.reset();
        computer.reset(computerPlayer);
    });


    it('should be that O wins (1)', function () {
        computer.start();
        expect(computerWon).toBeUndefined();
        expect(playerWon).toBeUndefined();

        board.setTileXorO(0, 0, "X");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(0, 2, "X");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 0, "X");
        expect(computerWon).toBeTruthy();
        expect(playerWon).toBeFalsy();
    });
});

describe('ComputerStrategy COMPUTER IS X - Tests for tic-tac-toe-0001', function () {
    var board = new TicTacToeBoard();
    var game = new TicTacToeGame(board);
    var computerPlayer = new Player("COMPUTER", "X");
    var computer = new ComputerPlayer(board, game, computerPlayer);
    var computerWon, playerWon, wasDraw;

    beforeEach(function () {
        game.addListener(function (event) {
            computerWon = false;
            playerWon = false;
            wasDraw = false;

            if (event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER) {
                computerWon = event.winner == "X";
                playerWon = event.winner == "O";
            }
            else if (event.gamestate == TicTacToeGame.PLAYED_TO_A_DRAW) {
                wasDraw = true;
            }
        });

        game.addListener(function (event) {
            console.log(event.toString());
            console.log(event.board.toStringBoard());
        })
    });

    afterEach(function () {
        board.reset();
        game.reset();
        computer.reset(computerPlayer);
    });

    it('should be that we play to a draw', function() {
        computer.start();

        board.setTileXorO(1, 2, "O");
        expect(board.getTile(1, 1).player).toEqual("X");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 2, "O");
        expect(computerWon).toBeFalsy();
        expect(playerWon).toBeFalsy();

        board.setTileXorO(2, 0, "O");
        expect(computerWon).toBeTruthy();
        expect(playerWon).toBeFalsy();

    });
});

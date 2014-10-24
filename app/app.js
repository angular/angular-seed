'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
'use strict';

/**
 * Declare app level module which depends on views, and components
 * @author njacobs5074
 * @since 1.0
 */

// Create the components necessary for implementing & playing the game.
var ticTacToeGameApp = angular.module('ticTacToeApp', [])
    .factory('computerLetter', function () {
        return Player.randomChooseLetter();
    })
    .factory('board', function () {
        return new TicTacToeBoard();
    })
    .factory('game', ['board', function (board) {
        return new TicTacToeGame(board);
    }])
    .factory('computer', ['board', 'game', 'computerLetter', function (board, game, computerLetter) {
        return new ComputerPlayer(board, game, new Player('COMPUTER', computerLetter));
    }]);

// Connect the game components to the AngularJS.
ticTacToeGameApp.controller('TicTacToeCtrl', ['$scope', 'board', 'game', 'computer', function ($scope, board, game, computer) {
    $scope.board = board;
    $scope.game = game;
    $scope.computer = computer;
    $scope.gameMessage = "Turn #" + $scope.game.turn;

    $scope.playerTileName = computer.me.letter == "X" ? "O" : "X";
    $scope.computerTileName = computer.me.letter;
    $scope.reset = function () {
        $scope.board.reset();
        $scope.game.reset();

        var computerPlayer = new Player('COMPUTER', Player.randomChooseLetter());
        $scope.computer.reset(computerPlayer);
        $scope.computerTileName = computer.me.letter;
        $scope.playerTileName = computer.me.letter == "X" ? "O" : "X";
        $scope.gameMessage = "Turn #" + $scope.game.turn;
        $scope.game.addListener(gameMessageListener, $scope);

        if ($scope.computerTileName == "X")
            $scope.computer.start();
    };

    if ($scope.computerTileName == "X")
        $scope.computer.start();

    $scope.onTileClick = function (row, col, letter) {
        if ($scope.game.gamestate != TicTacToeGame.UNKNOWN)
            return;

        $scope.board.setTileXorO(row, col, letter);
    };

    $scope.game.addListener(gameMessageListener, $scope);
}]);

function gameMessageListener(event, scope) {
    var gameState = event.gamestate == TicTacToeGame.UNKNOWN ? "" :
            event.gamestate == TicTacToeGame.WE_HAVE_A_WINNER ? " - " + event.winner + " won!" :
        " - Played to a draw!";
    scope.gameMessage = "Turn #" + event.turn + " " + gameState;
}
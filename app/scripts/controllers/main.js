'use strict';

angular.module('mffighterApp.controllers', [
        'mffighterApp.game'
    ])
    .controller('MainCtrl', function($scope, $log, GameService) {
        var messages = [],
            game = GameService;

        // today's date for the footer
        $scope.today = new Date();
        // array of messages to be shown in the combat log
        $scope.messages = messages;
        // the game service
        $scope.game = game;

        $scope.$on('gameMessageEvent', function(event, args) {
            // put any game-related messages at the beginning of the message array
            messages.unshift(args);
        });

        $scope.newGame = function() {
            // reset warriors
            game.newGame();
        }

        $scope.startGame = function() {
            // clear the combat log
            messages.length = 0;
            game.startGame();
        }

        $scope.newGame();
    })
    /**
     * ng-repeat expects a collection, so this filter allows for
     * trophy icons to be repeated by a player score
     * @return {Array} A range of values
     */
    .filter('range', function() {
        return function(val, range) {
            range = parseInt(range);
            for (var i = 0; i < range; i++) {
                val.push(i);
            }
            return val;
        };
    });

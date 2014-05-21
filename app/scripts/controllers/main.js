'use strict';

angular.module('mffighterApp.controllers', [
        'mffighterApp.game'
    ])
    .controller('MainCtrl', function($scope, $log, GameService) {
        var messages = [],
            game = GameService;

        $scope.today = new Date();
        $scope.messages = messages;
        $scope.game = game;

        $scope.$on('gameMessageEvent', function(event, args) {
            messages.push(args.message);
        });

        $scope.$watch('game.players', function(value) {
            $log.log(value);
        }, true);

        $scope.game.newGame();
    });

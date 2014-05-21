'use strict';

angular.module('mffighterApp.game', [
        'mffighterApp.player',
        'mffighterApp.warrior'
    ])
    .service('GameService', function($rootScope, $log, PlayerFactory, WarriorFactory) {

        this.players = [],
        this.warriors = [],
        this.inProgress = false;

        this.newGame = function() {

            this.players.push(PlayerFactory.createPlayer({name: 'Player 1'}));
            this.players.push(PlayerFactory.createPlayer({name: 'Player 2'}));

            for (var i = 0; i < this.players.length; i++) {
                this.warriors[i] = [
                    WarriorFactory.createNinja(),
                    WarriorFactory.createSamurai(),
                    WarriorFactory.createBrawler()
                ];
            }
        }

        this.playersReady = function() {
            for (var i = 0; i < this.players.length; i++) {
                if (!this.players[i].warrior) {
                    return false;
                }
            }

            return true;
        }

        this.startGame = function () {
            this.inProgress = true;
            $log.log("Player 1 has chosen " + this.players[0].warrior.name);
            $log.log("Player 2 has chosen " + this.players[1].warrior.name);
        }
    });

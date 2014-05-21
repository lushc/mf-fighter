'use strict';

angular.module('mffighterApp.game', [
        'mffighterApp.player',
        'mffighterApp.warrior'
    ])
    .service('GameService', function(PlayerFactory, WarriorFactory) {

        this.players = [],
        this.warriors = [];

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
    });

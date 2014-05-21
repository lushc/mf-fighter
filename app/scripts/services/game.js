'use strict';

angular.module('mffighterApp.game', [
        'mffighterApp.warrior'
    ])
    .service('GameService', function(WarriorFactory) {

        this.players = [],
        this.warriors = [];

        this.newGame = function() {

            this.players.push({
                name: "Player 1",
                warrior: null,
                score: 0
            });

            this.players.push({
                name: "Player 2",
                warrior: null,
                score: 0
            });

            for (var i = 0; i < this.players.length; i++) {
                this.warriors[i] = [
                    WarriorFactory.createNinja(),
                    WarriorFactory.createSamurai(),
                    WarriorFactory.createBrawler()
                ];
            }
        }
    });

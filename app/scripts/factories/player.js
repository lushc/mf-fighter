'use strict';

angular.module('mffighterApp.player', [])
    .factory('PlayerFactory', function() {

        var Player = (function() {

            function Player(props) {

                var name     = props.name    || "Player",
                    warrior  = props.warrior || null,
                    score    = props.score   || 0;

                this.name    = name;
                this.warrior = warrior;
                this.score   = score;
            }

            Player.prototype.constructor = Player;

            return Player;
        })();

        return {
            createPlayer: function(props) { return new Player(props) }
        }
    });

'use strict';

angular.module('mffighterApp.player', [])
    .factory('PlayerFactory', function() {

        /**
         * Player class that keeps track of a player's name,
         * currently selected warrior and number of wins
         * @return {Object} An instance of Player
         */
        var Player = (function() {

            function Player(props) {

                // assign default values
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

'use strict';

angular.module('mffighterApp.game', [
        'mffighterApp.player',
        'mffighterApp.warrior'
    ])
    .service('GameService', function($rootScope, $timeout, $log, PlayerFactory, WarriorFactory) {

        // init players 1 & 2
        this.players = [
            PlayerFactory.createPlayer({name: 'Player 1'}),
            PlayerFactory.createPlayer({name: 'Player 2'})
        ],
        this.warriors = [],
        this.maxTurns = 30,
        this.tickTime = 2000;

        var self = this;

        /**
         * Broadcasts game-related messages
         * @param  {String} type    The type of message (e.g. info, success, warning)
         * @param  {String} label   A label for the event (e.g. turn 1)
         * @param  {String} message Message detailing the event that happened
         * @return {undefined}
         */
        this.broadcastMessage = function(type, label, message) {
            $rootScope.$broadcast('gameMessageEvent', {
                type: type,
                label: label,
                message: message
            });
        }

        // rebroadcast any messages from a warrior with turn information attached
        $rootScope.$on('warriorMessageEvent', function(event, args) {
            self.broadcastMessage('info', 'Turn ' + self.turnCount, args.message);
        });

        /**
         * Initalises a new game, resetting the players' choice of warrior and
         * giving them new warriors to choose from
         * @return {undefined}
         */
        this.newGame = function() {
            this.inProgress = false;
            this.gameOver = false;

            for (var i = 0; i < this.players.length; i++) {
                this.players[i].warrior = null;
                // each player has their own pool to prevent duplicate matchups
                this.warriors[i] = [
                    WarriorFactory.createNinja(),
                    WarriorFactory.createSamurai(),
                    WarriorFactory.createBrawler()
                ];
            }
        }

        /**
         * Starts the game with the current players and their chosen warriors
         * @return {undefined}
         */
        this.startGame = function() {
            // flag that the game has started
            this.inProgress = true;
            // reset the turn count
            this.turnCount = 1;

            var attackers = self.getAttackOrder(),
                attackOrderMessage = 'The initial attack order will be: ';

            // create a string of the order warriors will attack in
            for (var i = 0; i < attackers.length; i++) {
                var attacker = attackers[i];
                attackOrderMessage += attacker.name + ' (' + attacker.warrior.name + ', ' + attacker.warrior.speed + ' spd & ' + attacker.warrior.defence + ' def), ';
            }

            this.broadcastMessage('warning', 'Begin', attackOrderMessage.trim().slice(0, -1));

            // start ticking through the game loop at a fixed time step
            $timeout(this.tick, this.tickTime);
        }

        /**
         * One iteration of the game loop. Goes through the current attack order, attacking each
         * player's warrior in turn. If the victim dies or the turn limit is reached then the
         * game loop ends
         * @return {[type]} [description]
         */
        this.tick = function() {
            // the attack order for this turn
            var attackers = self.getAttackOrder();

            attackLoop:
            for (var i = 0; i < attackers.length; i++) {
                // who will attack
                var attacker = attackers[i];

                for (var j = 0; j < self.players.length; j++) {
                    // who will be attacked
                    var victim = self.players[j];

                    // stop hitting yourself
                    if (attacker !== victim) {
                        // broadcast who will attack who
                        var attackMessage = attacker.name + "'s " + attacker.warrior.name + " begins to attack " + victim.name + "'s " + victim.warrior.name;
                        self.broadcastMessage('info', 'Turn ' + self.turnCount, attackMessage);

                        // attack with each player's warrior
                        victim.warrior.getAttackedBy(attacker.warrior);

                        // check if the attacker killed the victim
                        self.gameOver = victim.warrior.isDead();

                        if (self.gameOver) {
                            // gg
                            self.broadcastMessage('success', 'Victory', attacker.name + ' has defeated ' + victim.name);
                            attacker.score++;
                            break attackLoop;
                        }
                    }
                }
            }

            self.turnCount++;

            if (self.turnCount <= self.maxTurns && !self.gameOver) {
                // start the next turn
                $timeout(self.tick, self.tickTime);
            }
        }

        /**
         * Sorts the players into an attack order, determined by who has the
         * highest speed, or in the case of equal speeds, who has the lowest
         * defence
         * @return {Array} An array of players
         */
        this.getAttackOrder = function() {
            return this.players.slice(0).sort(function(playerA, playerB) {
                if (playerA.warrior.speed === playerB.warrior.speed) {
                    // sort defence ascending
                    return (playerA.warrior.defence - playerB.warrior.defence);
                }

                // sort speed descending
                return (playerB.warrior.speed - playerA.warrior.speed);
            });
        }

        /**
         * Checks if all players have chosen a warrior to fight with
         * @return {Boolean} True if all players have been assigned a warrior, false otherwise
         */
        this.playersReady = function() {
            for (var i = 0; i < this.players.length; i++) {
                if (!this.players[i].warrior) {
                    return false;
                }
            }

            return true;
        }
    });

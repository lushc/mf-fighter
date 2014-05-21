'use strict';

angular.module('mffighterApp.math', [])
    .service('NumberService', function() {
        /**
         * Returns a random number between min and max
         * @param  {Number} min The minimum range value
         * @param  {Number} max The maximum range value
         * @return {Float}      A random float
         */
        this.getRandomArbitrary = function(min, max) {
            return Math.random() * (max - min) + min;
        };

        /**
         * Returns a random integer between min and max
         * @param  {Number} min The minimum range value
         * @param  {Number} max The maximum range value
         * @return {Int}        A random int
         */
        this.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
    });

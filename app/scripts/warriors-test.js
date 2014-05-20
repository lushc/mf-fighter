/**
 * Helper class for various utilities
 * @type {Object}
 */
var Utils = {
    getRandomArbitrary: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/**
 * Base warrior class. Has the following attributes:
 * name, health, attack, defense, speed, evade chance
 * @return {Object} An instance of Warrior
 */
var Warrior = (function () {

    /**
     * Constructor that assigns the warrior's attributes.
     * The values for each attribute are specified as a range,
     * on creation each warrior will be assigned a random value
     * within this range for the given attribute.
     * @param {Object} props Attributes for the warrior
     */
    function Warrior(props) {
        // assign default values
        var name     = props.name         || "Warrior",
        healthRange  = props.healthRange  || [0,100],
        attackRange  = props.attackRange  || [0,100],
        defenceRange = props.defenceRange || [0,100],
        speedRange   = props.speedRange   || [0,100],
        evadeRange   = props.evadeRange   || [0,1];

        this.name        = name;
        // calculate attributes randomly based on ranges
        this.maxHealth   = Utils.getRandomInt(healthRange[0], healthRange[1]);
        this.attack      = Utils.getRandomInt(attackRange[0], attackRange[1]);
        this.defence     = Utils.getRandomInt(defenceRange[0], defenceRange[1]);
        this.speed       = Utils.getRandomInt(speedRange[0], speedRange[1]);
        this.evadeChance = Utils.getRandomArbitrary(evadeRange[0], evadeRange[1]);
        // keep track of the warrior's current health
        this.health      = this.maxHealth;
    }

    Warrior.prototype.constructor = Warrior;

    /**
     * Returns the possible damage the warrior can do in a single attack
     * @return {Number} A damage value
     */
    Warrior.prototype.doAttack = function () {
        return this.attack;
    }

    /**
     * Calculates whether the warrior will successfully evade an attack
     * @return {Boolean} True if the warrior can evade, false otherwise
     */
    Warrior.prototype.doEvade = function () {
        return (Math.random() < this.evadeChance);
    }

    /**
     * Get attacked by another warrior. Checks certain conditions before applying
     * the calculated damage to self
     * @param  {Object} attacker  The Warrior that is attacking this instance
     * @return {Boolean}          True if the attack was successful, false otherwise
     */
    Warrior.prototype.getAttackedBy = function (attacker) {
        // check if the attack will be evaded
        if (this.doEvade()) {
            console.log(this.name + " avoided " + attacker.name + "'s attack!");
            return false;
        }

        // calculate the damage to be taken
        var damage = (attacker.doAttack() - this.defence);

        // make sure negative damage won't be applied
        if (damage <= 0) {
            console.log(attacker.name + "'s attack connected but didn't even scratch " + this.name + "!");
            return false;
        }

        // apply the damage
        this.health -= damage;
        console.log(attacker.name + " hit " + this.name + " for " + damage + " damage");

        // successful hit
        return true;
    }

    /**
     * @return {String} A character sheet for the warrior
     * @override
     */
    Warrior.prototype.toString = function () {
      return this.name + "'s character sheet: " +
      " Current Health: " + this.health +
      ", Max Health: " + this.maxHealth +
      ", Attack: " + this.attack +
      ", Defence: " + this.defence +
      ", Speed: " + this.speed +
      ", Evade Chance: " + this.evadeChance;
    }

    return Warrior;
})();

/**
 * Ninja class, extends Warrior with class-specific attributes
 * @return {Object} An instance of Ninja
 */
var Ninja = (function () {

    var my = {
        name:         "Ninja",
        healthRange:  [40,60],
        attackRange:  [60,70],
        defenceRange: [20,30],
        speedRange:   [90,100],
        evadeRange:   [0.30,0.50],
        special: {
            attackModifier: 2,
            chance: 0.05
        }
    };

    function Ninja() {
        Warrior.apply(this, [my]);
    }

    Ninja.prototype = Object.create(Warrior.prototype);
    Ninja.prototype.constructor = Ninja;

    /**
     * Each attack has a chance of triggering the Ninja's special attribute,
     * a 5% chance of doubling attack strength.
     * Calls the parent method to get the attack value after it has been modified
     * @override
     */
    Ninja.prototype.doAttack = function () {
        if (Math.random() < my.special.chance) {
            // calculate special
            this.attack *= my.special.attackModifier;
            console.log(this.name + " has increased their attack strength!");
        }

        return Warrior.prototype.doAttack.call(this);
    }

    return Ninja;
})();

/**
 * Samurai class, extends Warrior with class-specific attributes
 * @return {Object} An instance of Samauri
 */
var Samurai = (function () {

    var my = {
        name:         "Samurai",
        healthRange:  [60,100],
        attackRange:  [75,80],
        defenceRange: [35,40],
        speedRange:   [60,80],
        evadeRange:   [0.30,0.40],
        special: {
            regenAmount: 10,
            chance: 0.10
        }
    };

    function Samurai() {
        Warrior.apply(this, [my]);
    }

    Samurai.prototype = Object.create(Warrior.prototype);
    Samurai.prototype.constructor = Samurai;

    /**
     * The Samauri has a 10% chance of regaining 10 health on a successful evade,
     * but regain more health points than their maximum health value.
     * Calls the parent method to check whether the attack was evaded before calculating the special
     * @override
     */
    Samurai.prototype.doEvade = function () {
        var evaded = Warrior.prototype.doEvade.call(this);

        if (evaded && (Math.random() < my.special.chance)) {
            // calculate special
            var regainedHealth = (this.health + my.special.regenAmount);
            this.health = (regainedHealth < this.maxHealth ? regainedHealth : this.maxHealth);
            console.log(this.name + " regained health!");
        }

        return evaded;
    }

    return Samurai;
})();

/**
 * Brawler class, extends Warrior with class-specific attributes
 * @return {Object} An instance of Brawler
 */
var Brawler = (function () {

    var my = {
        name:         "Brawler",
        healthRange:  [90,100],
        attackRange:  [65,75],
        defenceRange: [40,50],
        speedRange:   [40,65],
        evadeRange:   [0.30,0.35],
        special: {
            bonusDefence: 10,
            threshold: 0.20,
            applied: false
        }
    };

    function Brawler() {
        Warrior.apply(this, [my]);
    }

    Brawler.prototype = Object.create(Warrior.prototype);
    Brawler.prototype.constructor = Brawler;

    /**
     * The Brawler increases their defence by 10 when their health falls below a threshold of
     * 20% of their maximum health points.
     * Calls the parent method to apply damage from the attacker before calculating the special
     * @override
     */
    Brawler.prototype.getAttackedBy = function (attacker) {
        var wasHit = Warrior.prototype.getAttackedBy.call(this, attacker);

        if (!my.special.applied && (this.health / this.maxHealth) < my.special.threshold) {
            // calculate special
            this.defence += my.special.bonusDefence;
            my.special.applied = true;
            console.log(this.name + " has increased their defence!");
        }

        return wasHit;
    }

    return Brawler;
})();

var n = new Ninja();
var s = new Samurai();
var b = new Brawler();

s.getAttackedBy(b);
s.getAttackedBy(n);
console.log(s.toString());

b.getAttackedBy(s);
b.getAttackedBy(n);
console.log(b.toString());

n.getAttackedBy(s);
n.getAttackedBy(b);
console.log(n.toString());
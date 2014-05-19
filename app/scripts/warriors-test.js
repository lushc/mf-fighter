var Utils = {
    getRandomArbitrary: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

var Warrior = (function () {

    function Warrior(props) {
        // assign default values
        var name     = props.name         || "Warrior",
        healthRange  = props.healthRange  || [0,100],
        attackRange  = props.attackRange  || [0,100],
        defenceRange = props.defenceRange || [0,100],
        speedRange   = props.speedRange   || [0,100],
        evadeRange   = props.evadeRange   || [0,1];

        this.name       = name;
        // calculate attributes randomly based on ranges
        this.maxHealth  = Utils.getRandomInt(healthRange[0], healthRange[1]);
        this.attack     = Utils.getRandomInt(attackRange[0], attackRange[1]);
        this.defence    = Utils.getRandomInt(defenceRange[0], attackRange[1]);
        this.speed      = Utils.getRandomInt(speedRange[0], speedRange[1]);
        this.evade      = Utils.getRandomArbitrary(evadeRange[0], evadeRange[1]);
        // keep track of the warrior's current health
        this.health     = this.maxHealth;
    }

    Warrior.prototype.constructor = Warrior;

    Warrior.prototype.doAttack = function () {
        return this.attack;
    }

    Warrior.prototype.doEvade = function () {
        return (Math.random() < this.evade);
    }

    Warrior.prototype.getAttackedBy = function (attacker) {

        var self = this.constructor.name,
            foe = attacker.constructor.name,
            damage = 0;

        // check if we will evade the attack
        if (this.doEvade()) {
            console.log(self + " avoided " + foe + "'s attack!");
            return false;
        }

        // calculate the damage to be taken
        damage = (attacker.doAttack() - this.defence);

        // make sure we're not receiving negative damage
        if (damage <= 0) {
            console.log(foe + "'s attack connected but didn't even scratch " + self + "!");
            return false;
        }

        // we were successfully attacked :(
        this.health -= damage;
        console.log(foe + " hit " + self + " for " + damage + " damage");

        return true;
    }

    Warrior.prototype.toString = function () {
      return this.name + "'s character sheet: " +
      " Max Health: " + this.maxHealth +
      " Current Health: " + this.health +
      ", Attack: " + this.attack +
      ", Defence: " + this.defence +
      ", Speed: " + this.speed +
      ", Evade: " + this.evade;
    }

    return Warrior;
})();

var Ninja = (function () {

    var my = {
        name:         "Ninja",
        healthRange:  [40,60],
        attackRange:  [60,70],
        defenceRange: [20,30],
        speedRange:   [90,100],
        evadeRange:   [0.3,0.5],
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

    Ninja.prototype.doAttack = function () {
        // 5% chance of doubling attack strength
        if (Math.random() < my.special.chance) {
            this.attack *= my.special.attackModifier;
            console.log("Ninja has doubled their attack strength!");
        }

        return Warrior.prototype.doAttack.call(this);
    }

    return Ninja;
})();

var Samurai = (function () {

    var my = {
        name:         "Samurai",
        healthRange:  [60,100],
        attackRange:  [75,80],
        defenceRange: [35,40],
        speedRange:   [60,80],
        evadeRange:   [0.3,0.4],
        special: {
            regenAmount: 10,
            chance: 0.50
        }
    };

    function Samurai() {
        Warrior.apply(this, [my]);
    }

    Samurai.prototype = Object.create(Warrior.prototype);
    Samurai.prototype.constructor = Samurai;

    Samurai.prototype.doEvade = function () {
        var success = Warrior.prototype.doEvade.call(this);

        // chance to regen health on a successful evade
        if (success && (Math.random() < my.special.chance)) {
            this.health += my.special.regenAmount;
            console.log("Samurai regained health!");
        }

        return success;
    }

    return Samurai;
})();

var Brawler = (function () {

    var my = {
        name:         "Brawler",
        healthRange:  [90,100],
        attackRange:  [65,75],
        defenceRange: [40,50],
        speedRange:   [40,65],
        evadeRange:   [0.3,0.35],
        special: {
            bonusDefence: 10,
            applied: false
        }
    };

    function Brawler() {
        Warrior.apply(this, [my]);
    }

    Brawler.prototype = Object.create(Warrior.prototype);
    Brawler.prototype.constructor = Brawler;

    Brawler.prototype.getAttackedBy = function (attacker) {
        // attack as usual
        var success = Warrior.prototype.getAttackedBy.call(this, attacker);

        // increase defence if health drops below a certain amount
        if (!my.special.applied && (this.health / this.maxHealth) < 0.2) {
            this.defence += my.special.bonusDefence;
            my.special.applied = true;
            console.log("Brawler has increased their defence!");
        }

        return success;
    }

    return Brawler;
})();

var n = new Ninja();
var s = new Samurai();
var b = new Brawler();

//console.log(n.toString());
//console.log(s.toString());
//console.log(b.toString());

//console.log(n.doAttack());
s.getAttackedBy(b);
console.log(b.toString());

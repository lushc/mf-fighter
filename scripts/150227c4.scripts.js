"use strict";angular.module("mffighterApp",["ngCookies","ngResource","ngSanitize","ngRoute","mffighterApp.controllers"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("mffighterApp.controllers",["mffighterApp.game"]).controller("MainCtrl",["$scope","$log","GameService",function(a,b,c){var d=[],e=c;a.today=new Date,a.messages=d,a.game=e,a.$on("gameMessageEvent",function(a,b){d.unshift(b)}),a.newGame=function(){e.newGame()},a.startGame=function(){d.length=0,e.startGame()},a.newGame()}]).filter("range",function(){return function(a,b){b=parseInt(b);for(var c=0;b>c;c++)a.push(c);return a}}),angular.module("mffighterApp.player",[]).factory("PlayerFactory",function(){var a=function(){function a(a){var b=a.name||"Player",c=a.warrior||null,d=a.score||0;this.name=b,this.warrior=c,this.score=d}return a.prototype.constructor=a,a}();return{createPlayer:function(b){return new a(b)}}}),angular.module("mffighterApp.warrior",["mffighterApp.math"]).factory("WarriorFactory",["$rootScope","NumberService",function(a,b){var c=function(){function c(a){var c=a.name||"Warrior",d=a.healthRange||[0,100],e=a.attackRange||[0,100],f=a.defenceRange||[0,100],g=a.speedRange||[0,100],h=a.evadeRange||[0,1];this.name=c,this.maxHealth=b.getRandomInt(d[0],d[1]),this.attack=b.getRandomInt(e[0],e[1]),this.defence=b.getRandomInt(f[0],f[1]),this.speed=b.getRandomInt(g[0],g[1]),this.evadeChance=b.getRandomArbitrary(h[0],h[1]).toFixed(2),this.health=this.maxHealth}return c.prototype.constructor=c,c.prototype.doAttack=function(){return this.attack},c.prototype.doEvade=function(){return Math.random()<this.evadeChance},c.prototype.healthAsRatio=function(){return this.health/this.maxHealth},c.prototype.isDead=function(){return this.health<=0},c.prototype.getAttackedBy=function(a){if(this.doEvade())return this.broadcastMessage(this.name+" avoided "+a.name+"'s attack!"),-1;var b=a.doAttack()-this.defence,c=this.health-b,d=0>c?Math.abs(c):!1;return 0>=b?(this.broadcastMessage(a.name+"'s attack connected but didn't even scratch "+this.name+"!"),0):(this.health=c>0?c:0,this.broadcastMessage(a.name+" hit "+this.name+" for "+b+" damage"+(d?" ("+d+" overkill)":"")),b)},c.prototype.broadcastMessage=function(b){a.$broadcast("warriorMessageEvent",{message:b})},c.prototype.toString=function(){return this.name+"'s character sheet:  Current Health: "+this.health+", Max Health: "+this.maxHealth+", Attack: "+this.attack+", Defence: "+this.defence+", Speed: "+this.speed+", Evade Chance: "+100*this.evadeChance+"%, Special: "+this.specialToString()},c.prototype.specialToString=function(){return"None"},c}(),d=function(){function a(){c.apply(this,[b])}var b={name:"Ninja",healthRange:[40,60],attackRange:[60,70],defenceRange:[20,30],speedRange:[90,100],evadeRange:[.3,.5],special:{attackModifier:2,chance:.05}};return a.prototype=Object.create(c.prototype),a.prototype.constructor=a,a.prototype.doAttack=function(){return Math.random()<b.special.chance&&(this.attack*=b.special.attackModifier,this.broadcastMessage(this.name+" has increased their attack strength!")),c.prototype.doAttack.call(this)},a.prototype.specialToString=function(){return b.special.attackModifier+"x attack modifier ("+100*b.special.chance+"% chance)"},a}(),e=function(){function a(){c.apply(this,[b])}var b={name:"Samurai",healthRange:[60,100],attackRange:[75,80],defenceRange:[35,40],speedRange:[60,80],evadeRange:[.3,.4],special:{regenAmount:10,chance:.1}};return a.prototype=Object.create(c.prototype),a.prototype.constructor=a,a.prototype.doEvade=function(){var a=c.prototype.doEvade.call(this);if(a&&Math.random()<b.special.chance){var d=this.health+b.special.regenAmount;this.health=d<this.maxHealth?d:this.maxHealth,this.broadcastMessage(this.name+" regained health!")}return a},a.prototype.specialToString=function(){return"+"+b.special.regenAmount+" health on evade ("+100*b.special.chance+"% chance)"},a}(),f=function(){function a(){c.apply(this,[b])}var b={name:"Brawler",healthRange:[90,100],attackRange:[65,75],defenceRange:[40,50],speedRange:[40,65],evadeRange:[.3,.35],special:{bonusDefence:10,threshold:.2,applied:!1}};return a.prototype=Object.create(c.prototype),a.prototype.constructor=a,a.prototype.getAttackedBy=function(a){var d=c.prototype.getAttackedBy.call(this,a);return!b.special.applied&&!this.isDead()&&this.healthAsRatio()<b.special.threshold&&(this.defence+=b.special.bonusDefence,b.special.applied=!0,this.broadcastMessage(this.name+" has increased their defence!")),d},a.prototype.specialToString=function(){return"+"+b.special.bonusDefence+" defence when health is below "+100*b.special.threshold+"%"+(b.special.applied?" (activated)":"")},a}();return{createNinja:function(){return new d},createSamurai:function(){return new e},createBrawler:function(){return new f}}}]),angular.module("mffighterApp.math",[]).service("NumberService",function(){this.getRandomArbitrary=function(a,b){return Math.random()*(b-a)+a},this.getRandomInt=function(a,b){return Math.floor(Math.random()*(b-a+1))+a}}),angular.module("mffighterApp.game",["mffighterApp.player","mffighterApp.warrior"]).service("GameService",["$rootScope","$timeout","$log","PlayerFactory","WarriorFactory",function(a,b,c,d,e){this.players=[d.createPlayer({name:"Player 1"}),d.createPlayer({name:"Player 2"})],this.warriors=[],this.maxTurns=30,this.tickTime=2e3;var f=this;this.broadcastMessage=function(b,c,d){a.$broadcast("gameMessageEvent",{type:b,label:c,message:d})},a.$on("warriorMessageEvent",function(a,b){f.broadcastMessage("info","Turn "+f.turnCount,b.message)}),this.newGame=function(){this.inProgress=!1,this.gameOver=!1;for(var a=0;a<this.players.length;a++)this.players[a].warrior=null,this.warriors[a]=[e.createNinja(),e.createSamurai(),e.createBrawler()]},this.startGame=function(){this.inProgress=!0,this.turnCount=1;for(var a=f.getAttackOrder(),c="The initial attack order will be: ",d=0;d<a.length;d++){var e=a[d];c+=e.name+" ("+e.warrior.name+", "+e.warrior.speed+" spd & "+e.warrior.defence+" def), "}this.broadcastMessage("warning","Begin",c.trim().slice(0,-1)),b(this.tick,this.tickTime)},this.tick=function(){var a=f.getAttackOrder();a:for(var c=0;c<a.length;c++)for(var d=a[c],e=0;e<f.players.length;e++){var g=f.players[e];if(d!==g){var h=d.name+"'s "+d.warrior.name+" begins to attack "+g.name+"'s "+g.warrior.name;if(f.broadcastMessage("info","Turn "+f.turnCount,h),g.warrior.getAttackedBy(d.warrior),f.gameOver=g.warrior.isDead(),f.gameOver){f.broadcastMessage("success","Victory",d.name+" has defeated "+g.name),d.score++;break a}}}f.turnCount++,f.turnCount<=f.maxTurns&&!f.gameOver&&b(f.tick,f.tickTime)},this.getAttackOrder=function(){return this.players.slice(0).sort(function(a,b){return a.warrior.speed===b.warrior.speed?a.warrior.defence-b.warrior.defence:b.warrior.speed-a.warrior.speed})},this.playersReady=function(){for(var a=0;a<this.players.length;a++)if(!this.players[a].warrior)return!1;return!0}}]);
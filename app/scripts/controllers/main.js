'use strict';

angular.module('mffighterApp')
  .controller('MainCtrl', function ($scope, Ninja, Samauri, Brawler) {
    var messages = [],
        n = new Ninja(),
        s = new Samauri(),
        b = new Brawler();

    $scope.today = new Date();
    $scope.messages = messages;

    $scope.$on('warriorMessageEvent', function (event, args) {
      messages.push(args.message);
    });

    n.getAttackedBy(s);
    n.getAttackedBy(b);
    messages.push(n.toString());

    s.getAttackedBy(b);
    s.getAttackedBy(n);
    messages.push(s.toString());

    b.getAttackedBy(s);
    b.getAttackedBy(n);
    messages.push(b.toString());
  });

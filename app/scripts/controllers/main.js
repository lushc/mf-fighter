'use strict';

angular.module('mffighterApp.controllers', [
        'mffighterApp.warrior'
    ])
    .controller('MainCtrl', function($scope, $log, WarriorFactory) {
        var messages = [],
            n = WarriorFactory.createNinja(),
            s = WarriorFactory.createSamurai(),
            b = WarriorFactory.createBrawler();

        $scope.today = new Date();
        $scope.messages = messages;

        $scope.$on('gameMessageEvent', function(event, args) {
            messages.push(args.message);
        });

        n.getAttackedBy(s);
        n.getAttackedBy(b);
        $log.log(n.toString());

        s.getAttackedBy(b);
        s.getAttackedBy(n);
        $log.log(s.toString());

        b.getAttackedBy(s);
        b.getAttackedBy(n);
        $log.log(b.toString());
    });

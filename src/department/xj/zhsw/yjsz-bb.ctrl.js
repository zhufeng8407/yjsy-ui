/**
 * Created by guhang on 2016/10/14.
 */
(function(){
    'use strict';
    var ecnuXjHome = angular.module('ecnuXjHome');

    ecnuXjHome.controller('a',['$scope',function($scope) {
        //var vm = this;
        $scope.treedata=createSubTree(3, 4, "");
        $scope.lastClicked = null;
        $scope.buttonClick = function($event, node) {
            $scope.lastClicked = node;
            $event.stopPropagation();
        }
        $scope.showSelected = function(sel) {
            $scope.selectedNode = sel;
        };
    }]);

    // function YjszCtrl($scope) {
    //     var vm = this;
    //     $scope.treedata=createSubTree(3, 4, "");
    //     $scope.lastClicked = null;
    //     $scope.buttonClick = function($event, node) {
    //         $scope.lastClicked = node;
    //         $event.stopPropagation();
    //     }
    //     $scope.showSelected = function(sel) {
    //         $scope.selectedNode = sel;
    //     };
    // }

});

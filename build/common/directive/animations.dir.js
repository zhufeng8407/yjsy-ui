/**
 * @author xiafan 17/2/14.
 */

(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive("loadingAnimation", [
        'PathUtils', loadingAnimation
    ]);
    function loadingAnimation(pathUtils) {
        return {
            restrict: 'E',
            scope: {
                'state':'='
            },
            templateUrl: pathUtils.qualifiedPath("/common/directive/animations.html"),
            controller: ['$scope', LoadingAnimationCtrl],
            controllerAs: "loadingAnimationCtrl"
        }
    }

    function LoadingAnimationCtrl($scope) {
        var vm = this;

        vm.state = $scope.state;
    }
})();
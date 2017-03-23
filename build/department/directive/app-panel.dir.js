/**
 * @author xiafan
 */
(function () {
    'use strict';
    var menuApp = angular.module('ecnuDpHome');

    menuApp.directive('appPanel', ['PathUtils', appPanel]
    );

    function appPanel(pathUtils) {
        return {
            scope: {
                'appItem': '<',
            },
            controller: ['$scope', 'PathUtils', appPanelController],
            controllerAs: 'appPanelCtrl',
            templateUrl: pathUtils.qualifiedPath("/department/directive/app-panel.view.html")
        }
    }

    function appPanelController($scope,PathUtils) {
        var vm = this;
        vm.isOpen = true;

    }

})();

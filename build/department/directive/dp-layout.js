/**
 * Created by xiafan on 16/8/3.
 */
(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuDpHome');
    ecnuUtils.directive("ecnuDpLayout", ['PathUtils', yjsyLayout]);
    function yjsyLayout(pathUtils) {
        return {
            restrict: 'E',
            scope: {
                "user": '<user'
            },
            controller: [
                '$scope',
                'PathUtils',
                'ecnuMenuDao',
                layoutController
            ],
            controllerAs: 'layoutCtrl',
            templateUrl: pathUtils.qualifiedPath("/department/directive/dp-layout.view.html"),
            link: function (scope, iElement, iAttrs) {
                scope.dirPath = pathUtils.qualifiedPath("/department/directive/");
            }
        }
    }

    function layoutController($scope, pathUtils, ecnuMenuDao) {
        var vm = this;

        vm.footerPath = pathUtils.qualifiedPath("/common/view/footer.html");
        vm.curSideMenuIdx = 0;
        vm.homePage = pathUtils.qualifiedPath("/department/index.html");
        vm.isMenuOpen = [false, false, false, false, false, false, false, false, false, false, false, false, false];
        vm.leftNavCollapsed = true;
        vm.processing = false;
        vm.message = "";

        vm.onPathChanged = onPathChanged;

        $scope.$on("processing", function (event, processing, processingMsg) {
            vm.processing = processing;
            vm.message = processingMsg;
        });

        ecnuMenuDao.getMenu(function (result) {
            vm.menu = result.menu;
            vm.urlHashTable = result.urlHashTable;
        });

        function onPathChanged(curPath) {
            vm.curPath = curPath;
            vm.isMenuOpen[vm.curPath[2].index] = true;
        }

        function open($index) {
            vm.isMenuOpen[$index] = !vm.isMenuOpen[$index];
        }
    }
})();
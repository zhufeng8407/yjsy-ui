/**
 * @author xiafan
 */
(function () {
    'use strict';
    var menuApp = angular.module('ecnuDpHome');

    menuApp.directive('dropDownMenu', ['PathUtils', dropDownMenu]);

    function dropDownMenu(pathUtils) {
        return {
            restrict: 'E',
            scope: {
                homePage: "=",
                onPathChanged: "&"
            },
            controller: [
                '$scope', '$location', 'PathUtils', 'ecnuMenuDao', 'PageState','ecnuPopularPage',
                menuController
            ],
            controllerAs: 'menuCtrl',
            templateUrl: pathUtils.qualifiedPath("/department/directive/dp-menu.view.html")
        };
    }

    function menuController($scope, $location, pathUtils, ecnuMenuDao, PageState,ecnuPopularPage) {
        var vm = this;

        vm.homePage = $scope.homePage;
        vm.logoUrl = pathUtils.qualifiedPath("/common/image/logo/logo1.png");
        vm.uName = PageState.getUser().getName();
        vm.navCollapsed = true;

        $scope.$on('$routeChangeSuccess', function (angularEvent, current, previous) {
            hitPage();
        });

        ecnuMenuDao.getMenu(function (result) {
            vm.menuObj = result;
            vm.urlHashTable = result.urlHashTable;
            setupMenu(pathUtils.removeParams($location.absUrl()));
        });

        function hitPage(){
            var curUrl = pathUtils.removeParams($location.absUrl());
            setupMenu(pathUtils.removeParams($location.absUrl()));
            ecnuPopularPage.hitPage(curUrl);
        }

        function setupMenu(path) {
            if (vm.urlHashTable == undefined || vm.urlHashTable[path] == undefined) {
                return;
            }

            var tmpPath = [];
            tmpPath.push(vm.urlHashTable[path]);
            while (tmpPath[tmpPath.length - 1].parent != null) {
                tmpPath.push(tmpPath[tmpPath.length - 1].parent);
            }

            vm.curPath = [];
            vm.curPath.push({'name': "首页", "url": vm.homePage});
            while (tmpPath.length > 0) {
                vm.curPath.push(tmpPath.pop());
            }
            if ($scope.onPathChanged) {
                $scope.onPathChanged()(vm.curPath);
            }
        }
    }

})();

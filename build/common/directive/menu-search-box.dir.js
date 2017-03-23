/**
 * Created by xiafan on 16/11/26.
 */
(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive("menuSearchBox", [
        'PathUtils', menuSearchBox
    ]);
    function menuSearchBox(pathUtils) {
        return {
            restrict: 'E',
            controller: [
                'ecnuPopularPage',
                'ecnuMenuDao',
                'PathUtils',
                MenuSearchBoxCtrl
            ],
            controllerAs: 'menuSearchBoxCtrl',
            templateUrl: pathUtils.qualifiedPath("/common/directive/menu-search-box.html")
        }
    }

    function MenuSearchBoxCtrl(ecnuPopularPage, ecnuMenuDao, PathUtils) {
        var vm = this;

        vm.searching = false;
        vm.focusing = false;
        vm.readingData = true;
        vm.menuObj = null;
        vm.freqMenu = null;

        vm.search = search;
        vm.onFocus = onFocus;

        if (vm.menuObj == null) {
            ecnuMenuDao.getMenu(function (result) {
                vm.menuObj = result;
            });
        }

        function displayMenuList() {
            if (vm.name != undefined && vm.name != "") {
                vm.focusing = false;
                vm.searching = true;
                vm.readingData = true;
                ecnuMenuDao.searchMenu(vm.name, function (response) {
                    vm.names = response.data;
                    for (var i = 0; i < vm.names.length; i++) {
                        vm.names[i].url = PathUtils.qualifiedPath(vm.names[i].url);
                    }
                    vm.readingData = false;
                });
            } else {
                vm.focusing = true;
                vm.searching = true;
                if ((vm.freqMenu == null || vm.freqMenu.length == 0) && vm.menuObj != null)
                    vm.freqMenu = ecnuPopularPage.getFreqMenus(vm.menuObj.urlHashTable).subMenu;
            }
        }

        function onFocus($event) {
            $event.stopPropagation();
            displayMenuList();
        }

        function search() {
            displayMenuList();
        }
    }
})();
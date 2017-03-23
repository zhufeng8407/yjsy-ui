/**
 * 导航栏的下拉菜单，主要的菜单项包括：
 * 1. 用户个人信息
 * 2. 用户角色切换
 * 3. 注销
 * @author xiafan
 */
(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive('navDropdownMenu', ['PathUtils', dropDownMenu]);
    function dropDownMenu(pathUtils) {
        return {
            restrict: 'E',
            scope: {},
            controller: ['PageState', menuController],
            controllerAs: 'menuCtrl',
            templateUrl: pathUtils.qualifiedPath("/common/directive/nav-dropdown-menu.view.html")
        };
    }

    function menuController(PageState) {
        var vm = this;

        vm.pages = PageState.getPageTypes();
        vm.uName = PageState.getUser().getName();

        vm.logout = logout;
        vm.choosePageType = choosePageType;

        function logout() {
            PageState.logout();
        }

        function choosePageType(type) {
            PageState.choosePageType(type);
        }

    }

})();
/**
 * @author xiafan
 */

(function () {
    'use strict';
    // 获取homeApp,这里不是定义一个新的module
    var homePage = angular.module('ecnuHomePage');

    homePage.controller('HomePageCtrl', HomePageCtrl);
    HomePageCtrl.$inject = ['$window', 'PageState', 'ecnuAccountDao', 'PathUtils'];
    function HomePageCtrl($window, PageState, ecnuAccountDao, pathUtils) {
        var vm = this;

        vm.choosePageType = choosePageType;

        //执行登录验证
        login();

        //以下为函数定义
        function login() {
            var ticket = QueryString('ticket');
            if (ticket == undefined) {
                alert("登录信息错误!");
                $window.location.href = pathUtils.LOGIN_PAGE;
            }

            ecnuAccountDao.loginWithTicket(ticket, initWithRoles);
        }

        function initWithRoles(res) {
            var user = PageState.getUser();

            vm.name = res.name;
            vm.roles = res.roles;

            user.setName(res.uName);
            user.setUserID(res.uID);
            user.setAccountId(res.accountId);
            user.setRoles(res.roles);
            vm.pages = PageState.getPageTypes();
        }

        function choosePageType(pageType) {
            PageState.choosePageType(pageType);
        }

        function QueryString(item) {
            var sValue = $window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            return sValue ? sValue[1] : sValue
        }

    }
})();
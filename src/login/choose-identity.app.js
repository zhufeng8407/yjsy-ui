/**
 * Created by guhang on 2017/3/14.
 */

(function () {
    'use strict';

    var LoginHome = angular.module('LoginHome');
    LoginHome.controller('ChooseIdentityCtrl',
        ['PageState', ChooseIdentityCtrl]);
    function ChooseIdentityCtrl(PageState) {
        var vm = this;

        vm.choosePageType = choosePageType;

        init();

        function init() {
            vm.pages = PageState.getPageTypes();
        }

        function choosePageType(pageType) {
            PageState.choosePageType(pageType);
        }
    }
})();

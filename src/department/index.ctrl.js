/**
 * @author xiafan
 */

(function () {
    'use strict';
    // 获取homeApp,这里不是定义一个新的module
    var homeApp = angular.module('ecnuDpHome');

    homeApp.controller('DpHomeCtrl', DpHomeCtrl);
    DpHomeCtrl.$inject = ['ecnuMenuDao', 'ecnuPopularPage'];
    function DpHomeCtrl(ecnuMenuDao, ecnuPopularPage) {
        var vm = this;

        ecnuMenuDao.getMenu(function (result) {
            vm.menuObj = result;
            vm.menuObj.menu.splice(0, 0, ecnuPopularPage.getFreqMenus(vm.menuObj.urlHashTable));
            vm.rowIndice = [];
            for (var i = 0; i < vm.menuObj.menu.length; i += 2) {
                vm.rowIndice.push(i);
            }
        });
    }
})();
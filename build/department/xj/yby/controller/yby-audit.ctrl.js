(function () {
    'use strict';
    var ecnuYby = angular.module('ecnuXueJi');
    ecnuYby.controller('YbyAuditCtrl', ['ecnuYbyDao', 'PageState', YbyAuditCtrl]);
    function YbyAuditCtrl(ecnuYbyDao, PageState) {
        var vm = this;
        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;

        vm.num = [10, 20, 30, 40, 50];

        vm.getAuditData = getAuditData;
        vm.isPassAudit = isPassAudit;


        getAuditData();
        function getAuditData(page, size) {
            ecnuYbyDao.getAuditData(page, size, function (response) {
                vm.auditdata = response;
            })
        }

        function isPassAudit(id, sno, flag) {
            ecnuYbyDao.isPassAudit(id, sno, PageState.user.getAccountId(), flag, function (response) {
                vm.auditdata = response;
            })
        }


    }
})();
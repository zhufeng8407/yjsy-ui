/**
 * Created by xiafan on 16-9-18.
 */
(function () {
    'use strict';
    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.service("ecnuAccountPrivilegeDao", ["EcnuConnection", accountPrivilegeDao]);
    function accountPrivilegeDao(conn) {
        var vm = this;
        var BASE_URL = "auth/account-privilege/";

        vm.save =save;

        function save(privilege, callback) {
            conn.post(BASE_URL + "save", {privilege:privilege}, callback);
        }
    }
})();
/**
 * Created by xiafan on 16-9-18.
 */
(function () {
    'use strict';
    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.service('ecnuAuditWorkflowDao', ['EcnuConnection', ecnuAuditWorkflowDao]);
    function ecnuAuditWorkflowDao(conn) {
        var vm = this;
        var BASE_URL = "yd/workflow/";

        vm.getAuditFlow = getAuditFlow;
        vm.save = save;

        function getAuditFlow(minor, callback) {
            conn.get(BASE_URL + "sequence", {'minor': minor}, callback);
        }

        function save(auditflow, callback) {
            conn.post(BASE_URL + "save", {'auditflow': auditflow}, callback);
        }
    }
})();
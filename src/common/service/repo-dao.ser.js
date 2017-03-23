/**
 * 新生转库的Dao
 * @author pyh
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuRepoDao", ["EcnuConnection", "QUERY_PARAMS", ecnuRepoDao]);
    function ecnuRepoDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "xj/repository";

        vm.updateStatus = updateStatus;
        vm.updateSingleStatus = updateSingleStatus;
        vm.searchStudents = searchStudents;

        function searchStudents(page, size, condition, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = condition;
            conn.get(BASE_URL + "/search-condition", param, callback);
        }

        function updateStatus(condition, callback) {
            var param = {};
            param[QUERY_PARAMS.CONDITION] = condition;
            conn.put(BASE_URL, param, callback);
        }

        function updateSingleStatus(sno, callback) {
            conn.put(BASE_URL + "/" + sno, {}, callback);
        }
    }

})();
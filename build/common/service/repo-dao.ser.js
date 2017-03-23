(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    //FIXME: @PYH 这个类的用途是什么，是否应该将一下的功能添加到<code>ecnuStudentDao</code>中去？
    utils.service("ecnuRepoDao", ["EcnuConnection", "QUERY_PARAMS", ecnuRepoDao]);
    function ecnuRepoDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "xj/repository";

        vm.updateStatus = updateStatus;
        vm.updateSingleStatus = updateSingleStatus;
        vm.searchStudents = searchStudents;

        function searchStudents(page,size,condition, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = condition;
            conn.get(BASE_URL+"/search-condition",param,callback);
        }
        function updateStatus(condition, callback) {
            var param = {};
            param[QUERY_PARAMS.CONDITION] = condition;
            conn.put(BASE_URL, param, callback);
        }

        function updateSingleStatus(sno, callback) {
            var param = {};
            conn.put(BASE_URL + "/" + sno,param, callback);
        }
    }

})();
/**
 * @author xiafan
 * @date 16-9-9.
 */
(function () {
    'use strict';
    var ecnuXueJi = angular.module('ecnuUtils');

    ecnuXueJi.service("ecnuRegistrationDao", ['EcnuConnection', 'QUERY_PARAMS', ecnuRegistrationDao]);

    /**
     * @author xiafan
     * @namespace ecnuStudentDao
     * @desc 用于访问学生信息的服务
     */
    function ecnuRegistrationDao(conn, QUERY_PARAMS) {
        var vm = this;
        var BASE_URL = "xj/registration/";

        vm.register = register;
        vm.reset = reset;
        vm.exportRegistrationList = exportRegistrationList;
        vm.batchRegister = batchRegister;
        vm.registrationStats = registrationStats;
        vm.searchStudents = searchStudents;
        vm.searchFee = searchFee;
        vm.upload = upload;

        function searchStudents(page, size, conds, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = conds;
            conn.get(BASE_URL + "students", param, callback);
        }

        function searchFee(page, size, conds, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = conds;
            conn.get(BASE_URL + "fee", param, callback);
        }

        function register(id, callback) {
            conn.post("xj/registration", {"studentIds": id}, callback);
        }

        function batchRegister(ids, callback) {
            conn.post("xj/registration", {"studentIds": ids}, callback);
        }

        function reset(callback) {
            conn.put(BASE_URL + "reset", {}, callback);
        }

        function exportRegistrationList(condition, callback) {
            conn.get(BASE_URL + 'export', {'condition': condition}, callback, {responseType: 'arraybuffer'});
        }

        function registrationStats(conds, callback) {
            conn.get(BASE_URL + 'stats', {'condition': conds}, callback);
        }

        function upload(file, type, success, progress) {
            var params = {};
            params[QUERY_PARAMS.FILE] = file;
            params[QUERY_PARAMS.TYPE] = type;
            conn.upload(BASE_URL + '/upload', params, success, progress);
        }
    }

})();
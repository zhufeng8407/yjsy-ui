(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuDiffDao", ["EcnuConnection", "QUERY_PARAMS", ecnuDiffDao]);
    function ecnuDiffDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "xj/difficulties";

        vm.getDiffByPage = getDiffByPage;
        vm.deleteDiff = deleteDiff;
        vm.updateDiff = updateDiff;
        vm.conditionalSearch = conditionalSearch;
        vm.getYears = getYears;
        vm.upload = upload;
        vm.exportError = exportError;

        function getYears(callback) {
            var params = {};
            conn.get(BASE_URL + "/diff-year", params, callback);
        }

        function conditionalSearch(condition, page, size, callback) {
            var params = {};
            params[QUERY_PARAMS.CONDITION] = condition;
            params[QUERY_PARAMS.PAGE] = page;
            params[QUERY_PARAMS.PAGE_SIZE] = size;
            conn.get(BASE_URL, params, callback);
        }

        function getDiffByPage(page, size, callback) {
            var params = {};
            params[QUERY_PARAMS.PAGE] = page;
            params[QUERY_PARAMS.PAGE_SIZE] = size;
            conn.get(BASE_URL, params, callback);
        }

        function deleteDiff(diffId, callback) {
            conn.delete(BASE_URL + "/" + diffId, {}, callback);
        }

        function updateDiff(diffId, diffYear, diffLevel, callback) {
            var params = {};
            params[QUERY_PARAMS.DIFF_ID] = diffId;
            params[QUERY_PARAMS.DIFF_YEAR] = diffYear;
            params[QUERY_PARAMS.DIFF_LEVEL] = diffLevel;
            conn.put(BASE_URL, params, callback);
        }

        function upload(file, success, progress) {
            conn.upload(BASE_URL, {"file":file}, success, progress);
        }

        function exportError(tag,callback) {
            conn.get(BASE_URL + '/error', {tag:tag}, callback, {responseType: 'arraybuffer'});
        }

    }

})();
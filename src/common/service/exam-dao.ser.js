/**
 * 考题的Dao
 * @date 16/9/9.
 * @author xiafan
 * @author guhang
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuExamDao", ["EcnuConnection", "QUERY_PARAMS", ecnuExamDao]);
    function ecnuExamDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "xj/exams";

        vm.getExamByPage = getExamByPage;
        vm.deleteExam = deleteExam;
        vm.deleteExams = deleteExams;
        vm.updateExam = updateExam;
        vm.addExam = addExam;
        vm.getPaper = getPaper;
        vm.submitAnswer = submitAnswer;
        vm.exportExam = exportExam;
        vm.exportExamError = exportExamError;
        vm.getStatsAccuracy = getStatsAccuracy;
        vm.uploadExam = uploadExam;

        function uploadExam(file, success, progress) {
            conn.upload(BASE_URL + '/upload', {"file": file}, success, progress);
        }

        function getExamByPage(page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            conn.get(BASE_URL, param, callback);
        }

        function deleteExam(id, page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            conn.delete(BASE_URL + "/" + id, param, callback);
        }

        function deleteExams(ids, page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.EXAM_IDS] = ids;
            conn.delete(BASE_URL, param, callback);
        }

        function updateExam(exam, callback) {
            conn.put(BASE_URL, {"exam": exam}, callback);
        }

        function addExam(exam, page, size, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param["exam"] = exam;
            conn.post(BASE_URL, param, callback);
        }

        function getPaper(callback) {
            var param = {};
            conn.get(BASE_URL + "/paper", param, callback);
        }

        function submitAnswer(answer, callback) {
            conn.post(BASE_URL + "/answer", {answer: answer}, callback);
        }

        function exportExam(title, exported, ids, callback) {
            conn.get(BASE_URL + "/export", {title: title, exported: exported, ids: ids}, callback,
                     {responseType: 'arraybuffer'});
        }

        function exportExamError(title, exported, ids, callback) {
            conn.get(BASE_URL + "/errors", {title: title, exported: exported, ids: ids}, callback,
                     {responseType: 'arraybuffer'});
        }

        function getStatsAccuracy(callback) {
            conn.get(BASE_URL + "/stats", {}, callback);
        }
    }

})();
/**
 * 处理上传文件时的进度以及错误到处等操作的Dao类
 * @author guhang
 * @date 2017/3/2.
 */
(function () {
    "use strict";
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuGlobalDao", ["EcnuConnection", "QUERY_PARAMS", GlobalDao]);
    function GlobalDao(conn) {
        var vm = this;

        vm.getProgress = getProgress;
        vm.exportErrors = exportErrors;
        vm.clearErrors = clearErrors;

        function getProgress(callback) {
            conn.get("progress", {}, callback);
        }

        function exportErrors(tag, callback) {
            var params = {};
            params['tag'] = tag;
            conn.get("export-error", params, callback, {responseType: 'arraybuffer'});
        }

        function clearErrors(tag, callback) {
            var params = {};
            params['tag'] = tag;
            conn.get("clear-error", params, callback);
        }
    }
})();
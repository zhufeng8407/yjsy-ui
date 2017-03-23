/**
 * Created by xiafan on 16-9-13.
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuStaffDao", ["EcnuConnection", ecnuStaffDao]);
    function ecnuStaffDao(conn) {
        var vm = this;
        var BASE_URL = "staff";
        vm.getStaff = getStaff;
        vm.exportError = exportError;

        function getStaff(supervisor, callback) {
            conn.get(BASE_URL, {'supervisor':supervisor}, callback);
        }

        function exportError(tag, callback) {
            conn.get("xj/dsImport/error", {'tag': tag}, callback, {responseType: 'arraybuffer'});
        }
    }
})();
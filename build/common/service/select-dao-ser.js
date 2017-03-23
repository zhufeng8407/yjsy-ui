/**
 * Created by xiafan on 16/9/9.
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuSelectDao", ["EcnuConnection", ecnuSelectDao]);
    function ecnuSelectDao(conn) {
        var vm = this;

        var BASE_URL = "select/";

        vm.search = search;

        function search(select,callback) {
            conn.get(BASE_URL + "search", {select:select}, callback);
        }
    }

})();
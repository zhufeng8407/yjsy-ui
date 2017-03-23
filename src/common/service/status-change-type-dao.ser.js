/**
 * Created by xiafan on 16-9-18.
 */
/**
 * This file defines DAO to access status change meta data.
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuStatusChangeTypeDao", ["EcnuConnection", statusChangeTypeDao]);
    function statusChangeTypeDao(conn) {
        var vm = this;
        var BASE_URL = "metadata/";

        vm.type = type;
        vm.typeCombine = typeCombine;
        vm.getByMinor=getByMinor;
        vm.major = major;
        vm.getMinorByMajor = getMinorByMajor;
        vm.save = save;

        function type(callback) {
            conn.get(BASE_URL + "status-change-type", {}, callback);
        }

        function typeCombine(callback) {
            conn.get(BASE_URL + "status-change-type-combine", {}, callback);
        }

        function getByMinor(minor, callback) {
            conn.get(BASE_URL + "status-change-type-by-minor", {'minor': minor}, callback);
        }

        function major(callback) {
            conn.get(BASE_URL + "status-change-type-major", {}, callback);
        }

        function getMinorByMajor(major, callback) {
            conn.get(BASE_URL + "status-change-type-minor-by-major", {'major': major}, callback);
        }

        function save(statusChangeType, callback) {
            conn.post(BASE_URL + "status-change-type-save", {'statusChangeType': statusChangeType}, callback);
        }
    }
})();
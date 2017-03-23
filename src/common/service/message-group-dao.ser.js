/**
 * 通知管理中负责通知组的管理
 * @author guhang
 * @date 2016/12/22.
 *
 */
(function () {
    'use strict';

    var utils = angular.module("ecnuUtils");

    utils.service("ecnuNotificationDao", ['EcnuConnection', "QUERY_PARAMS", NotificationDao]);
    function NotificationDao(conn) {
        var vm = this;
        var BASE_URL = "tz/group";

        vm.saveGroup = saveGroup;
        vm.getCurrentGroup = getCurrentGroup;
        vm.getGroupMembers = getGroupMembers;
        vm.deleteGroup = deleteGroup;
        vm.modifyGroup = modifyGroup;

        function saveGroup(name, selectedMembersId, callback) {
            var param = {};
            param["name"] = name;
            param["selectedMembers"] = selectedMembersId;
            conn.post(BASE_URL + "/save", param, callback);
        }

        function getCurrentGroup(callback) {
            conn.get(BASE_URL + "/current-groups", {}, callback);
        }

        function getGroupMembers(id, callback) {
            conn.get(BASE_URL + "/" + id + "/members", {}, callback);
        }

        function deleteGroup(id, callback) {
            conn.delete(BASE_URL + "/" + id + "/delete", {}, callback);
        }

        function modifyGroup(id, name, selectedMembers, callback) {
            var param = {};
            param["name"] = name;
            param["selectedMembers"] = selectedMembers;
            conn.put(BASE_URL + "/" + id + "/modify", group, callback);
        }
    }
})();
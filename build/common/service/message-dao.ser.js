/**
 * Created by guhang on 2016/12/28.
 */
(function () {
    'use strict';

    var utils = angular.module("ecnuUtils");

    utils.service("ecnuMessageDao", ['EcnuConnection', "QUERY_PARAMS", MessageDao]);
    function MessageDao(conn) {
        var vm = this;
        var BASE_URL = "tz/message";

        vm.save = save;
        vm.getCurrentMessages = getCurrentMessages;
        vm.getMessageDetails = getMessageDetails;
        vm.getMessageByMe = getMessageByMe;
        vm.deleteMessage = deleteMessage;
        vm.updateMessage = updateMessage;

        function save(message, members, groups, callback) {
            var param = {};
            param["message"] = message;
            param["members"] = members;
            param["groups"] = groups;
            conn.post(BASE_URL + "/save", param, callback);
        }

        function getCurrentMessages(start, end, callback) {
            var param = {};
            param["start"] = start;
            param["end"] = end;
            conn.get(BASE_URL + "/current-messages", param, callback);
        }

        function getMessageDetails(id, callback) {
            var param = {};
            conn.get(BASE_URL + "/" + id + "/message-details", param, callback);
        }

        function getMessageByMe(page, size, callback) {
            var param = {};
            param["page"] = page;
            param["size"] = size;
            conn.get(BASE_URL + "/messages-by-me", param, callback);
        }

        function deleteMessage(id, page, size, callback) {
            var param = {};
            param["page"] = page;
            param["size"] = size;
            conn.delete(BASE_URL + "/" + id + "/delete", param, callback);
        }

        function updateMessage(message,callback) {
            var param = {};
            param["message"] = message;
            conn.put(BASE_URL + "/update-message", param, callback);
        }

    }

})();
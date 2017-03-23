/**
 * Created by xiafan on 16-9-18.
 * Modified by guhang on 2016/10/21.
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuAccountDao", ["EcnuConnection", "QUERY_PARAMS", accountDao]);
    function accountDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "auth/accounts";
        //var ROLE_URL_PREFIX = BASE_URL + "/{accountId}/roles/{roleId}";

        vm.query = query;
        vm.loginWithTicket = loginWithTicket;
        vm.formLogin = formLogin;
        vm.findModifyInfo = findModifyInfo;
        vm.deleteRole = deleteRole;
        vm.addRole = addRole;
        vm.getDomains = getDomains;
        vm.updateRole = updateRole;
        vm.setRoles = setRoles;
        vm.getStaffAccount = getStaffAccount;
        vm.getStudentAccount = getStudentAccount;
        vm.logout = logout;
        vm.uploadPrivilege = uploadPrivilege;

        function uploadPrivilege(file, success, progress) {
            conn.upload(BASE_URL + "/" + "upload-privilege", {'file':file}, success, progress);
        }

        function findModifyInfo(accountId, callback) {
            conn.get(BASE_URL + "/" + accountId + "/roles-and-cands", {}, callback);
        }

        function deleteRole(accountId, roleId, callback) {
            conn.delete(BASE_URL + "/" + accountId + "/roles/" + roleId, {}, callback);
        }

        function addRole(accountId, roleId, domains, callback) {
            var param = {};
            param[QUERY_PARAMS.DOMAINS] = domains;
            conn.put(BASE_URL + "/" + accountId + "/roles/" + roleId + "/domains", param, callback);
        }

        function updateRole(accountId, roleId, domains, callback) {
            var param = {};
            param[QUERY_PARAMS.DOMAINS] = domains;
            conn.post(BASE_URL + "/" + accountId + "/roles/" + roleId + "/domains", param, callback);
        }

        function getDomains(accountId, roleId, callback) {
            conn.get(BASE_URL + "/" + accountId + "/roles/" + roleId + "/domains", {}, callback);
        }

        function query(stuNo, staffSno, callback) {
            var condition = {};
            condition['major'] = request.major;
            condition['minor'] = request.minor;
            condition['sno'] = request.sno;
            condition['reason'] = request.reason;

            var param = {};
            param[QUERY_PARAMS.CONDITION] = condition;

            conn.get(BASE_URL, params, callback);
        }

        function loginWithTicket(ticket, callback) {
            conn.get("login", {"ticket": ticket}, callback);
        }

        function formLogin(userName, password, callback) {
            var param = {};
            param[QUERY_PARAMS.USERNAME] = userName;
            param[QUERY_PARAMS.PASSWORD] = password;
            conn.post("login", param, callback);
        }

        function logout(callback) {
            var param = {};
            conn.get("logout", param, callback);
        }

        function setRoles(accountId, roleIds, callback) {
            var param = {};
            param[QUERY_PARAMS.ROLE_IDS] = roleIds;
            conn.post(BASE_URL + "/" + accountId + "/active-roles", param, callback);
        }

        function getStaffAccount(callback) {
            conn.get(BASE_URL + "/staff-account", {}, callback);
        }

        function getStudentAccount(callback) {
            conn.get(BASE_URL + "/student-account", {}, callback);
        }
    }
})();
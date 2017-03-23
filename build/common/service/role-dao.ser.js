/**
 * Created by xiafan on 16-9-18.
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuRoleDao", ["EcnuConnection","QUERY_PARAMS", roleDao]);
    function roleDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "auth/roles";
        vm.getRoles = getRoles;
        vm.saveRole = saveRole;
        vm.deleteRole = deleteRole;
        vm.findRole = findRole;
        vm.batchRolePage = batchRolePage;

        function getRoles(callback) {
            conn.get(BASE_URL, {}, callback);
        }

        function saveRole(roleId, roleName, domainLevel, pageIds, callback) {
            var params = {};
            params[QUERY_PARAMS.ROLE_ID] = roleId;
            params[QUERY_PARAMS.ROLE_NAME] = roleName;
            params[QUERY_PARAMS.DOMAIN_LEVEL] = domainLevel;
            params[QUERY_PARAMS.MENU_IDS] = pageIds;

            conn.post(BASE_URL, params, callback);
        }

        function deleteRole(roleId, callback) {
            conn.delete(BASE_URL + "/" + roleId, {}, callback);
        }

        function findRole(roleId, callback) {
            conn.get(BASE_URL + "/" + roleId, [], callback);
        }

        function batchRolePage(file, success, progress) {
            conn.upload(BASE_URL + '/batch-modify', {"file":file}, success, progress);
        }
    }
})();
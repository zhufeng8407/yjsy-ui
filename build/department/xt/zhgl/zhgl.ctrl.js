/**
 * Created by Ray on 2016/8/23.
 */

(function () {
    'use strict';
    var ecnuAdminHome = angular.module('ecnuAdminHome');

    ecnuAdminHome.controller('ZhglCtrl', ['$uibModal', 'ecnuAccountDao', 'PathUtils', ZhglController]);
    function ZhglController($uibModal, ecnuAccountDao, PathUtils) {
        var vm = this;
        var no;
        vm.name = "请查询";
        vm.unit = "请查询";
        vm.type = "请查询";
        vm.showTable = false;

        vm.search = search;
        vm.deleteRole = deleteRole;
        vm.showAddPanel = showAddPanel;
        vm.addRole = addRole;
        vm.modifyPrivilege = modifyPrivilege;
        vm.batchPrivilege = batchPrivilege;

        vm.downloadPath = PathUtils.getRootPath() + "/download/权限-职工.xlsx";

        function search() {
            ecnuAccountDao.findModifyInfo(vm.No, function (response) {
                if (response.error != null)
                    alert(response.error);
                else {
                    vm.showTable = true;
                    no = vm.No;
                    vm.no = no;
                    vm.name = response.name;
                    vm.unit = response.departmentName;
                    vm.type = response.type;
                    vm.accountRoles = accountRoleHandler(response.accountRoles);
                    vm.otherRoles = response.otherRoles;
                    vm.accountId = response.accountId;
                }
            })
        }

        function showAddPanel(index) {
            if (vm.otherRoles[index].domainLevel == "校级") {
                ecnuAccountDao.addRole(vm.accountId, vm.otherRoles[index].roleID, [], function (response) {
                    vm.accountRoles = accountRoleHandler(response.accountRoles);
                    vm.otherRoles.splice(index, 1);
                })
            } else {
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'addRolePanel.html',
                    controller: 'AddRoleCtrl',
                    controllerAs: 'addRoleCtrl',
                    backdrop: 'static',
                    resolve: {
                        sc: vm,
                        index: index,
                        type: 0
                    }
                });
            }
        }

        function modifyPrivilege(index) {
            $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'addRolePanel.html',
                controller: 'AddRoleCtrl',
                controllerAs: 'addRoleCtrl',
                backdrop: 'static',
                resolve: {
                    sc: vm,
                    index: index,
                    type: 1
                }
            });
        }

        function batchPrivilege() {
            $uibModal.open({
                animation: true,
                templateUrl: 'batchPrivilege.html',
                controller: 'PrivilegeUploadCtrl',
                controllerAs: 'privilegeUploadCtrl',
                /*                resolve: {
                 sc: vm
                 }*/
            });
        }

        function deleteRole(index) {
            ecnuAccountDao.deleteRole(vm.accountId, vm.accountRoles[index].roleID, function () {
                vm.otherRoles.push({
                    "roleID": vm.accountRoles[index].roleID,
                    "roleName": vm.accountRoles[index].roleName,
                    "domainLevel": vm.accountRoles[index].domainLevel
                });
                vm.accountRoles.splice(index, 1);
            })
        }

        function addRole() {
            ecnuAccountDao.addRole(no, vm.otherRoles[index].roleID, []);
        }

    }

    ecnuAdminHome.controller('AddRoleCtrl', [
        '$uibModalInstance',
        'ecnuMetaDataDao',
        'ecnuAccountDao',
        'sc',
        'index',
        'type',
        'QUERY_PARAMS',
        AddRoleCtrl
    ]);
    function AddRoleCtrl($uibModalInstance, ecnuMetaDataDao, ecnuAccountDao, sc, index, type, QUERY_PARAMS) {
        var vm = this;
        var thisRole = sc.otherRoles[index];

        vm.isLevelTwo = false;
        vm.domains = new Array();
        vm.isAdd = false;

        init();

        vm.getDepartment = getDepartment;
        vm.closeModel = closeModel;
        vm.addLine = addLine;
        vm.deleteUnit = deleteUnit;
        vm.saveRole = saveRole;
        vm.resetRole = resetRole;

        function init() {
            vm.departmentCode2Name = {};
            vm.departmentCode2Name["所有"] = "所有";
            vm.schoolCode2Name = {};
            vm.schoolCode2Name["所有"] = "所有";

            if (type == 1) {
                ecnuAccountDao.getDomains(sc.accountId, sc.accountRoles[index].roleID, function (response) {
                    vm.domains = response;
                });
                thisRole = sc.accountRoles[index];
            }
            if (thisRole.domainLevel == "二级") {
                vm.isLevelTwo = true;
                vm.isAdd = true;
            }
            ecnuMetaDataDao.getUnitSchool(function (response) {
                vm.schools = response;
                for (var i = 0; i < vm.schools.length; i++) {
                    var school = vm.schools[i];
                    vm.schoolCode2Name[school[1]] = school[0];
                }
                vm.unitSchool = '所有';
                vm.unitDepartment = '所有';
            });
        }

        function getDepartment() {
            if (thisRole.domainLevel == "二级")
                ecnuMetaDataDao.getUnitDepartment(vm.unitSchool, function (response) {
                    vm.departments = response;
                    for (var i = 0; i < vm.departments.length; i++) {
                        var department = vm.departments[i];
                        vm.departmentCode2Name[department[1]] =
                            department[0];
                    }
                    vm.unitDepartment = '所有';
                    vm.isAdd = (vm.departments.length == 0);
                });
            else
                vm.isAdd = false;
        }

        function createDomain(levelOneCode, levelTwoCode) {
            var newDomain = {};
            newDomain[QUERY_PARAMS.SCHOOL_CODE] = levelOneCode;
            newDomain[QUERY_PARAMS.SCHOOL_NAME] = vm.schoolCode2Name[levelOneCode];
            newDomain[QUERY_PARAMS.DEPARTMENT_CODE] = levelTwoCode;
            newDomain[QUERY_PARAMS.DEPARTMENT_NAME] = vm.departmentCode2Name[levelTwoCode];
            return newDomain;
        }

        function addLine() {
            if (vm.unitDepartment != "所有") {
                var k = 0;
                for (var i = 0; i < vm.domains.length; i++)
                    if (vm.domains[i][QUERY_PARAMS.SCHOOL_CODE] == vm.unitSchool)
                        k++;
                if (k < vm.departments.length) {
                    vm.domains.push(createDomain(vm.unitSchool, vm.unitDepartment));
                }
            } else {
                if (thisRole.domainLevel != "一级") {
                    for (var j = 0; j < vm.departments.length; j++) {
                        var flag = false;
                        for (var i = 0; i < vm.domains.length; i++)
                            if (vm.domains[i][QUERY_PARAMS.DEPARTMENT_CODE] == vm.departments[j][1]) {
                                flag = true;
                                break;
                            }
                        if (!flag)
                            vm.domains.push(createDomain(vm.unitSchool, vm.departments[j][1]));
                    }
                    if (vm.departments.length == 0) {
                        vm.domains.push(createDomain(vm.unitSchool, "所有"));
                        vm.unitSchool = "所有";
                    }
                } else {
                    if (vm.unitSchool == "所有") {
                        for (var i = 0; i < vm.schools.length; i++) {
                            var flag = false;
                            for (var j = 0; j < vm.domains.length; j++)
                                if (vm.schools[i][1] == vm.schools[i][0]) {
                                    flag = true;
                                    break;
                                }
                            if (!flag)
                                vm.domains.push(createDomain(vm.schools[i][1], "所有"));
                        }
                    }
                    else {
                        vm.domains.push(createDomain(vm.unitSchool, vm.unitDepartment));
                    }
                    vm.unitSchool = "所有";
                }
            }

            //vm.unitSchool = "所有";
            vm.unitDepartment = "所有";
            //vm.departments = null;
        }

        function deleteUnit(index) {
            if (vm.domains.length != 0)
                vm.domains.splice(index, 1);
        }

        function saveRole() {
            if (type == 0) {
                ecnuAccountDao.addRole(sc.accountId, sc.otherRoles[index].roleID, vm.domains
                    , function (response) {
                        sc.accountRoles = accountRoleHandler(response.accountRoles);
                        sc.otherRoles.splice(index, 1);
                        $uibModalInstance.dismiss('cancel');
                    });
            } else
                ecnuAccountDao.updateRole(sc.accountId, sc.accountRoles[index].roleID, vm.domains
                    , function (response) {
                        sc.accountRoles = accountRoleHandler(response.accountRoles);
                        $uibModalInstance.dismiss('cancel');
                    });
        }

        function resetRole() {
            init();
        }

        function closeModel() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    ecnuAdminHome.filter("schoolFilter", schoolFilter);
    function schoolFilter() {
        return function (input, selected) {
            if (input == null) return null;
            var array = [];
            var k = 0;
            var flag = 0;
            for (var i = 0; i < input.length; i++) {
                flag = 0;
                for (var j = 0; j < selected.length && k < selected.length; j++) {
                    if (input[i][1] == selected[j].schoolCode && selected[j].departmentCode == "所有") {
                        k++;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0)
                    array.push(input[i]);
            }
            return array;
        }
    }

    ecnuAdminHome.filter("departmentFilter", departmentFilter);
    function departmentFilter() {
        return function (input, selected) {
            if (input == null) return null;
            var array = [];
            var k = 0;
            var flag = 0;
            for (var i = 0; i < input.length; i++) {
                flag = 0;
                for (var j = 0; j < selected.length && k < selected.length; j++) {
                    if (input[i][1] == selected[j].departmentCode) {
                        k++;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0)
                    array.push(input[i]);
            }
            return array;
        }
    }

    ecnuAdminHome.controller('PrivilegeUploadCtrl',
        [
            '$uibModalInstance',
            'ecnuAccountDao',
            'FileExport',
            'ecnuGlobalDao',
            PrivilegeUploadCtrl
        ]);
    function PrivilegeUploadCtrl($uibModalInstance, ecnuAccountDao, FileExport, ecnuGlobalDao) {
        var vm = this;

        vm.uploadBtn = true;
        vm.exportBtn = false;
        vm.uploadPrivilege = uploadPrivilege;
        vm.cancel = cancel;
        vm.exportError = exportError;

        function uploadPrivilege(file) {
            var progress_lock = false;
            ecnuAccountDao.uploadPrivilege(file, function (response) {
                vm.isDisabled = true;
                vm.Msg = "修改文件上传成功！";
                progress_lock = true;
                vm.progress = 100;
                if (response.data.state == 0) {
                    vm.isDisabled = true;
                    vm.progress = 0;
                    vm.Msg = "导入文件格式有误，无法解析该文件，正确的文件格式为.xls或.xlsx，请确保文件格式正确！";
                }
                else if (response.data.state == 1) {
                    vm.isDisabled = true;
                    vm.progress = 0;
                    vm.Msg = "文件表头不正确请下载模板";
                }
                else {
                    vm.key = response.data.key;
                    if (response.data.state == 2) {
                        vm.isDisabled = false;
                        vm.type = "progress-bar progress-bar-success progress-bar-striped";
                        vm.Msg = "总共 " + response.data.total + " 条数据，成功导入 " +
                            (response.data.total - response.data.error) + " 条数据，失败" +
                            response.data.error + "条数据";
                    }
                }

                vm.isShowMsg = true;
                vm.uploadBtn = false;

                if (response.data.error != null && response.data.error != 0)
                    vm.exportBtn = true;
                else
                    vm.exportBtn = false;

            }, function () {
                vm.type = "progress-bar progress-bar-info progress-bar-striped";
                ecnuGlobalDao.getProgress(function (res) {
                    if (!progress_lock)
                        vm.progress = res;
                });
            });
        }

        function exportError() {
            ecnuGlobalDao.exportErrors(vm.key, function (res) {
                FileExport.export(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", "导出失败账号管理信息");
            });
            //cancel;
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
            ecnuGlobalDao.clearErrors(vm.key, function () {
            });
        }
    }

    function accountRoleHandler(accountRole) {
        for (var i = 0; i < accountRole.length; i++) {
            var res = "";
            if (accountRole[i].domains == null) {
                if (accountRole[i].domainLevel == "校级")
                    accountRole[i].domains = "所有";
                else
                    accountRole[i].domains = "无";
                continue;
            }
            var domains = accountRole[i].domains.split(",");
            for (var j = 0; j < domains.length; j++) {
                res = res + domains[j].split("|")[0] + " | ";
            }
            accountRole[i].domains = res.substring(res, res.length - 3);
        }
        return accountRole;
    }

})();
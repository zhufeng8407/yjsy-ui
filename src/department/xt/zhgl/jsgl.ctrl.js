/**
 * Created by Ray on 2016/8/23.
 * @description: 角色管理的控制器定义
 */

(function () {
    'use strict';
    var ecnuAdminHome = angular.module('ecnuAdminHome');

    ecnuAdminHome.controller('RoleCtrl', ['ecnuRoleDao', 'ecnuMenuDao', '$uibModal', RoleCtrl]);
    function RoleCtrl(ecnuRoleDao, ecnuMenuDao, $uibModal) {
        var vm = this;
        var ids = new Array();
        var roleid = -1;

        vm.isadd = true;
        vm.domainLevel = "STUDENT";
        vm.isShowEdit = false;

        vm.addRole = addRole;
        vm.checkboxChange = checkboxChange;
        vm.showSelected = showSelected;
        vm.deleteRole = deleteRole;
        vm.modifyRole = modifyRole;
        vm.reset = reset;
        vm.cancel = cancel;
        vm.doModify = doModify;
        vm.showEditPanel = showEditPanel;
        vm.showUploadPanel = showUploadPanel;
        vm.downloadDemo = downloadDemo;

        vm.treeOptions = {
            nodeChildren: "subMenu",
            dirSelectable: false
        };
        ecnuMenuDao.getPage(function (result) {
            vm.pageTree = result.menu;
        });

        ecnuRoleDao.getRoles(function (response) {
            vm.roles = response;
        });

        function addRole() {
            ecnuRoleDao.saveRole(-1, vm.jsm, vm.domainLevel, ids,
                function (response) {
                    vm.roles = response;
                    reset();
                }
            )
            ;
        }

        function checkboxChange(checked, node) {
            if (checked == false) {
                remove(node);
                console.log(ids);
            }
            else {
                while (node != null) {
                    if (!ids.includes(node.id)) {
                        node.$checked = true;
                        ids.push(node.id);
                    }
                    node = node.parent;
                }
            }
            console.log(ids);
        }

        function remove(node) {
            if (ids.includes(node.id)) {
                ids.splice(ids.indexOf(node.id), 1);
                node.$checked = false;
                angular.forEach(node.subMenu, function (child) {
                    remove(child);
                });
            }
        }

        function showSelected(sel) {
            vm.selectedNode = sel;
        }

        function deleteRole(id) {
            ecnuRoleDao.deleteRole(id, function (response) {
                vm.roles = response;
            });
        }

        function modifyRole(id) {
            vm.isShowEdit = true;
            ecnuRoleDao.findRole(id, function (response) {
                ids = response.ids;
                vm.jsm = response.roleName;
                vm.domainLevel = response.domainLevel;
                roleid = id;

                angular.forEach(vm.pageTree, function (node) {
                    setTreeChecked(node);
                });
                vm.isadd = false;
            });
        }

        function setTreeChecked(node) {
            var i = 0;
            if (node != null) {
                for (i = 0; i < ids.length; i++)
                    if (node.id == ids[i]) {
                        node.$checked = true;
                        break;
                    }
                if (i == ids.length)
                    node.$checked = false;
                angular.forEach(node.subMenu, function (node) {
                    setTreeChecked(node);
                });
            }
        }

        function reset() {
            if (roleid != -1)
                modifyRole(roleid);
            else
                cancel();
            vm.isShowEdit = true;
        }

        function cancel() {
            vm.isShowEdit = false;
            ids = [];
            vm.jsm = "";
            vm.domainLevel = "student";
            vm.isadd = true;
            roleid = -1;
            angular.forEach(vm.pageTree, function (node) {
                setTreeChecked(node);
            });
        }

        function doModify() {
            ecnuRoleDao.saveRole(roleid, vm.jsm, vm.domainLevel, ids,
                function (response) {
                    vm.roles = response;
                    cancel();
                });
        }

        function showEditPanel() {
            cancel();
            vm.isShowEdit = true;
        }

        function showUploadPanel() {
            $uibModal.open({
                animation: true,
                templateUrl: 'uploadFile.html',
                controller: 'UploadCtrl',
                controllerAs: 'uploadCtrl'
            });
        }

        function downloadDemo() {
            window.location.href = PathUtils.qualifiedPath("/download/角色-页面.xlsx");
        }
    }

    ecnuAdminHome.controller('UploadCtrl', ['ecnuRoleDao', '$uibModalInstance', 'ecnuGlobalDao', 'FileExport', UploadCtrl]);
    function UploadCtrl(ecnuRoleDao, $uibModalInstance, ecnuGlobalDao, FileExport) {
        var vm = this;

        vm.showExport = false;

        vm.upload = upload;
        vm.exportError = exportError;
        vm.cancel = cancel;

        function upload() {
            ecnuRoleDao.batchRolePage(vm.file
                , function (res) {
                    vm.isShowMsg = true;
                    vm.Msg = res.data.msg;
                    if (res.data.totalNumber == null)
                        vm.type = "progress-bar progress-bar-danger progress-bar-striped";
                    else {
                        vm.type = "progress-bar progress-bar-success progress-bar-striped";
                        vm.Msg = res.data.msg + "总共" + res.data.totalNumber + "条，成功导入" + (res.data.totalNumber - res.data.errorNumber) + "条，失败" + res.data.errorNumber + "条。";
                        if (res.data.errorNumber != 0) {
                            vm.showExport = true;
                        }
                        vm.key = res.data.key;
                    }
                    vm.progress = 100;

                }, function () {
                    vm.type = "progress-bar progress-bar-info progress-bar-striped";
                    ecnuGlobalDao.getProgress(function (res) {
                        vm.progress = res;
                    });
                });
        }

        function exportError() {
            ecnuGlobalDao.exportErrors(vm.key, function (res) {
                FileExport.export(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", "批量修改失败条目信息");
            });
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss();
            if (vm.key != null)
                ecnuGlobalDao.clearErrors(vm.key, function () {
                });
        }
    }
})();


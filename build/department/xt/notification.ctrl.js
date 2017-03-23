/**
 * Created by guhang on 2016/12/14.
 */
(function () {
    'use strict';
    var ecnuAdminHome = angular.module('ecnuAdminHome');

    ecnuAdminHome.controller("NotificationCtrl", ['$uibModal', 'ecnuAccountDao', 'ecnuNotificationDao', 'ecnuMessageDao', NotificationCtrl]);

    function NotificationCtrl($uibModal, ecnuAccountDao, ecnuNotificationDao, ecnuMessageDao) {
        var vm = this;
        var isLoadStudent = false;
        var isLoadStaff = false;
        var isLoadGroup = false;

        var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];

        vm.message = {};
        vm.receiversId = [];
        vm.groupsId = [];
        vm.start_isopen = false;
        vm.unselectedStudentItems = [];
        vm.unselectedStaffItems = [];
        vm.unselectedGroupItems = [];
        vm.receivers = [];
        vm.groups = [];

        vm.clickMember = clickMember;
        vm.clickGroup = clickGroup;
        vm.closeAlert = closeAlert;
        vm.showAddGroupPanel = showAddGroupPanel;
        vm.showModifyGroupPanel = showModifyGroupPanel;
        vm.choseStaff = choseStaff;
        vm.choseStudent = choseStudent;
        vm.choseGroup = choseGroup;
        vm.deleteGroup = deleteGroup;
        vm.saveMessage = saveMessage;
        vm.trixAttachmentAdd = trixAttachmentAdd;
        vm.uploadAttachment = uploadAttachment;

        init();

        function init() {
            choseStaff();
        }

        function clickMember(item) {
            vm.receivers.push(item.name);
            vm.receiversId.push(item.id);
        }

        function clickGroup(item) {
            vm.groups.push(item.name);
            vm.groupsId.push(item.id);
        }

        function closeAlert(index, type) {
            if (type == 1) {
                vm.receivers.splice(index, 1);
                vm.receiversId.splice(index, 1);
            }
            else {
                vm.groups.splice(index, 1);
                vm.groupsId.splice(index, 1);
            }

        }

        function choseStaff() {
            if (!isLoadStaff)
                ecnuAccountDao.getStaffAccount(function (res) {
                    vm.unselectedStaffItems = res.data;
                    isLoadStaff = true;
                })
        }

        function choseStudent() {
            if (!isLoadStudent)
                ecnuAccountDao.getStudentAccount(function (res) {
                    vm.unselectedStudentItems = res.data;
                    isLoadStudent = true;
                })
        }

        function choseGroup() {
            if (!isLoadGroup)
                ecnuNotificationDao.getCurrentGroup(function (res) {
                    vm.unselectedGroupItems = res.data;
                    isLoadGroup = true;
                })
        }

        function showAddGroupPanel() {
            $uibModal.open({
                animation: true,
                templateUrl: 'addGroupPanel.html',
                controller: 'AddGroupPanelCtrl',
                controllerAs: 'addGroupPanelCtrl',
                backdrop: 'static',
                resolve: {
                    sc: vm,
                    item: null
                }
            });
        }

        function showModifyGroupPanel(item) {
            $uibModal.open({
                animation: true,
                templateUrl: 'addGroupPanel.html',
                controller: 'AddGroupPanelCtrl',
                controllerAs: 'addGroupPanelCtrl',
                backdrop: 'static',
                resolve: {
                    sc: vm,
                    item: item
                }
            });
        }

        function deleteGroup(index) {
            ecnuNotificationDao.deleteGroup(vm.unselectedGroupItems[index].id, function (res) {
                vm.unselectedGroupItems.splice(index, 1);
            })
        }

        function saveMessage() {
            ecnuMessageDao.save(vm.message, vm.receiversId, vm.groupsId, function () {
                alert("通知保存成功！");
            });
        }

        function trixAttachmentAdd(e) {
            var attachment;
            attachment = e.attachment;
            if (attachment.file) {
                return uploadAttachment(attachment);
            }
        }

        function uploadAttachment(attachment) {
            var file, form, key, xhr;
            file = attachment.file;
            key = createStorageKey(file);
            form = new FormData;
            form.append("key", key);
            form.append("Content-Type", file.type);
            form.append("file", file);
            xhr = new XMLHttpRequest;
            xhr.open("POST", host, true);
            xhr.upload.onprogress = function (event) {
                var progress;
                progress = event.loaded / event.total * 100;
                return attachment.setUploadProgress(progress);
            };
            xhr.onload = function () {
                var href, url;
                if (xhr.status === 204) {
                    url = href = host + key;
                    return attachment.setAttributes({
                        url: url,
                        href: href
                    });
                }
            };
            return xhr.send(form);
        }

        function createStorageKey(file) {
            var date, day, time;
            date = new Date();
            day = date.toISOString().slice(0, 10);
            time = date.getTime();
            return "tmp/" + day + "/" + time + "-" + file.name;
        };
    }

    ecnuAdminHome.controller("AddGroupPanelCtrl", ['sc', 'item', '$uibModalInstance', 'ecnuAccountDao', 'ecnuNotificationDao', AddGroupPanelCtrl]);
    function AddGroupPanelCtrl(sc, item, $uibModalInstance, ecnuAccountDao, ecnuNotificationDao) {
        var vm = this;
        var isLoadedStaff = false;
        var isLoadedStudent = false;
        vm.unselectedStudentMembers = [];
        vm.unselectedStaffMembers = [];
        vm.selectedMembers = [];
        vm.group = {};
        vm.group.selectedMembersId = [];

        vm.select = select;
        vm.unselect = unselect;
        vm.save = save;
        vm.close = close;
        vm.choseStaff = choseStaff;
        vm.choseStudent = choseStudent;

        init();

        function init() {
            choseStaff();
            if (item != null) {
                ecnuNotificationDao.getGroupMembers(item.id, function (res) {
                    vm.group.selectedMembersId = res.selectedMembersId;
                    vm.selectedMembers = res.selectedMembersName;
                });
                vm.group.name = item.name;
            }
        }

        function select(item) {
            vm.selectedMembers.push({"name": item.name});
            vm.group.selectedMembersId.push(item.id);
        }

        function unselect(index) {
            vm.selectedMembers.splice(index, 1);
            vm.group.selectedMembersId.splice(index, 1);
        }

        function choseStaff() {
            if (!isLoadedStaff)
                ecnuAccountDao.getStaffAccount(function (res) {
                    vm.unselectedStaffMembers = res.data;
                    isLoadedStaff = true;
                })
        }

        function choseStudent() {
            if (!isLoadedStudent)
                ecnuAccountDao.getStudentAccount(function (res) {
                    vm.unselectedStudentMembers = res.data;
                    isLoadedStudent = true;
                })
        }

        function save() {
            if (item == null) {
                ecnuNotificationDao.saveGroup(vm.group.name, vm.group.selectedMembersId, function (res) {
                    if (res.group != null) {
                        sc.unselectedGroupItems.push(res.group);
                        close();
                    }
                });
            }
            else {
                ecnuNotificationDao.modifyGroup(item.id, vm.group.name, vm.group.selectedMembersId, function (res) {
                    if (res.message == "success") {
                        item.name = vm.group.name;
                        close();
                    }
                });
            }
        }

        function close() {
            $uibModalInstance.dismiss();
        }
    }

    ecnuAdminHome.filter("selectedMemberFilter", SelectedMemberFilter);
    function SelectedMemberFilter() {
        return function (input, selectedMember) {
            if (input == null) return null;
            if (selectedMember == null || selectedMember.length == 0) return input;
            var array = [];
            var flag;
            for (var i = 0; i < input.length; i++) {
                flag = true;
                for (var j = 0; j < selectedMember.length; j++) {
                    if (input[i].id == selectedMember[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) array.push(input[i]);
            }
            return array;
        }
    }
})();
/**
 * Created by Ray on 2016/8/23.
 */

(function () {
    'use strict';
    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.controller('YdlcController',
                         ['ecnuStatusChangeTypeDao', 'ecnuRoleDao', 'ecnuAuditWorkflowDao', YdlcController]);
    function YdlcController(statusChangeTypeDao, roleDao, auditWorkflowDao) {
        var vm = this;

        vm.majors = null;
        vm.major = null;
        vm.minors = null;
        vm.minor = null;
        vm.roles = null;
        vm.role = null;
        vm.sequences = null;
        vm.warningStatus = null;
        vm.rightStatus = null;
        vm.auditflow = null;

        vm.onMajorChosen = onMajorChosen;
        vm.onMinorChosen = onMinorChosen;
        vm.addSequence = addSequence;
        vm.deleteSequence = deleteSequence;
        vm.getSequence = getSequence;
        vm.save = save;

        onPageLoad();

        function onPageLoad() {

            //get all major status change types
            statusChangeTypeDao.major(function (response) {
                vm.majors = response;
                vm.major = vm.majors[0][0];
                onMajorChosen();
            });

            //load all roles
            roleDao.getRoles(function (response) {
                vm.roles = response;
                vm.role = vm.roles[0].roleName
            });

        }

        function onMajorChosen() {

            statusChangeTypeDao.getMinorByMajor(vm.major, function (response) {
                vm.minors = response;
                vm.minor = vm.minors[0][0];
                vm.warningStatus = null;
                vm.rightStatus = null;
                getSequence();
            });

        }

        function onMinorChosen() {

            vm.warningStatus = null;
            vm.rightStatus = null;
            getSequence();

        }

        /**
         * 获取审批流程
         */
        function getSequence() {

            auditWorkflowDao.getAuditFlow(vm.minor, function (response) {
                vm.sequences = response;
            });

        }

        function addSequence() {

            if (vm.sequences.indexOf(vm.role) == -1) {
                vm.sequences.push(vm.role);
                vm.warningStatus = null;
                vm.rightStatus = null;
            } else {
                vm.warningStatus = '流程不可重复';
                vm.rightStatus = null;
            }

        }

        function deleteSequence() {
            vm.sequences.pop(vm.role);
        }

        function save() {

            var auditflow = new Array();
            for (var i in vm.sequences) {
                auditflow[i] = {};
                auditflow[i].role = vm.sequences[i];
                auditflow[i].sequence = parseInt(i) + 1;
		auditflow[i].major = vm.major;
                auditflow[i].minor = vm.minor;
            }

            auditWorkflowDao.save(auditflow, function (response) {
                vm.warningStatus = null;
                vm.rightStatus = '保存成功';
            });

        }
    }
})();


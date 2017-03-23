/**
 * Created by Ray on 2016/8/23.
 */
(function () {
    'use strict';

    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.controller('YdsqCtrl',
                         ['$uibModal', 'ecnuStudentDao', 'ecnuMetaDataDao', YdsqCtrl]);
    function YdsqCtrl($uibModal, ecnuStudentDao, ecnuMetaDataDao) {
        var vm = this;

        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.animationsEnabled = true;
        vm.page = false;
        vm.num = [10, 20, 30, 40, 50];

        vm.totalItems = 0;
        vm.items = null;
        vm.tableDisplay = "none";

        vm.applyConfig = {};
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            school: true,
            department: true,
            grade:true
        };

        vm.getDepartmentsOfSchool = getDepartmentsOfSchool;
        vm.getByPage = getByPage;
        vm.open = open;
        vm.openStatus = openStatus;

        ecnuMetaDataDao.getUnitSchool(function (response) {
                                      vm.schools = response;
                                      vm.school = 'null';
                                  }
        );

        function getDepartmentsOfSchool() {
            ecnuMetaDataDao.getUnitDepartment(vm.school, function (response) {
                vm.departments = response;
                vm.department = 'null';
            });
        }

        function getByPage() {
            vm.page = true;
            ecnuStudentDao.searchStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                     function (response) {
                                         vm.totalItems = response.count;
                                         vm.items = response.items;
                                         vm.tableDisplay = "block";
                                     });
        }

        function open(size, student) {
            var modalInstance = $uibModal.open({
                                                   animation: vm.animationsEnabled,
                                                   backdrop: 'static',
                                                   ariaLabelledBy: 'modal-title',
                                                   ariaDescribedBy: 'modal-body',
                                                   templateUrl: 'request.html',
                                                   controller: 'YdsqModalCtrl',
                                                   controllerAs: 'ydsqModalCtrl',
                                                   size: size,
                                                   resolve: {
                                                       student: function () {
                                                           return student;
                                                       }
                                                   }
                                               });
            modalInstance.result.then(function (request) {
                vm.openStatus('申请成功');
            });
        }

        function openStatus(status) {
            var statusModal = $uibModal.open({
                                                 animation: vm.animationsEnabled,
                                                 backdrop: 'static',
                                                 ariaLabelledBy: 'status-modal-title',
                                                 ariaDescribedBy: 'status-modal-body',
                                                 templateUrl: 'status.html',
                                                 controller: 'statusModalCtrl',
                                                 controllerAs: 'statusModalCtrl',
                                                 resolve: {
                                                     status: function () {
                                                         return status;
                                                     }
                                                 }
                                             });
            statusModal.result.then(function () {
            }, function () {
            });
        }


    }

    ecnuXueJi.controller('YdsqModalCtrl',
                         ['$uibModalInstance', 'student', YdsqModalCtrl]);
    function YdsqModalCtrl($uibModalInstance, student) {
        var vm = this;

        vm.student = student;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.applyConfig = {"student": student, "onSuccess": vm.ok, "onCancel": vm.cancel};

        function ok() {
            $uibModalInstance.close(null);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }


    ecnuXueJi.controller('statusModalCtrl',
                         ['$uibModalInstance', 'status', statusModalCtrl]);
    function statusModalCtrl($uibModalInstance, status) {

        var vm = this;

        vm.status = status;

        vm.ok = ok;

        function ok() {
            $uibModalInstance.close();
        }

    }
})();




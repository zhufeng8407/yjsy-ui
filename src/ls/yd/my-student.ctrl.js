/**
 * Created by LeeYanBin on 2017/3/7.
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('teachhome');
    ecnuXjHome.controller('MyStudentCtrl',
        [
            '$uibModal',
            'ecnuStudentDao',
            'PageState',
            'QUERY_PARAMS',
            'SimpleModal',
            MyStudentCtrl
        ]);

    function MyStudentCtrl($uibModal, ecnuStudentDao, PageState, QUERY_PARAMS) {
        var vm = this;

        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;

        /* 用于选择每页想要显示的数目 */
        vm.num = [10, 20, 30, 40, 50];

        vm.page = false;

        vm.searchCondition = {};
        vm.searchCondition.staffNo = PageState.getUser().getUserID();

        vm.myStudentsPageChange = myStudentsPageChange;
        vm.searchMyStudents = searchMyStudents;
        vm.update = update;

        ecnuStudentDao.searchMyStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
            handleSearchResult);

        function searchMyStudents() {
            ecnuStudentDao.searchMyStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                handleSearchResult);
        }

        function myStudentsPageChange() {
            ecnuStudentDao.searchMyStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                handleSearchResult);
        }

        function handleSearchResult(response) {
            vm.page = true;
            vm.totalItems = response[QUERY_PARAMS.ITEMS_COUNT];
            vm.students = response[QUERY_PARAMS.ITEMS];
        }

        function update(sno) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                size: "lg",
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'modalInstanceCtrl',
                resolve: {
                    student: {'sno': sno}
                }
            });
            modalInstance.result.then(function () {
                searchMyStudents();
            }, null);
        }
    }

    ecnuXjHome.controller("ModalInstanceCtrl", [
        '$uibModalInstance',
        'student',
        ModalInstanceCtrl
    ]);
    function ModalInstanceCtrl($uibModalInstance, student) {
        var vm = this;
        vm.sno = student.sno;
        vm.close = close;

        function close() {
            $uibModalInstance.close();
        }
    }

})();

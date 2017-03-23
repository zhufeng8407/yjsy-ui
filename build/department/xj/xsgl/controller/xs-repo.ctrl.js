(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');
    ecnuXjHome.controller('XsRepoCtrl', ['SimpleModal', 'ecnuStudentDao', 'ecnuRepoDao', 'ecnuMetaDataDao', 'QUERY_PARAMS', XsRepoCtrl]);
    function XsRepoCtrl(SimpleModal, ecnuStudentDao, ecnuRepoDao, ecnuMetaDataDao, QUERY_PARAMS) {
        var vm = this;

        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.page = false;

        vm.num = [10, 20, 30, 40, 50];

        vm.students = {};
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            school: true,
            department: true,
            autoNew: true
        };

        vm.updateStatus = updateStatus; //批量转库
        vm.updateSingleStatus = updateSingleStatus;//单个新生转库
        vm.searchStudents = searchStudents;

        function searchStudents() {
            vm.searchCondition.new = true;
            vm.page = true;
            ecnuRepoDao.searchStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition, function (response) {
                vm.totalItems = response[QUERY_PARAMS.ITEMS_COUNT];
                vm.items = response[QUERY_PARAMS.ITEMS];
            });
        }

        function updateStatus() {//批量转库
            SimpleModal.open("确认批量入籍？", ok, cancel);
            function ok() {
                ecnuRepoDao.updateStatus(vm.searchCondition, function (response) {
                    alert(response[QUERY_PARAMS.ITEMS]);
                    searchStudents(vm.searchCondition);
                });
            }

            function cancel() {
            }
        }

        function updateSingleStatus(sno) {
            SimpleModal.open("确认入籍？", ok, cancel);
            function ok() {
                ecnuRepoDao.updateSingleStatus(sno, function (response) {
                    if (response == true) {
                        searchStudents(vm.searchCondition);
                    } else {
                        alert("该生未注册");
                    }
                });
            }

            function cancel() {
            }
        }
    }
})();
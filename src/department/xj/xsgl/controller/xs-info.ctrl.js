/**
 * @author xiafan
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller("XsInfoCtrl", XsInfoCtrl);
    XsInfoCtrl.$inject = [
        '$uibModal',
        'ecnuStudentDao',
        'QUERY_PARAMS'
    ];

    function XsInfoCtrl($uibModal, ecnuStudentDao, QUERY_PARAMS) {
        var vm = this;

        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.page = false;
        vm.isShow = false;
        vm.uploading = false;
        vm.attributes = ["学号", "专业"];
        vm.num = [10, 20, 30, 40, 50];
        //为搜索框模板设置参数，searchCondition接收输入的内容，searchConditionMeta指定显示的搜索栏
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            grade: true,
            school: true,
            department: true,
            educationType: true,
            discipline: true,
            major: true,
            minor: true,
            autoNew: true
        };

        vm.search = search;
        vm.update = update;
        vm.batchUpdate = batchUpdate;

        function search() {
            ecnuStudentDao.searchStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                          handleSearchResult);
        }

        function handleSearchResult(response) {
            vm.page = true;
            vm.totalItems = response[QUERY_PARAMS.ITEMS_COUNT];
            vm.students = response[QUERY_PARAMS.ITEMS];

            for (var i = 0; i < vm.students.length; i++) {
                if (vm.students[i].degreeType == "Master")
                    vm.students[i].degreeType = "硕士";
                else if (vm.students[i].degreeType == "Doctor")
                    vm.students[i].degreeType = "博士";
            }
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
                                                       sno: function () {
                                                           return sno;
                                                       }
                                                   }
                                               });
            modalInstance.result.then(function () {
                search();
            }, null);
        }

        function batchUpdate(file) {
            //FIXME: 处理 file == undefined的情况
            if (!vm.uploading && !file.$error) {
                vm.uploading = true;
                ecnuStudentDao.batchUpdate(file, function (resp) {
                                               vm.uploading = false;
                                               vm.updateResult = resp.data;
                                               if (vm.updateResult == true) {
                                                   alert("批量修改成功！");
                                                   search();
                                               }
                                               else if (vm.updateResult == false)
                                                   alert("批量修改失败！");
                                           },
                                           function (evt) {
                                               vm.progress = parseInt(100.0
                                                                      * evt.loaded / evt.total);

                                           });
            }
        }
    }

    ecnuXjHome.controller("ModalInstanceCtrl", ModalInstanceCtrl);
    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'sno'];
    function ModalInstanceCtrl($uibModalInstance, sno) {
        var vm = this;

        vm.sno = sno;
        vm.close = close;

        function close() {
            $uibModalInstance.close();
        }

    }
})();
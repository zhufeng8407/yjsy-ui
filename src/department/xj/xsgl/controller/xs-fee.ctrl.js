/**
 * @author LeeYanBin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsFeeCtrl', XsFeeCtrl);

    XsFeeCtrl.$inject = [
        '$scope',
        'QUERY_PARAMS',
        'PathUtils',
        'ecnuRegistrationDao',
        'ecnuGlobalDao',
        'FileExport',
        "Prompt"
    ];
    function XsFeeCtrl($scope, QUERY_PARAMS, PathUtils, ecnuRegistrationDao, ecnuGlobalDao, FileExport, Prompt) {
        var vm = this;

        vm.downloadPath = PathUtils.qualifiedPath("/download/缴费.xlsx");
        vm.uploading = false;
        vm.flag = false;
        vm.exportBtn = true;
        vm.tag = "fee";
        vm.expError = false;

        //查询结果显示的页数设置
        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.page = false;
        vm.num = [10, 20, 30, 40, 50];

        //搜索框设置
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            grade: true,
            school: true,
            department: true,
            isOwnFee: true,
            isPoor: true,
            term: true,
            regYear: true
        };

        vm.search = search;
        vm.uploadFee = uploadFee;
        vm.clickFile = clickFile;
        vm.exportError = exportError;

        $scope.$watch('xsFeeCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

        function search() {
            ecnuRegistrationDao.searchFee(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                          handleSearchResult);
        }

        function feePageChange() {
            ecnuRegistrationDao.searchFee(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                          handleSearchResult);
        }

        function handleSearchResult(response) {
            vm.page = true;
            vm.totalItems = response[QUERY_PARAMS.ITEMS_COUNT];
            vm.students = response[QUERY_PARAMS.ITEMS];
        }

        function uploadFee(file) {
            var proMessage = {"msg": "上传成功"};
            var progress_lock = false;
            ecnuRegistrationDao.upload(file, 'fee', function (resp) {
                vm.uploading = false;
                if (resp.data) {
                    vm.expError = true;
                    vm.type = "progress-bar progress-bar-success progress-bar-striped";
                    Prompt.successPrompt(proMessage);
                } else {
                    vm.type = "progress-bar progress-bar-danger progress-bar-striped";
                    proMessage = {"msg": "上传失败，请查看下载模板！"};
                    Prompt.dangerPrompt(proMessage);
                }
                progress_lock = true;
                vm.progress = 100;
            }, function () {
                vm.type = "progress-bar progress-bar-info progress-bar-striped";
                ecnuGlobalDao.getProgress(function (res) {
                    if (!progress_lock)
                        vm.progress = res;
                });
            });
        }

        function downloadDemo() {
            window.location.href = vm.downloadPath;
        }

        /* 导出错误信息 */
        function exportError() {
            if (vm.key != null)
                ecnuGlobalDao.exportErrors(vm.tag, function (res) {
                    FileExport.export(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
                                      "导出失败报到信息");
                });
        }

        function clickFile() {
            document.getElementById('hiddenFile').click();
        }
    }

})();
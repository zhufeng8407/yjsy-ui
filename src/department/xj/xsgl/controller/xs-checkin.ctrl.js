/**
 * @author LeeYanBin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsCheckinCtrl', XsCheckinCtrl);

    XsCheckinCtrl.$inject = ['$scope', 'PathUtils', 'ecnuGlobalDao', 'ecnuRegistrationDao', 'FileExport', 'Prompt'];
    function XsCheckinCtrl($scope, PathUtils, ecnuGlobalDao, ecnuRegistrationDao, FileExport, Prompt) {
        var vm = this;

        vm.downloadPath = PathUtils.qualifiedPath("/download/报到.xlsx");
        vm.uploading = false;
        vm.flag = false;
        vm.exportBtn = true;
        vm.tag = "checkin";
        vm.expError = false;

        vm.uploadRegister = uploadRegister;
        vm.clickFile = clickFile;
        vm.exportError = exportError;
        vm.downloadDemo = downloadDemo;

        $scope.$watch('xsCheckinCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

        function downloadDemo() {
            window.location.href = vm.downloadPath;
        }

        function uploadRegister(file) {
            var proMessage = {"msg": "上传成功"};
            if (!vm.uploading && !file.$error) {
                var progress_lock = false;
                vm.uploading = true;
                ecnuRegistrationDao.upload(file, 'checkin', function (resp) {
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
        }

        /* 导出错误信息 */
        function exportError() {
            if (vm.tag != null)
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
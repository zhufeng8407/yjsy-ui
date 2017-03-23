/**
 * @author LeeYanBin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsCheckinCtrl', XsCheckinCtrl);

    XsCheckinCtrl.$inject = ['$scope', '$uibModal', 'SERVICE_API_ROOT', 'PathUtils', 'ecnuGlobalDao', 'ecnuRegistrationDao', 'FileExport'];
    function XsCheckinCtrl($scope, $uibModal, SERVICE_API_ROOT, PathUtils, ecnuGlobalDao, ecnuRegistrationDao, FileExport) {
        var vm = this;
        var url = SERVICE_API_ROOT + "xj/registration/";
        var ROOT_PATH = PathUtils.getRootPath();

        vm.downloadPath = ROOT_PATH + "/download/报到.xlsx";
        vm.uploading = false;
        vm.flag = false;
        vm.exportBtn = true;
        vm.tag = "checkin";
        vm.expError = false;

        vm.uploadRegister = uploadRegister;
        vm.clickFile = clickFile;
        vm.exportError = exportError;
        vm.promptModal = promptModal;

        $scope.$watch('xsCheckinCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

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
                        promptModal(proMessage);
                    } else {
                        vm.type = "progress-bar progress-bar-danger progress-bar-striped";
                        proMessage = {"msg": "上传失败，请查看下载模板！"};
                        promptModal(proMessage);
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
            ecnuGlobalDao.exportErrors(vm.tag, function (res) {
                FileExport.export(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", "导出失败报到信息");
            });
        }

        function clickFile() {
            document.getElementById('hiddenFile').click();
        }

        function promptModal(proMessage) {
            $uibModal.open({
                animation: true,
                templateUrl: PathUtils.qualifiedPath("/common/directive/propmtMessage-panel.html"),
                controller: 'PromptMessageCtrl',
                controllerAs: 'promptMessageCtrl',
                windowClass: 'app-modal-window',
                resolve: {
                    proMessage: proMessage
                }
            });
        }
    }

})();
(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsDifficultyCtrl', XsDifficultyCtrl);

    XsDifficultyCtrl.$inject = ['$scope', '$timeout', 'SERVICE_API_ROOT', 'PathUtils', 'ecnuDiffDao', 'ecnuGlobalDao', 'FileExport'];
    function XsDifficultyCtrl($scope, $timeout, SERVICE_API_ROOT, PathUtils, ecnuDiffDao) {
        var vm = this;
        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.page = false;

        /* 用于选择每页想要显示的数目 */
        vm.num = [10, 20, 30, 40, 50];

        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            regYear: true,
            school: true,
            department: true,
            isPoor: true
        };
        var url = SERVICE_API_ROOT + "xj/difficulties";
        var ROOT_PATH = PathUtils.getRootPath();

        vm.downloadPath = ROOT_PATH + "/download/助困.xlsx";
        vm.uploading = false;
        vm.flag = false;
        vm.exportBtn = true;
        vm.tag = "difficultyError";
        vm.uploadFail = true;

        vm.uploadDiff = uploadDiff;
        vm.clickFile = clickFile;
        vm.exportError = exportError;
        vm.getYears = getYears;
        vm.conditionalSearch = conditionalSearch;//按条件查询
        vm.deleteItem = deleteItem;

        function deleteItem(id) {
            ecnuDiffDao.deleteDiff(id, function () {
                    conditionalSearch();
                }
            );
        }

        getYears();

        function getYears() {
            ecnuDiffDao.getYears(function (response) {
                vm.years = response;
            });
        }

        function conditionalSearch() {
            vm.page = true;
            ecnuDiffDao.conditionalSearch(vm.searchCondition, vm.currentPage - 1, vm.numPerPage,
                function (response) {
                    vm.totalItems = response.count;
                    vm.items = response.items;
                });
        }

        $scope.$watch('xsDiffCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

        function uploadDiff(file) {
            if (!vm.uploading && !file.$error) {
                vm.uploading = true;
                var progress_lock = false;
                ecnuDiffDao.upload(file, 'difficultyError', function (resp) {
                    vm.uploading = false;
                    progress_lock = true
                    vm.progress = 100;
                    if (resp.data != null && resp.data.fileFormat == false) {
                        vm.type = "progress-bar progress-bar-danger progress-bar-striped";
                        promptModal({"msg": "文件格式有误，请下载模板!"});
                    } else {
                        vm.type = "progress-bar progress-bar-success progress-bar-striped";
                        if (resp.data.errorcount > 0) {
                            vm.uploadFail = false;
                        }
                        promptModal({
                            "msg": "共上传条数" + resp.data.totalcount + "，其中成功上传" + (resp.data.totalcount - resp.data.errorcount) +
                            "条，上传失败" + resp.data.errorcount + "条。"
                        });
                    }
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
            ecnuGlobalDao.exportErrors(vm.key, function (res) {
                FileExport.export(res, "application/octet-stream", "导出失败助困名单信息");
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
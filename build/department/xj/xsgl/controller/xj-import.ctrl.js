/**
 * @author xiafan
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsImportCtrl', XsImportCtrl);

    XsImportCtrl.$inject = ['$scope', 'ecnuStudentDao',"SERVICE_API_ROOT","Upload"];
    function XsImportCtrl($scope, ecnuStudentDao,SERVICE_API_ROOT,Upload) {
        var vm = this;

        var url = SERVICE_API_ROOT + "xj/students";

        vm.uploading = false;
        vm.flag = false;
        vm.tag = "batchLoadError";
        vm.uploadFail = true;
        vm.upload = upload;
        vm.ok = ok;
        vm.clickFile = clickFile;
        vm.exportError = exportError;

        $scope.$watch('xsImportCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

        function ok() {
            vm.upload(vm.file);
        }

        function upload(file) {
            if (!vm.uploading && !file.$error) {
                vm.uploading = true;
                Upload.upload(
                    {
                        url: url,
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        data: {
                            file: file,
                            type: vm.tag,
                        },
                        method: 'post'
                    })
                    .then(
                        function (resp) {
                            vm.uploading = false;
                            if (resp.data != null && resp.data.fileFormat == false) {
                                alert("文件格式有误，请下载模板");
                            } else {
                                if(resp.data.errorcount > 0){
                                    vm.uploadFail = false;
                                }
                                alert("共上传条数" + resp.data.totalcount + "，其中成功上传" + (resp.data.totalcount - resp.data.errorcount) +
                                    "条，上传失败" + resp.data.errorcount + "条");
                                $timeout(function () {
                                    vm.log = 'file: ' + resp.config.data.file.name
                                        + ', Response: ' + JSON.stringify(resp.data)
                                        + '\n' + $scope.log;
                                });
                            }
                        },
                        null,
                        function (evt) {
                            vm.progress = parseInt(100.0
                                * evt.loaded / evt.total);

                        });
            }
        }



        function clickFile() {
            document.getElementById('hiddenFile').click();
        }

        /* 导出错误信息 */
        function exportError() {
            ecnuStudentDao.exportError(vm.tag,function (response) {
                var blob = new Blob([response], {type: "application/octet-stream"});
                saveAs(blob, "导出失败招生名单.xlsx");
            });
        }
    }
})();
/**
 * Created by sc on 2017/2/21.
 */
(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('DsImportCtrl', DsImportCtrl);

    DsImportCtrl.$inject = ['$scope', 'Upload', '$timeout', 'SERVICE_API_ROOT', 'PathUtils', 'ecnuStaffDao'];
    function DsImportCtrl($scope, Upload, $timeout, SERVICE_API_ROOT, PathUtils, ecnuStaffDao) {
        var vm = this;
        var url = SERVICE_API_ROOT + "xj/dsImport/";
        var ROOT_PATH = PathUtils.getRootPath();

        vm.downloadPath = ROOT_PATH + "/download/导师.xlsx";
        vm.uploading = false;
        vm.flag = false;
        vm.exportBtn = false;
        vm.tag = "staffError";

        vm.uploadDs = uploadDs;
        vm.selectFile = selectFile;
        vm.exportError = exportError;

        $scope.$watch('dsImportCtrl.file', function () {
            if (vm.file != null) {
                vm.flag = true;
            }
        });

        function uploadDs(file) {
            if (!vm.uploading && !file.$error) {
                vm.uploading = true;
                Upload.upload(
                    {
                        url: url + "upload",
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        data: {
                            file: file,
                            type: "staffError"
                        },
                        method: 'post'
                    })
                    .then(
                        function (resp) {
                            vm.uploading = false;
                            if (resp.data.state == 0) {
                                alert("上传失败，请查看下载模板！");
                            } else if (resp.data.state == 1) {
                                var mes = "总共 " + resp.data.totalcount + " 条数据，成功导入 " +
                                    (resp.data.totalcount - resp.data.errorcount) + " 条数据，失败" +
                                    resp.data.errorcount + "条数据";
                                alert(mes);
                                if (resp.data.errorcount != 0) {
                                    vm.exportBtn = true;
                                }
                            }
                            $timeout(function () {
                                vm.log = 'file: ' + resp.config.data.file.name
                                    + ', Response: ' + JSON.stringify(resp.data)
                                    + '\n' + $scope.log;
                            });
                        },
                        null,
                        function (evt) {
                            vm.progress = parseInt(100.0
                                * evt.loaded / evt.total);

                        });
            }
        }

        /* 导出错误信息 */
        function exportError() {
            ecnuStaffDao.exportError(vm.tag, function (response) {
                var blob = new Blob([response], {type: "application/octet-stream"});
                saveAs(blob, "导出失败信息.xlsx");
            });
        }

        function selectFile() {
            document.getElementById('dsFile').click();
        }
    }
})();
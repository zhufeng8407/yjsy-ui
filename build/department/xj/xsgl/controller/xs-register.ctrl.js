/**
 * @author LeeYanBin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsRegisterCtrl', XsRegisterCtrl);

    XsRegisterCtrl.$inject = ['$scope', 'Upload', '$timeout', 'SERVICE_API_ROOT'];
    function XsRegisterCtrl($scope, Upload, $timeout, SERVICE_API_ROOT) {
        var vm = this;
        var BASE_URL = "xj/registration/";

        vm.uploading = false;
        vm.flag = false;

        vm.upload = upload;
        vm.ok = ok;

        $scope.$watch('xsRegisterCtrl.file', function () {
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
                        url: SERVICE_API_ROOT + BASE_URL+"register-upload",
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        data: {
                            file: vm.file
                        },
                        method: 'post'
                    })
                    .then(
                        function (resp) {
                            vm.uploading = false;
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
    }
})();
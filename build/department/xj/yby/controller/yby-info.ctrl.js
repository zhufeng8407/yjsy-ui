(function () {
    'use strict';
    var ecnuYby = angular.module('ecnuXueJi');
    ecnuYby.controller('YbyInfoCtrl', ['ecnuYbyDao', 'ecnuMetaDataDao', YbyInfoCtrl]);
    function YbyInfoCtrl(ecnuYbyDao, ecnuMetaDataDao) {
        var vm = this;

        vm.condition = new Array();
        vm.flag = new Array();

        vm.getConfigFields = getConfigFields; //获取可配置字段
        vm.getConfigInfo = getConfigInfo;
        vm.submit = submit;
        vm.itialize = itialize;


        getConfigInfo();

        function itialize(day) {
            ecnuYbyDao.itialize(day, function (response) {
                alert("初始化成功");
            })
        }

        function submit() {
            for (var i = 0; i < vm.flag.length; i++) {
                if (vm.flag[i] == true) {
                    ecnuYbyDao.submitConfig(vm.info[i], function (response) {
                        getConfigInfo();
                    });
                }
            }

            alert("配置修改成功");

        }

        function getConfigFields() {
            ecnuMetaDataDao.getMetadataAPIMapping(function (response) {
                vm.info = response;
            });
        }

        function getConfigInfo() {
            ecnuYbyDao.getConfigInfo(function (response) {
                vm.info = response.info;
            })
        }


    }
})();
/**
 * Created by Ray on 2016/8/23.
 */

(function () {
    'use strict';
    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.controller('YdlxController', ['ecnuStatusChangeTypeDao', YdlxController]);
    function YdlxController(statusChangeTypeDao) {
        var vm = this;

        vm.res = null;
        vm.majors = null;
        vm.statusChangeType = {};
        vm.statusChangeType.major = null;
        vm.statusChangeType.minor = null;
        vm.isCollapsed = true;
        vm.status = null;            //记录从后台传过来的保存结果
        vm.successStatus = null;     //记录保存成功
        vm.warningStatus = null;     //记录保存失败的原因

        vm.typecombine = typecombine;
        vm.save = save;

        function typecombine() {
            statusChangeTypeDao.typeCombine(function (response) {
                vm.res = response;
                for (var i = 0; i < vm.res.length; i++) {
                    for (var j = 0; j < vm.res[i].count; j++) {
                        if (vm.res[i].statusChangeTypes[j].visible == true)
                            vm.res[i].statusChangeTypes[j].visible = "是";
                        else if (vm.res[i].statusChangeTypes[j].visible == false)
                            vm.res[i].statusChangeTypes[j].visible = "否";
                        if (vm.res[i].statusChangeTypes[j].attachment == true)
                            vm.res[i].statusChangeTypes[j].attachment = "是";
                        else if (vm.res[i].statusChangeTypes[j].attachment == false)
                            vm.res[i].statusChangeTypes[j].attachment = "否";
                        if (vm.res[i].statusChangeTypes[j].quit == true)
                            vm.res[i].statusChangeTypes[j].quit = "是";
                        else if (vm.res[i].statusChangeTypes[j].quit == false)
                            vm.res[i].statusChangeTypes[j].quit = "否";
                        if (vm.res[i].statusChangeTypes[j].terminated == true)
                            vm.res[i].statusChangeTypes[j].terminated = "是";
                        else if (vm.res[i].statusChangeTypes[j].terminated == false)
                            vm.res[i].statusChangeTypes[j].terminated = "否";

                        if (vm.res[i].statusChangeTypes[j].restrict == "null")
                            vm.res[i].statusChangeTypes[j].restrict = null;
                        if (vm.res[i].statusChangeTypes[j].status == "null")
                            vm.res[i].statusChangeTypes[j].status = null;
                        if (vm.res[i].statusChangeTypes[j].memo == "null")
                            vm.res[i].statusChangeTypes[j].memo = null;


                    }
                }
            });
        }


        statusChangeTypeDao.major(function (response) {
            vm.majors = response;
            vm.statusChangeType.major = vm.majors[0];
        });

        function save() {
            //若大类或小类为空，则提示输入不合法
            if (vm.statusChangeType.minor == 'null' || vm.statusChangeType.minor == null || vm.statusChangeType.minor == '') {
                vm.warningStatus = '请输入异动小类';
            } else if (vm.statusChangeType.major == 'null' || vm.statusChangeType.major == null || vm.statusChangeType.major == '') {
                vm.warningStatus = '请输入异动大类';
            } else {
                statusChangeTypeDao.save(vm.statusChangeType, function (response) {
                        vm.status = response.status;
                        if (vm.status == '保存成功') {
                            vm.isCollapsed = true;
                            vm.successStatus = '保存成功';
                            vm.statusChangeType.minor = null;
                            vm.warningStatus = null;
                            statusChangeTypeDao.typeCombine(function (response) {
                                vm.typecombine();
                            });
                        } else {
                            vm.warningStatus = vm.status;
                        }
                    }
                );
            }
        }
    }
})();
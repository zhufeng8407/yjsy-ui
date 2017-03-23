/**
 * Created by guhang on 2017/2/11.
 */
(function () {
    'use strict';
    var ecnuAdminHome = angular.module('ecnuAdminHome');
    ecnuAdminHome.controller("ManageNotificationCtrl", ['$uibModal', 'ecnuNotificationDao', 'ecnuMessageDao', ManageNotificationCtrl]);

    function ManageNotificationCtrl($uibModal, ecnuNotificationDao, ecnuMessageDao) {
        var vm = this;
        var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur'];

        vm.currentPage = 1;
        vm.numPerPage = 15;
        vm.maxSize = 7;

        vm.showMessagePanel = showMessagePanel;
        vm.showReceiverPanel = showReceiverPanel;
        vm.deleteMessage = deleteMessage;
        vm.pageChanged = pageChanged;

        init();

        function init() {
            ecnuMessageDao.getMessageByMe(vm.currentPage - 1, vm.numPerPage, function (res) {
                vm.messages = [];
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].startsAt = moment(res.data[i].startsAt, "YYYY-MM-DDTHH:mm")._d;
                    res.data[i].endsAt = moment(res.data[i].endsAt, "YYYY-MM-DDTHH:mm")._d;
                    vm.messages.push(res.data[i]);
                }
                vm.totalItems = res.totalItems;
            });
        }

        function showMessagePanel(message) {
            $uibModal.open({
                animation: true,
                templateUrl: 'showEvent.html',
                controller: 'ShowEventCtrl',
                controllerAs: 'showEventCtrl',
                resolve: {
                    message: message,
                    scope: this
                }
            });
        }

        function showReceiverPanel() {

        }

        function deleteMessage(id) {
            ecnuMessageDao.deleteMessage(id, vm.currentPage - 1, vm.numPerPage, function (res) {
                vm.messages = res.data;
                vm.totalItems = res.totalItems;
            })
        }

        function pageChanged() {
            ecnuMessageDao.getMessageByMe(vm.currentPage - 1, vm.numPerPage, function (res) {
                vm.messages = res.data;
                vm.totalItems = res.totalItems;
            })
        }
    }

    ecnuAdminHome.controller("ShowEventCtrl", ['$compile', '$uibModalInstance', 'message','scope', 'ecnuMessageDao', ShowEventCtrl]);
    function ShowEventCtrl($compile, $uibModalInstance, message,scope, ecnuMessageDao) {
        var vm = this;

        vm.save = save;
        vm.close = close;

        vm.trixInitialize = function (e, editor) {
            ecnuMessageDao.getMessageDetails(message.id, function (res) {
                vm.event = angular.copy(message);
                if (res.data.link != null) vm.event.link = res.data.link;
                vm.event.content = res.data.content;
            });
        }

        function save() {
            ecnuMessageDao.updateMessage(vm.event, function (res) {
                message.title = vm.event.title;
                message.link = vm.event.link;
                message.endsAt = vm.event.endsAt;
                message.startsAt = vm.event.startsAt;
                message.content = vm.event.content;
                close();
            })
        }

        function close() {
            $uibModalInstance.dismiss();
        }
    }

    ecnuAdminHome.filter("parseHTML", function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    })

    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
})();
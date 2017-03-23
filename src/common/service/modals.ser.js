/**
 * 在需要使用的页面上通过ng-include引入modals.html文件
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("SimpleModal", ["$uibModal", "$templateCache", SimpleModal]);
    function SimpleModal($uibModal, $templateCache) {
        var vm = this;

        vm.open = open;

        initModalTemplates();

        function open(msg, ok, cancel) {
            var modalInstance = $uibModal.open({
                                                   animation: true,
                                                   templateUrl: "simpleModal.html",
                                                   controller: [
                                                       '$uibModalInstance', 'message', SimpleModalCtrl
                                                   ],
                                                   controllerAs: 'simpleModalCtrl',
                                                   resolve: {
                                                       message: function () {
                                                           return msg;
                                                       }
                                                   }
                                               });
            modalInstance.result.then(function (result) {
                ok();
            }, function (result) {
                cancel();
            });
        }

        function initModalTemplates() {
            //确认模太框
            var simpleModal = '<div class="modal-header">'
                              +
                              '<button type="button" class="close" ng-click="simpleModalCtrl.close()" aria-label="Close">'
                              + '<span aria-hidden="true">&times;</span>'
                              + '</button>'
                              + '<h4 class="modal-title">{{simpleModalCtrl.message}}</h4>'
                              + '</div>'
                              + '<div class="modal-footer">'
                              +
                              '<button type="button" class="btn btn-default" ng-click="simpleModalCtrl.ok()">确认</button>'
                              +
                              '<button type="button" class="btn btn-primary" ng-click="simpleModalCtrl.close()">取消</button>'
                              + '</div>';
            $templateCache.put("simpleModal.html", simpleModal);

            //错误框
            var errorModal = '<div class="modal-header">'
                             +
                             '<button type="button" class="close" ng-click="simpleModalCtrl.close()"     aria-label="Close">'
                             + '<span aria-hidden="true">&times;</span>'
                             + '</button>'
                             + '<h4 class="modal-title">{{errorModalCtrl.title}}</h4>'
                             + '</div>'
                             + '<div class="modal-body">{{errorModalCtrl.message}}</div>';
            $templateCache.put("errorModal.html", errorModal);
        }

        function SimpleModalCtrl($uibModalInstance, message) {
            var vm = this;

            vm.ok = ok;
            vm.close = close;
            vm.message = message;

            function ok() {
                $uibModalInstance.close();
            }

            function close() {
                $uibModalInstance.dismiss();
            }
        }

    }
})();


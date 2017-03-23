/**
 * Created by guhang on 2017/3/3.
 */
(function () {
    "use strict";

    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.controller('PromptMessageCtrl',
        [
            '$uibModalInstance',
            'proMessage',
            PromptMessageCtrl
        ]);
    function PromptMessageCtrl($uibModalInstance, proMessage) {
        var vm = this;

        vm.cancel = cancel;
        vm.proMessage = proMessage.msg;
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();

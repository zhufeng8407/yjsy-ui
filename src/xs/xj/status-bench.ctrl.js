/**
 * Created by xiafan on 16-11-25.
 */
(function () {
    var app = angular.module('stuhome');

    app.controller('StatusBenchCtrl', [
        '$uibModal',
        'ecnuStudentDao',
        'PageState',
        'PathUtils',
        'ecnuStatusChangeDao',
        StatusBenchCtrl
    ]);
    function StatusBenchCtrl($uibModal, ecnuStudentDao, PageState, PathUtils, ecnuStatusChangeDao) {
        var vm = this;

        vm.applying = false;
        vm.browsering = false;
        vm.sno = PageState.getUser().getUserID();
        vm.applySuccess = applySuccess;
        vm.applyCancel = applyCancel;
        vm.refreshStatusApply = refreshStatusApply;
        vm.display = display;
        vm.applyConfig = {"student": {}, "onSuccess": vm.applySuccess, "onCancel": vm.applyCancel};

        ecnuStudentDao.getBriefInfo(vm.sno, function (res) {
            vm.applyConfig.student = res;
            vm.applyConfig.student.photo = PathUtils.qualifiedStaticPath(vm.applyConfig.student.photo);
        });
        refreshStatusApply();

        function applySuccess() {
            var statusModal = $uibModal.open({
                                                 animation: vm.animationsEnabled,
                                                 backdrop: 'static',
                                                 ariaLabelledBy: 'status-modal-title',
                                                 ariaDescribedBy: 'status-modal-body',
                                                 templateUrl: 'status.html',
                                                 controller: 'StatusModalCtrl',
                                                 controllerAs: 'statusModalCtrl',
                                                 resolve: {
                                                     status: function () {
                                                         return "申请成功";
                                                     },
                                                     successCallback: function () {
                                                         return vm.refreshStatusApply;
                                                     }
                                                 }
                                             });
            vm.applying = false;
        }

        function applyCancel() {
            vm.applying = false;
        }

        function refreshStatusApply() {
            ecnuStatusChangeDao.getRequestBySno(PageState.getUser().getUserID(), function (statusRequests) {
                vm.statusRequests = statusRequests;
            });
        }

        function display(statusReqID) {
            ecnuStatusChangeDao.getAuditByRequestID(statusReqID, function (response) {
                vm.auditRecords = response;
                vm.browsering = true;
            });
        }
    }

    app.controller('StatusModalCtrl',
                   ['$uibModalInstance', 'status', 'successCallback', StatusModalCtrl]);
    function StatusModalCtrl($uibModalInstance, status, successCallback) {

        var vm = this;

        vm.status = status;

        vm.ok = ok;

        function ok() {
            $uibModalInstance.close();
            successCallback();
        }

    }
})();

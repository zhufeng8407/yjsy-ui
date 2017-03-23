/**
 * Created by Ray on 2016/7/20.
 */
(function () {
    'use strict';

    var ecnuXueJi = angular.module('ecnuXueJi');

    ecnuXueJi.controller('YdspCtrl', [
        'ecnuStatusChangeDao',
        '$uibModal',
        YdspCtrl
    ]);
    function YdspCtrl(ecnuStatusChangeDao, $uibModal) {
        var vm = this;

        vm.tableDisplay = "none";
        vm.animationsEnabled = true;
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            school: true,
            department: true,
            grade: true
        };

        vm.dateFrom = new Date();
        vm.dateEnd = new Date();
        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;
        vm.num = [10, 20, 30, 40, 50];
        vm.page = false;

        vm.searchStatusChange = searchStatusChange;
        vm.audit = audit;

        vm.openStatus = openStatus;

        function searchStatusChange() {
            vm.page = true;
            vm.updateDate();
            ecnuStatusChangeDao.searchStatusChange(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                                   function (response) {
                                                       vm.totalItems = response.count;
                                                       vm.items = response.items;
                                                       vm.tableDisplay = "block";
                                                   });
        }

        vm.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        vm.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        vm.toggleMin = function () {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
            vm.dateOptions.minDate = vm.inlineOptions.minDate;
        };

        vm.toggleMin();

        vm.open1 = function () {
            vm.popup1.opened = true;
        };

        vm.open2 = function () {
            vm.popup2.opened = true;
        };

        vm.updateDate = function () {
            if (vm.dateFrom) {
                vm.searchCondition.dateFrom = (1900 + vm.dateFrom.getYear()) + "-" + (vm.dateFrom.getMonth() + 1) +
                                              "-" +
                                              vm.dateFrom.getDate();
            }
            if (vm.dateEnd) {
                var oldValue = vm.searchCondition.dateEnd;
                vm.searchCondition.dateEnd = (1900 + vm.dateEnd.getYear()) + "-" + (vm.dateEnd.getMonth() + 1
                    ) + "-" + vm.dateEnd.getDate();
            }
        };


        vm.format = 'yyyy/MM/dd';
        vm.altInputFormats = ['M!/d!/yyyy'];

        vm.popup1 = {
            opened: false
        };

        vm.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        var afterTomorrow = tomorrow + 1;
        vm.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < vm.events.length; i++) {
                    var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return vm.events[i].status;
                    }
                }
            }

            return '';
        }

        function audit(auditRecord, auditRecords,size) {
            var modalInstance = $uibModal.open({
                                                   animation: vm.animationsEnabled,
                                                   backdrop: 'static',
                                                   templateUrl: 'myModalContent.html',
                                                   controller: 'YdspModalCtrl',
                                                   controllerAs: 'ydspModalCtrl',
                                                   size: size,
                                                   resolve: {
                                                       auditRecord: function () {
                                                           return auditRecord;
                                                       }
                                                   }
                                               });
		
		
            modalInstance.result.then(function (auditRecord) {
                ecnuStatusChangeDao.acceptStatusChange(auditRecord, function (response) {
                    vm.selectedPage = vm.selPage;
                    vm.searchStatusChange();
                    vm.openStatus('已经通过');
                });
            }, function (auditRecord) {
                if (auditRecord != 'cancel') {
                    ecnuStatusChangeDao.rejectStatusChange(auditRecord, function (response) {
                        vm.selectedPage = vm.selPage;
                        vm.searchStatusChange();
                        vm.openStatus('已经否决');
                    });
                }

            });
        }

        function openStatus(status) {
            var statusModal = $uibModal.open({
                                                 animation: vm.animationsEnabled,
                                                 backdrop: 'static',
                                                 ariaLabelledBy: 'status-modal-title',
                                                 ariaDescribedBy: 'status-modal-body',
                                                 templateUrl: 'status.html',
                                                 controller: 'statusModalCtrl',
                                                 controllerAs: 'statusModalCtrl',
                                                 resolve: {
                                                     status: function () {
                                                         return status;
                                                     }
                                                 }
                                             });
            statusModal.result.then(function () {
            }, function () {
            });
        }

    }

    ecnuXueJi.controller('YdspModalCtrl', ['ecnuStatusChangeDao','$uibModalInstance', 'auditRecord', YdspModalCtrl]);
    function YdspModalCtrl(ecnuStatusChangeDao,$uibModalInstance, auditRecord) {

        var vm = this;

        vm.auditRecord = auditRecord;

	

	ecnuStatusChangeDao.searchStatusChangeAudits(auditRecord, function (response) {

	            vm.auditRecords= response;
                }
	);
		
	

        vm.accept = accept;
        vm.reject = reject;
        vm.cancel = cancel;
        vm.events = [
            {
                badgeClass: 'info',
                badgeIconClass: 'glyphicon-check',
                title: 'First heading',
                content: 'Some awesome content.'
            }, {
                badgeClass: 'warning',
                badgeIconClass: 'glyphicon-credit-card',
                title: 'Second heading',
                content: 'More awesome content.'
            }
        ];

        function accept() {
            $uibModalInstance.close(vm.auditRecord);
        }

        function reject() {
            $uibModalInstance.dismiss(vm.auditRecord);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();

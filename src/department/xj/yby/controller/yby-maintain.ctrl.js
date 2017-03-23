(function () {
    'use strict';
    var ecnuYby = angular.module('ecnuXueJi');
    ecnuYby.controller('YbyMaintainCtrl', ['ecnuYbyDao', 'ecnuMetaDataDao', 'QUERY_PARAMS', YbyMaintainCtrl]);
    function YbyMaintainCtrl(ecnuYbyDao, ecnuMetaDataDao, QUERY_PARAMS) {
        var vm = this;
        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;

        vm.page = false;
        vm.num = [10, 20, 30, 40, 50];

        vm.searchConfig = {
            name: true,
            sno: true,
            school: true,
            department: true
        };

        vm.dt = new Date();
        vm.format = 'yyyy/MM/dd';
        vm.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };
        vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(1900, 9, 1),
            startingDay: 1
        };
        vm.searchCondition = {};
        vm.pregraduationStatus = ["空", "可修改", "通过"];
        vm.searchCondition.pregraduationStatus = "所有";

        vm.getDayClass = getDayClass;
        vm.conditionalSearch = conditionalSearch;
        vm.applyReturn = applyReturn;

        function applyReturn(sno,conditions) {
            ecnuYbyDao.applyReturn(sno, function (response) {
                vm.data = response;
                conditionalSearch(conditions);
                alert("退回成功！")
            })
        }

        function conditionalSearch(conditions) {
            vm.page = true;
            ecnuYbyDao.conditionalSearch(conditions, vm.currentPage - 1, vm.numPerPage, function (response) {
                vm.totalItems = response.count;
                vm.items = response.items;
            });
        }


        function getDayClass(data) {
            var date = data.date;
            var mode = data.mode;

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


    }
})();
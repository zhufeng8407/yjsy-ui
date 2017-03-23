/**
 * Created by guhang on 2016/8/21.
 */
(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');

    ecnuXjHome.controller('XsExamCtrl', ['$uibModal', 'ecnuExamDao', 'FileExport', XsExamCtrl]);
    function XsExamCtrl($uibModal, ecnuExamDao, FileExport) {

        var vm = this;
        vm.currentPage = 1;
        vm.numPerPage = 15;
        vm.maxSize = 5;

        vm.pageChanged = pageChanged;
        vm.checkAll = checkAll;
        vm.deleteItem = deleteItem;
        vm.deleteItems = deleteItems;
        vm.exportExam = exportExam;
        vm.examModal = examModal;
        vm.uploadModal = uploadModal;
        vm.chartModal = chartModal;

        //load data of current page
        pageChanged();

        function pageChanged() {
            ecnuExamDao.getExamByPage(vm.currentPage - 1, vm.numPerPage,
                function (response) {
                    vm.totalItems = response.totalElements;
                    vm.items = response.content;
                });
        }

        function checkAll() {
            angular.forEach(vm.items, function (item) {
                item.$checked = vm.allChecked;
            });
        }

        function examModal(index) {
            if (index != -1)
                $uibModal.open({
                    animation: true,
                    templateUrl: 'examHandler.html',
                    controller: 'ExamModifyCtrl',
                    controllerAs: 'examCtrl',
                    resolve: {
                        theindex: index,
                        items: function () {
                            return vm.items;
                        }
                    }
                });
            else
                $uibModal.open({
                    animation: true,
                    templateUrl: 'examHandler.html',
                    controller: 'ExamAddCtrl',
                    controllerAs: 'examCtrl',
                    resolve: {
                        sc: vm
                    }
                });
        }

        function deleteItem(id) {
            ecnuExamDao.deleteExam(id, vm.currentPage - 1, vm.numPerPage,
                function (response) {
                    vm.totalItems = response.totalElements;
                    vm.items = response.content;
                }
            );
        }

        function deleteItems() {
            var checkedList = new Array();
            angular.forEach(vm.items, function (item) {
                if (item.$checked == true)
                    checkedList.push(item.id);
            });
            ecnuExamDao.deleteExams(checkedList, vm.currentPage - 1, vm.numPerPage,
                function (response) {
                    vm.totalItems = response.totalElements;
                    vm.items = response.content;
                    vm.allChecked = false;
                }
            );
        }

        function exportExam() {
            ecnuExamDao.exportExam(['题目', 'A', 'B', 'C', 'D', '答案', '答题数', '正确数', '正确率', '错误原因'],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [],
                function (res) {
                    FileExport.export(res,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
                        "考题信息.xlsx");
                });
        }

        function uploadModal() {
            $uibModal.open({
                animation: true,
                templateUrl: 'uploadFile.html',
                controller: 'ExamsUploadCtrl',
                controllerAs: 'examsUploadCtrl',
                resolve: {
                    sc: vm
                }
            });
        }

        function chartModal() {
            $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'examCharts.html',
                controller: 'ExamsChartsCtrl',
                controllerAs: 'examsChartsCtrl',
                resolve: {
                    sc: vm
                }
            });
        }
    }

    ecnuXjHome.controller('ExamModifyCtrl',
        ['$uibModalInstance', 'theindex', 'items', 'ecnuExamDao', ExamModifyCtrl]);
    function ExamModifyCtrl($uibModalInstance, theIndex, items, ecnuExamDao) {
        var vm = this;

        vm.theItem = angular.copy(items[theIndex]);

        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            ecnuExamDao.updateExam(vm.theItem, function (res) {
                items[theIndex] = angular.copy(vm.theItem);
            });
            $uibModalInstance.dismiss('cancel');
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    ecnuXjHome.controller('ExamAddCtrl', ['$uibModalInstance', 'sc', 'ecnuExamDao', ExamAddCtrl]);
    function ExamAddCtrl($uibModalInstance, sc, ecnuExamDao) {
        var vm = this;

        vm.theItem = new Object();
        vm.theItem.answer = 'A';
        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            ecnuExamDao.addExam(vm.theItem, sc.currentPage - 1, sc.numPerPage, function (res) {
                sc.totalItems = res.totalElements;
                sc.items = res.content;
            });
            $uibModalInstance.dismiss('cancel');
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    ecnuXjHome.controller('ExamsUploadCtrl',
        [
            '$uibModalInstance',
            'sc',
            'ecnuExamDao',
            'FileExport', 'ecnuGlobalDao',
            ExamsUploadCtrl
        ]);
    function ExamsUploadCtrl($uibModalInstance, sc, ecnuExamDao, FileExport,ecnuGlobalDao) {
        var vm = this;

        vm.uploadBtn = true;
        vm.exportBtn = false;
        vm.uploadExam = uploadExam;
        vm.cancel = cancel;
        vm.exportError = exportError;

        function uploadExam(file) {
            var progress_lock = false;
            ecnuExamDao.uploadExam(file, function (response) {
                if (response.data.exams != null) {
                    sc.totalItems = response.data.exams.totalElements;
                    sc.items = response.data.exams.content;
                }
                vm.isDisabled = true;
                vm.Msg = "考题导入成功！";
                progress_lock = true;
                vm.progress = 100;
                if (response.data.state == 0) {
                    vm.isDisabled = true;
                    vm.type = "progress-bar progress-bar-danger progress-bar-striped";
                    vm.Msg = "导入文件格式有误，无法解析该文件，正确的文件格式为.xls或.xlsx，请确保文件格式正确！";
                }
                else {
                    vm.key = response.data.key;
                    vm.type = "progress-bar progress-bar-success progress-bar-striped";
                    if (response.data.state == 1) {
                        vm.isDisabled = false;
                        vm.Msg = "总共 " + response.data.total + " 条数据，成功导入 " +
                            (response.data.total - response.data.error) + " 条数据，失败" +
                            response.data.error + "条数据";
                    }
                }

                vm.isShowMsg = true;
                vm.uploadBtn = false;
                if (response.data.error != null && response.data.error != 0)
                    vm.exportBtn = true;
                else
                    vm.exportBtn = false;

            }, function () {
                vm.type = "progress-bar progress-bar-info progress-bar-striped";
                ecnuGlobalDao.getProgress(function (res) {
                    if (!progress_lock)
                        vm.progress = res;
                });
            });
        }

        function exportError() {
            ecnuGlobalDao.exportErrors(vm.key, function (res) {
                FileExport.export(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", "导入失败考题信息");
            });
            cancel();
        }

        function cancel() {
            $uibModalInstance.dismiss();
            ecnuGlobalDao.clearErrors(vm.key,function () {
            });
        }
    }

    ecnuXjHome.controller('ExamsChartsCtrl', ['$uibModalInstance', 'ecnuExamDao', ExamsChartsCtrl]);
    function ExamsChartsCtrl($uibModalInstance, ecnuExamDao) {
        var vm = this;

        vm.cancel = cancel;
        ecnuExamDao.getStatsAccuracy(displayAccuracy);

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function displayAccuracy(res) {
            vm.test = res.test;
            vm.themes = ['default'];
            vm.lineConfig = {
                theme: 'vintage',
                dataLoaded: true
            };

            vm.lineOption = {
                title: {
                    text: res.title
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        console.log(vm.test[params[0].dataIndex]);
                        return '题目：' + vm.test[params[0].dataIndex] + '<br>正确率：'
                            + params[0].data + '%';

                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        //magicType: {show: true, type: ['line', 'bar']},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: res.xAxis.data
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: res.yAxis.name,
                        min: res.yAxis.min,
                        max: res.yAxis.max,
                        interval: res.yAxis.interval,
                        axisLabel: {
                            formatter: res.yAxis.formatter
                        }
                    }
                ],
                dataZoom: [
                    {
                        show: true,
                        start: 0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    },
                    {
                        show: true,
                        yAxisIndex: 0,
                        filterMode: 'filter',
                        width: 30,
                        height: '80%',
                        showDataShadow: true,
                        left: '93%'
                    }
                ],
                series: [
                    {
                        name: res.series.name,
                        type: 'bar',
                        data: res.series.data,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };
        }
    }
})();

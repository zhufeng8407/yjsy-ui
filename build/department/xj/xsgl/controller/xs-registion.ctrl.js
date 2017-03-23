/**
 * @author liyanbin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuXueJi');
    ecnuXjHome.controller('XsRegistrationCtrl',
                          [
                              '$scope',
                              '$uibModal',
                              'ecnuRegistrationDao',
                              'SimpleModal',
                              'QUERY_PARAMS',
                              XsRegistrationCtrl
                          ]);

    function XsRegistrationCtrl($scope, $uibModal, ecnuRegistrationDao, SimpleModal, QUERY_PARAMS) {
        var vm = this;
        var i = 0;

        vm.currentPage = 1;
        vm.numPerPage = 10;
        vm.maxSize = 5;

        /* 用于选择每页想要显示的数目 */
        vm.num = [10, 20, 30, 40, 50];

        vm.page = false;

        vm.registButton = new Array([30]);

        vm.isFee = "null";
        vm.isCheckin = "null";
        vm.isPoor = "null";
        vm.isDelay = "null";
        vm.searchCondition = {};
        vm.searchConfig = {
            name: true,
            sno: true,
            grade: true,
            school: true,
            department: true,
            isCheckin: true,
            isFee: true,
            isPoor: true,
            isNew: true,
            term: true,
            regYear: true
        };
        vm.batchButton = false;

        vm.search = search;
        vm.register = register;
        vm.reset = reset;
        vm.exportRegistrationList = exportRegistrationList;
        vm.batchRegister = batchRegister;
        vm.checkAll = checkAll;
        vm.registrationPageChange = registrationPageChange;
        vm.loadCharts = loadCharts;
        vm.checkboxChange = checkboxChange;
        vm.promptModal = promptModal;

        function loadCharts() {
            ecnuRegistrationDao.registrationStats(vm.searchCondition,
                                                  showChart);
        }

        function search() {
            ecnuRegistrationDao.searchStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                               handleSearchResult);

            ecnuRegistrationDao.registrationStats(vm.searchCondition,
                                                  showChart);
        }


        function registrationPageChange() {
            ecnuRegistrationDao.searchStudents(vm.currentPage - 1, vm.numPerPage, vm.searchCondition,
                                               handleSearchResult);
        }

        function handleSearchResult(response) {
            vm.page = true;
            vm.totalItems = response[QUERY_PARAMS.ITEMS_COUNT];
            vm.students = response[QUERY_PARAMS.ITEMS];
            if (vm.searchCondition.term == 2) {
                for (i = 0; i < vm.students.length; i++) {
                    vm.registButton[i] = false;//第二学期只能查看不能注册，注册和缴费只针对第一学期
                }
            } else {
                for (i = 0; i < vm.students.length; i++) {
                    vm.registButton[i] = (vm.students[i].register == "否");
                }
            }
        }

        function showChart(response) {
            vm.registrationBarConfig = {
                theme: 'vintage',
                dataLoaded: true
            };

            vm.feeBarConfig = {
                theme: 'vintage',
                dataLoaded: true
            };

            vm.checkinBarConfig = {
                theme: 'vintage',
                dataLoaded: true
            };

            vm.registrationBarOption = {
                title: {
                    text: '注册统计图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['已注册', '未注册']
                },
                series: [
                    {
                        name: '数据来源',
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '60%'],
                        data: [
                            {value: response.data[0].value, name: response.data[0].name},
                            {value: response.data[1].value, name: response.data[1].name}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            vm.feeBarOption = {
                title: {
                    text: '缴费统计图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['已缴费', '未缴费']
                },
                series: [
                    {
                        name: '数据来源',
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '60%'],
                        data: [
                            {value: response.data[2].value, name: response.data[2].name},
                            {value: response.data[3].value, name: response.data[3].name}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            vm.checkinBarOption = {
                title: {
                    text: '报到统计图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['已报到', '未报到']
                },
                series: [
                    {
                        name: '数据来源',
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '60%'],
                        data: [
                            {value: response.data[4].value, name: response.data[4].name},
                            {value: response.data[5].value, name: response.data[5].name}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }

        function register(index) {
            SimpleModal.open("确认注册？", ok, cancel);
            function ok() {
                ecnuRegistrationDao.register(vm.students[index].id,
                                             function (response) {
                                                 vm.students[index].register = "是";
                                                 vm.registButton[index] = false;
                                                 loadCharts();
                                             });
            }

            function cancel() {
            }
        }

        function batchRegister() {
            var checkedList = new Array();
            var indexList = new Array();
            var index = 0;
            angular.forEach(vm.students, function (student) {
                if (student.$checked == true && vm.students[index].register == "否") {
                    checkedList.push(student.id);
                    indexList.push(index);
                }
                index++;
            });
            ecnuRegistrationDao.batchRegister(checkedList,
                                              function (response) {
                                                  for (i = 0; i < checkedList.length; i++) {
                                                      vm.students[indexList[i]].register = "是";
                                                      vm.registButton[indexList[i]] = false;
                                                  }
                                                  loadCharts();
                                              });
        }

        function checkAll() {
            angular.forEach(vm.students, function (student) {
                student.$checked = vm.allChecked;
            });
            vm.batchButton = vm.allChecked;
        }

        function reset() {
            var proMessage = {"msg": "重置成功"};
            $scope.$emit("processing",true, "重置中");

            ecnuRegistrationDao.reset(function (response) {
                $scope.$emit("processing",false, "");
                if (response) {
                    promptModal(proMessage);
                } else {
                    proMessage = {"msg": "本学年本学期已经重置过！"};
                    promptModal(proMessage);
                }
                loadCharts();
            });
        }

        function exportRegistrationList() {
            ecnuRegistrationDao.exportRegistrationList(vm.searchCondition, function (response) {
                var blob = new Blob([response], {type: "application/octet-stream"});
                var excelName = null;
                if (vm.searchCondition.isNew) {
                    excelName = "新生注册信息.xlsx";
                } else {
                    excelName = "老生注册信息.xlsx";
                }
                saveAs(blob, excelName);
            });
        }

        function promptModal(proMessage) {
            $uibModal.open({
                               animation: true,
                               templateUrl: 'promptMessage.html',
                               controller: 'PromptMessageCtrl',
                               controllerAs: 'promptMessageCtrl',
                               windowClass: 'app-modal-window',
                               resolve: {
                                   proMessage: proMessage
                               }
                           });
        }

        function checkboxChange() {
            var flag = false;
            angular.forEach(vm.students, function (student) {
                if (student.$checked == true) {
                    vm.batchButton = true;
                    flag = true;
                }
            });
            if (!flag)
                vm.batchButton = false;
        }
    }

    ecnuXjHome.controller('PromptMessageCtrl',
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
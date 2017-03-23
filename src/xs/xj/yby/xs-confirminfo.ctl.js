(function () {
    'use strict';
    var ecnuXsHome = angular.module('stuhome');
    ecnuXsHome.controller('XsConfirmCtrl', ['ecnuStudentDao', 'ecnuYbyDao', 'ecnuMetaDataDao', '$scope', 'PageState','ecnuStaffDao', XsConfirmCtrl]);
    function XsConfirmCtrl(ecnuStudentDao, ecnuYbyDao, ecnuMetaDataDao, $scope, PageState,ecnuStaffDao) {
        var vm = this;
        vm.flag = new Array();
        vm.metaData = new Array();
        vm.temp = "";
        vm.dt = new Date();
        vm.format = 'yyyy/MM/dd';
        vm.num = 0;
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
        vm.showFlag = [true, true, true, true, true, true, true, true, true, true];

        vm.getStudent = getStudent;
        vm.apply = apply;
        vm.getData = getData;
        vm.getDayClass = getDayClass;
        vm.allApply = allApply;
        vm.findRegionCity = findRegionCity;
        vm.findRegionCounty = findRegionCounty;
        vm.findUnitDepartment = findUnitDepartment;
        vm.findRailwayStation = findRailwayStation;
        vm.findDisciplineMinor = findDisciplineMinor;
        vm.findDisciplineMajor = findDisciplineMajor;
        vm.findBachelorDisciplineMinor = findBachelorDisciplineMinor;
        vm.findBachelorDisciplineMajor = findBachelorDisciplineMajor;
        vm.confirm = confirm;

        getStudent();

        function confirm(flag) {
            if (flag == false) {
                alert("仍有修改信息在审批中，暂时无法确认！！");
            } else {
                if (vm.num == 1) {
                    ecnuYbyDao.confirm(PageState.user.getUserID(), function (response) {
                        alert("成功确认，再发现信息有误，请申请退回！！");
                        vm.data = response;
                    });
                } else {
                    alert("请再次确认预毕业信息无误，单击确认");
                    vm.num++;

                }

            }

        }

        function findBachelorDisciplineMajor(categoryCode) {
            ecnuMetaDataDao.findBachelorDisciplineMajor(categoryCode, function (response) {
                vm.bachelorDisciplineMajors = response;
            });
        }

        function findBachelorDisciplineMinor(majorCode) {
            ecnuMetaDataDao.findBachelorDisciplineMinor(majorCode, function (response) {
                vm.bachelorDisciplineMinors = response;
            });
        }

        function findDisciplineMajor(categoryCode) {
            ecnuMetaDataDao.getDisciplineMajor(categoryCode, function (response) {
                vm.disciplineMajors = response;
            });
        }

        function findDisciplineMinor(majorCode) {
            ecnuMetaDataDao.getMinorsOfMajor(majorCode, function (response) {
                vm.disciplineMinors = response;
            });
        }

        function findRailwayStation(state) {
            ecnuMetaDataDao.getRailwayStation(state, function (response) {
                vm.RailwayStations = response;
            });
        }

        function findUnitDepartment(schoolCode) {
            ecnuMetaDataDao.getUnitDepartment(schoolCode, function (response) {
                vm.UnitDepartments = response;
            });
        }

        function findRegionCounty(cityCode) {
            ecnuMetaDataDao.getRegionCounty(cityCode, function (response) {
                vm.RegionSCounties = response;
            });
        }

        function findRegionCity(stateCode) {
            ecnuMetaDataDao.getRegionCity(stateCode, function (response) {
                vm.RegionSCities = response;
            });
        }

        function allApply() {
            for (var i = 0; i < vm.flag.length; i++) {
                if (vm.flag[i] == "0") {
                    vm.students[i].newdata = "";
                } else {
                    ecnuYbyDao.submitApply(vm.students[i], function (response) {
                    });
                }
            }

        }

        function getStudent() {
            ecnuYbyDao.getCurStudent(PageState.user.getUserID(), function (response) {
                if (response.pregraduationStatus == '空') {
                    alert("没到预毕业时间，暂时不能修改预毕业信息");
                }
                vm.data = response;
            })
        }

        function apply(apply, index) {
            ecnuYbyDao.submitApply(PageState.user.getUserID(), apply, function (response) {
                if (response == true) {
                    vm.showFlag[index] = false;
                    getStudent();
                } else {
                    alert("不能重复提交申请");
                }
            });
        }

        function getData(check, type, api, classField, index) {
            vm.showFlag[index] = true;
            if (check == false) {
                vm.flag[index] = '0';
            } else {
                if (type == 'select') {
                    vm.flag[index] = '1';

                    if (classField == 'edu.ecnu.yjsy.model.student.Unit') {
                        //用于特殊处理Unit
                        vm.flag[index] = '6';
                    } else if (classField == 'edu.ecnu.yjsy.model.student.Region') {
                        //用于特殊处理Region
                        vm.flag[index] = '5';
                    } else if (classField == 'edu.ecnu.yjsy.model.student.Railway') {
                        //用于特殊处理Railway
                        vm.flag[index] = '7';
                    } else if (classField == 'edu.ecnu.yjsy.model.student.Discipline') {
                        //用于特殊处理Discipline
                        vm.flag[index] = '8';
                    } else if (classField == 'edu.ecnu.yjsy.model.student.BachelorDiscipline') {
                        //用于特殊处理Discipline
                        vm.flag[index] = '9';
                    }

                    if(classField == "edu.ecnu.yjsy.model.staff.Staff"){
                        ecnuStaffDao[api](function (response) {
                            vm.metaData[index] = response;
                        });
                    }else {
                        ecnuMetaDataDao[api](function (response) {
                            vm.metaData[index] = response;
                        });
                    }
                } else if (type == 'input') {
                    vm.flag[index] = '2';
                } else if (type == 'redio') {
                    vm.flag[index] = '3';
                    ecnuMetaDataDao[api](function (response) {
                        vm.metaData[index] = response;
                    });
                } else if (type == 'date') {
                    vm.flag[index] = '4';
                }
            }
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
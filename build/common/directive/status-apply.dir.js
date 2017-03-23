/**
 * Created by xiafan on 16-11-25.
 */

(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive("statusApplyPanel", [
        'PathUtils', statusApplyPanel
    ]);
    function statusApplyPanel(pathUtils) {
        return {
            restrict: 'E',
            bindToController: {
                // "searchCondition": '=',
                "applyConfig":'='
            },
            scope: {},
            controller: [
                'ecnuStatusChangeTypeDao',
                'ecnuStatusChangeDao',
                'ecnuMetaDataDao',
                'ecnuStaffDao',
                StatusApplyCtrl
            ],
            controllerAs: 'statusApplyCtrl',
            templateUrl: pathUtils.qualifiedPath("/common/directive/status-apply.html")
        }
    }

    function StatusApplyCtrl(statusChangeTypeDao, ecnuStatusChangeDao, ecnuMetaDataDao, ecnuStaffDao) {
        var vm = this;

        vm.showTerm = true;
	vm.showEarlyGraduationTerm = true;
        vm.showSupervisor = true;
        vm.showDiscipline = true;
        vm.showUnit = true;
        vm.showTransmitdate = true;
	vm.showLeaveDate = true;
        vm.request = {};
        vm.warningStatus = null;
        vm.type = null;

        vm.searchCondition = {};
        vm.discipline = {};

        //显示日期控件
        vm.transmitdate = new Date(vm.searchCondition.transmitdate);
	    //请长假显示日期控件
        vm.leaveDateFrom = new Date(vm.searchCondition.leaveDateFrom);
	    vm.leaveDateTo = new Date(vm.searchCondition.leaveDateTo);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
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

        vm.onMajorTypeChange = onMajorTypeChange;
        vm.onMinorTypeChange = onMinorTypeChange;
        vm.ok = ok;
        vm.cancel = cancel;

        //选择搜索框涉及的函数
        vm.supervisorInput = supervisorInput;
        vm.supervisorSelect = supervisorSelect;
        vm.supervisorClicked = supervisorClicked;

        //转专业涉及的级联搜索框
        vm.findDisciplineMajor = findDisciplineMajor;
        vm.findDisciplineMinor = findDisciplineMinor;

        //转院系
        vm.findUnitDepartment = findUnitDepartment;

        //关于时间的函数定义
        vm.today = today;
        vm.toggleMin = toggleMin;
        vm.getDayClass = getDayClass;

        /* 获得导师 */
        ecnuStaffDao.getStaff(function (response) {
            vm.staffs = response;
        });

        /* 获得专业的门类 */
        ecnuMetaDataDao.getDisciplineCategory(function (response) {
            vm.disciplines = response;
        });

        /* 获得学院和专业 */
        ecnuMetaDataDao.getUnitSchool(function (response) {
            vm.schools = response;
        });

        function supervisorInput() {
            var m = document.getElementById("dss");
            m.style.display = "";
        }

        function supervisorSelect() {
            var m = document.getElementById("dss");
            m.style.display = "none";
        }

        function supervisorClicked(supervisorName) {
            vm.show_supervisor = supervisorName;
        }

        function findDisciplineMajor(categoryCode, discipline) {
            ecnuMetaDataDao.getDisciplineMajor(categoryCode,
                function (response) {
                    discipline.majors = response;
                });
        }

        function findDisciplineMinor(majorCode, discipline) {
            if (majorCode != null) {
                ecnuMetaDataDao.getMinorsOfMajor(majorCode,
                    function (response) {
                        discipline.minors = response;
                    });
            }
            else {
                discipline.minors = null;
            }
        }

        function findUnitDepartment(schoolCode) {
            ecnuMetaDataDao.getUnitDepartment(schoolCode,
                function (response) {
                    vm.departments = response;
                });
        }

        function today() {
            vm.dt = new Date();
        }

        function toggleMin() {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
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

        statusChangeTypeDao.major(function (response) {
            vm.majors = response;
            vm.major = vm.majors[0][0];
            vm.searchCondition.major = vm.majors[0][0];
            onMajorTypeChange();
        });


        function onMajorTypeChange() {
            vm.showTerm = false;
	    vm.showEarlyGraduationTerm = false;
            vm.showSupervisor = false;
            vm.showDiscipline = false;
            vm.showUnit = false;
            vm.showTransmitdate =false;
            vm.showLeaveDate = false;
            if(vm.searchCondition.major=="1" || vm.searchCondition.major=="2"){
                vm.showTerm = true;
                vm.searchCondition.term = "1";
            }else if (vm.searchCondition.major=="5"){
                vm.showEarlyGraduationTerm = true;
		vm.searchCondition.earlyGraduationTerm = "1";
            }else if (vm.searchCondition.major=="8"){
                vm.showSupervisor = true;
		
            }else if (vm.searchCondition.major=="14"){
                vm.showDiscipline = true;
            }else if (vm.searchCondition.major=="15"){
                vm.showUnit = true;
            }else if (vm.searchCondition.major=="13"){
                vm.showTransmitdate = true;
            }else if (vm.searchCondition.major=="16"){
                vm.showLeaveDate = true;
            }
            statusChangeTypeDao.getMinorByMajor(vm.searchCondition.major, function (response) {
                vm.minors = response;
                vm.minor = vm.minors[0][0];
                vm.searchCondition.minor = vm.minors[0][0];
                onMinorTypeChange();
            });
        }

        function onMinorTypeChange() {
		if (vm.searchCondition.major=="8"){
		    if (vm.searchCondition.minor == "2") {
		        vm.showUnit = true;
		    }
		}
            statusChangeTypeDao.getByMinor(vm.searchCondition.minor, function (response) {
                vm.type = response;
            });
        }

        function ok() {
            if (vm.searchCondition.reason == null || vm.searchCondition.reason == '' || vm.searchCondition.reason == 'null'){
                vm.warningStatus = '请输入申请理由';
                return;
            } else {
                vm.searchCondition["name"] = vm.applyConfig.student.name;
                vm.searchCondition["sno"] = vm.applyConfig.student.sno;
                if(vm.searchCondition.major!="1" && vm.searchCondition.major!="2"){
                    vm.searchCondition.delay = null;
                }
		        if(vm.searchCondition.major=="16") {
			        var dateFrom = vm.searchCondition.leaveDateFrom;
			        var dateTo = vm.searchCondition.leaveDateTo;
			        var idays = parseInt(Math.abs(dateTo - dateFrom))/1000/60/60/24;
			        if (idays > 49) {
			            vm.warningStatus = '请长假不能超过7周。'; 
			            return;
			        }
			
		        }
                ecnuStatusChangeDao.save(vm.searchCondition, function () {
                    if (vm.applyConfig.onSuccess != undefined)
                        vm.applyConfig.onSuccess(vm.request);
                });

            }
        }

        function cancel() {
            if (vm.applyConfig.onCancel != undefined)
                vm.applyConfig.onCancel();
        }
    }
})();
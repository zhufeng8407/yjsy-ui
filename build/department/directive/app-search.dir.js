/**
 *@author shibing
 *@author xiafan
 *将搜索框封装为模板，使用元素名来指定模板，如：
 *<search-layout search-condition-meta="searchConditionMeta" search-condition="searchCondition" >
 *        <button type="submit" class="btn btn-default" ng-click="xsInfoCtrl.search()">查找</button>
 *</search-layout>
 * 元素内部可指定对应的查询按钮及其他按钮。
 *
 * 元素需要传入两个参数：
 * @param search-condition-meta 指定需要显示的搜索栏
 * 如：$scope.searchConditionMeta = {
 *           name:true,
 *           sno:true,
 *           };
 *  上例指定了显示姓名，学号搜索框。当前可指定的搜索框如下：
 *  姓名：name，学号：sno，年级：grade，院系(一级)：school，院系(二级)：department，门类：discpline，一级学科：major,二级学科:minor
 *  培养类型：educationType，是否缴费：isFee，是否报到：isCheckin，困难认定：isPoor，推迟入学: isDelay
 *
 * @param search-condition 绑定搜索框输入的内容到一个对象
 * 需要初始化一个searchCondition对象：
 * $scope.searchCondition={};
 * 该对象可以得到搜索框中输入的条件，进而查找等方法中可以传入该对象来执行。
 */
(function () {
    'use strict';
    var ecnuDpHome = angular.module('ecnuDpHome');
    ecnuDpHome.directive("searchLayout", ['PathUtils', searchLayout]);
    function searchLayout(pathUtils) {
        return {
            restrict: 'E',
            transclude: true,
            bindToController: {
                "searchConfig": '=',
                "searchCondition": '=',
                "readyHook": "&"
            },
            scope: {},
            controller: [
                'ecnuMetaDataDao',
                'PageState',
                'validateSchoolFilter',
                'validateDepartmentFilter',
                'QUERY_PARAMS',
                searchController
            ],
            controllerAs: 'searchCtrl',
            templateUrl: pathUtils.qualifiedPath("/department/directive/app-search.view.html")
        }
    }

    function searchController(ecnuMetaDataDao, PageState, schoolFilter, departmentFilter, QUERY_PARAMS) {
        var vm = this;

        vm.getDepartment = getDepartment;
        vm.getMinorsOfMajor = getMinorsOfMajor;
        vm.getDisciplineMajor = getDisciplineMajor;
        vm.loadGrade = loadGrade;
        vm.loadTerm = loadTerm;
        vm.loadYear = loadYear;

        vm.showPersonalInfo = vm.searchConfig.name || vm.searchConfig.sno;
        vm.showOrgInfo = vm.searchConfig.school || vm.searchConfig.department ||
                         vm.searchConfig.grade;
        vm.showDisciplineInfo = vm.searchConfig.minor || vm.searchConfig.educationType;
        vm.showRegistrationInfo = vm.searchConfig.isFee || vm.searchConfig.isCheckin ||
                                  vm.searchConfig.isPoor || vm.searchConfig.isDelay;
        vm.showTimeInfo = vm.searchConfig.term || vm.searchConfig.regYear;

        //判断是新生注册页面还是老生注册页面
        if (("autoNew" in vm.searchConfig) && vm.searchConfig.autoNew)
            vm.searchCondition.isNew = PageState.isPageForNewbie();
        loadMetaData();

        function loadMetaData() {
            if (vm.searchConfig.grade) {
                loadGrade();
            }
            if (vm.searchConfig.term) {
                loadTerm();
            }
            if (vm.searchConfig.regYear) {
                loadYear();
            }
            if (vm.searchConfig.educationType) {
                ecnuMetaDataDao.getDegree(function (response) {
                    vm.educationTypes = response;
                    vm.educationTypes.splice(0, 0, QUERY_PARAMS.VALUE_STRING_ALL);
                });
            }

            if (vm.searchConfig.school) {
                ecnuMetaDataDao.getUnitSchool(function (response) {
                    vm.schools = response;
                    vm.schools.splice(0, 0, ["所有", QUERY_PARAMS.VALUE_STRING_ALL]);
                    vm.schools = schoolFilter(vm.schools, PageState.getQueryConstraint());
                    if (vm.schools != undefined && !vm.schools.length == 0) {
                        vm.searchCondition.schoolCode = vm.schools[0][1];
                        vm.getDepartment(vm.searchCondition.schoolCode);
                    } else {
                        if (vm.readyHook)
                            vm.readyHook();
                    }
                });
            }

            //学科信息
            if (vm.searchConfig.discipline) {
                ecnuMetaDataDao.getDisciplineCategory(function (response) {
                    vm.disciplines = response;
                    vm.disciplines.splice(0, 0, ["所有", QUERY_PARAMS.VALUE_STRING_ALL]);
                });
            }

            if (vm.searchConfig.isPoor) {
                ecnuMetaDataDao.getPoorLevels(function (response) {
                    vm.poorLevels = response;
                    vm.poorLevels.splice(0, 0, QUERY_PARAMS.VALUE_STRING_ALL);
                });
            }
        }

        function loadGrade() {
            ecnuMetaDataDao.getGrade(function (response) {
                vm.grades = response;
                vm.grades.splice(0, 0, QUERY_PARAMS.VALUE_STRING_ALL);
                if (vm.grades != undefined && !vm.grades.length == 0)
                    vm.searchCondition.grade = vm.grades[0];
            });
        }

        function loadTerm() {
            ecnuMetaDataDao.getTerm(function (response) {
                vm.terms = response;
                vm.terms.splice(0, 0, QUERY_PARAMS.VALUE_STRING_ALL);
                if (vm.terms != undefined && !vm.terms.length == 0)
                    vm.searchCondition.term = vm.terms[0];
            });
        }

        function loadYear() {
            ecnuMetaDataDao.getRegYear(function (response) {
                vm.regYears = response;
                vm.regYears.splice(0, 0, QUERY_PARAMS.VALUE_STRING_ALL);
                if (vm.regYears != undefined && !vm.regYears.length == 0)
                    vm.searchCondition.regYear = vm.regYears[0];
            });
        }

        function getDisciplineMajor(discipline) {
            if (vm.searchConfig.major) {
                ecnuMetaDataDao.getDisciplineMajor(discipline, function (response) {
                    vm.majors = response;
                    vm.majors.splice(0, 0, ["所有", QUERY_PARAMS.VALUE_STRING_ALL]);
                    vm.searchCondition.majorCode = 'null';
                });
            }
        }

        function getMinorsOfMajor(majorCode) {
            if (vm.searchConfig.minor) {
                ecnuMetaDataDao.getMinorsOfMajor(majorCode, function (response) {
                    vm.minors = response;
                    vm.majors.splice(0, 0, ["所有", QUERY_PARAMS.VALUE_STRING_ALL]);
                    vm.searchCondition.minorCode = 'null';
                });
            }
        }

        function getDepartment(schoolCode) {
            if (vm.searchConfig.department) {
                if (vm.searchCondition.schoolCode == QUERY_PARAMS.VALUE_STRING_ALL) {
                    processDeparts([]);
                } else {
                    ecnuMetaDataDao.getUnitDepartment(schoolCode, processDeparts);
                }
            }
            function processDeparts(response) {
                vm.departments = response;
                vm.departments.splice(0, 0, [-1, "所有", QUERY_PARAMS.VALUE_STRING_ALL]);
                vm.departments = departmentFilter(vm.departments, PageState.getQueryConstraint(), schoolCode);
                if (vm.departments != undefined && !vm.departments.length == 0) {
                    vm.searchCondition.departmentCode = vm.departments[0][2];
                }
                if (vm.readyHook) {
                    vm.readyHook();
                    vm.readyHook = null;
                }
            }
        }

    }

})();
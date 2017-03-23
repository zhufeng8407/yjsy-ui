/**
 * @author xiafan
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuUtils = angular.module('ecnuUtils');

    ecnuUtils.directive('xsInfoPanel', [
        'PathUtils', function (PathUtils) {
            return {
                restrict: 'E',
                scope: {
                    sno: "=",
                    student: "=?",
                    isCreate: "=?"
                },
                controller: [
                    '$anchorScroll',
                    '$location',
                    '$scope',
                    '$filter',
                    'Upload',
                    'PathUtils',
                    'ecnuStudentDao',
                    'ecnuMetaDataDao',
                    'ecnuStaffDao',
                    'EcnuCitizenIDValidation',
                    '$window',
                    AddXsCtl
                ],
                controllerAs: 'addXsCtl',
                templateUrl: PathUtils.qualifiedPath('/common/directive/xs-info-panel.html')
            };
        }
    ]);

    function AddXsCtl($anchorScroll, $location, $scope, $filter, Upload, PathUtils, ecnuStudentDao, ecnuMetaDataDao,
                      ecnuStaffDao) {
        var vm = this;
        vm.sno = $scope.sno;

        vm.student = $scope.student;
        vm.isCreate = false;
        vm.reqiredFieldMask = {"sno": false, "name": false, "discipline": false, "unit": false, "los": false};
        vm.opening = true;
        vm.hometown = {};
        vm.birthplace = {};
        vm.residence = {};
        vm.familyRegion = {};
        vm.directedRegion = {};
        vm.examineeArchive = {};
        vm.prestudy = {};
        vm.discipline = {};
        vm.masterDiscipline = {};
        vm.postgraduateDiscipline = {};
        vm.bachelorDiscipline = {};
        vm.undergraduateDiscipline = {};

        //函数定义
        vm.today = today;
        vm.toggleMin = toggleMin;
        vm.getDayClass = getDayClass;

        vm.findRegionCity = findRegionCity;
        vm.findRegionCounty = findRegionCounty;
        vm.findRailwayStation = findRailwayStation;
        vm.findUnitDepartment = findUnitDepartment;
        vm.findDisciplineMajor = findDisciplineMajor;
        vm.findDisciplineMinor = findDisciplineMinor;
        vm.findBachelorDisciplineMajor = findBachelorDisciplineMajor;
        vm.findBachelorDisciplineMinor = findBachelorDisciplineMinor;

        //选择搜索框涉及的两个函数
        vm.nationInput = nationInput;
        vm.nationSelect = nationSelect;
        vm.nationClicked = nationClicked;

        vm.ethnicInput = ethnicInput;
        vm.ethnicSelect = ethnicSelect;
        vm.ethnicClicked = ethnicClicked;

        vm.supervisorInput = supervisorInput;
        vm.supervisorChange = supervisorChange;
        vm.supervisorSelect = supervisorSelect;

        vm.supervisorClicked = supervisorClicked;
        vm.bachelorUnitInput = bachelorUnitInput;
        vm.bachelorUnitChange = bachelorUnitChange;
        vm.bachelorUnitSelect = bachelorUnitSelect;

        vm.undergradudateUnitInput = undergradudateUnitInput;
        vm.undergradudateUnitSelect = undergradudateUnitSelect;
        vm.undergradudateUnitClicked = undergradudateUnitClicked;

        vm.undergraduateDisciplineInput = undergraduateDisciplineInput;
        vm.undergraduateDisciplineSelect = undergraduateDisciplineSelect;

        vm.masterUnitInput = masterUnitInput;
        vm.masterUnitSelect = masterUnitSelect;
        vm.masterUnitClicked = masterUnitClicked;

        vm.postgraduateUnitInput = postgraduateUnitInput;
        vm.postgraduateUnitSelect = postgraduateUnitSelect;
        vm.postgraduateUnitClicked = postgraduateUnitClicked;

        vm.isphoneValid = isphoneValid;

        //保存数据
        vm.saveStudent = saveStudent;
        vm.formReset = formReset;

        //页面内跳转
        vm.gotoAnchor = gotoAnchor;

        //根据入学日期获得年级
        vm.getAdmissionYear = getAdmissionYear;

        //根据学士学位专业代码获得学士学位专业名称
        vm.getBachelorDisciplineName = getBachelorDisciplineName;

        //根据本科毕业专业代码获得本科毕业专业名称
        vm.getUndergraduateDisciplineName = getUndergraduateDisciplineName;

        //根据获硕士学位专业代码得到获硕士学位专业名称
        vm.getMasterDisciplineName = getMasterDisciplineName;

        //根据硕士毕业专业代码得到硕士毕业专业名称
        vm.getPostgraduateDisciplineName = getPostgraduateDisciplineName;

        //根据考生档案所在地码获得省市地区元数据表中自动获取邮编
        vm.getExamineeArchiveUnitZipcode = getExamineeArchiveUnitZipcode;

        if (vm.sno == undefined || vm.sno == null || vm.sno == "") {
            vm.student = ecnuStudentDao.newStudent();
            vm.preStudent = angular.copy(vm.student);
            vm.isCreate = true;
            loadMetaData();
            setupUI();
        } else {
            ecnuStudentDao.getStudentBySno(vm.sno, function (response) {
                                               vm.student = response;
                                               vm.student.isAdmissionUnified = vm.student.admissionUnified;
                                               vm.student.isCheckin = vm.student.checkin;
                                               vm.student.isFee = vm.student.fee;
                                               vm.student.isNew = vm.student.new;
                                               vm.student.isRegister = vm.student.register;
                vm.student.birthdate = $filter('date')(vm.student.birthdate,"EEE MMM dd yyyy HH:mm:ss Z '(中国标准时间)'");
                                               vm.preStudent = angular.copy(vm.student);
                                               vm.show_nation = vm.student.nation.name;
                                               vm.show_ethnic = vm.student.ethnic.name;
                                               vm.show_supervisor = vm.student.supervisor.name;
                                               if (vm.student.hometown != null) {
                                                   vm.findRegionCity(vm.student.hometown.stateCode, vm.hometown);
                                                   vm.findRegionCounty(vm.student.hometown.cityCode, vm.hometown);
                                               }
                                               if (vm.student.birthplace != null) {
                                                   vm.findRegionCity(vm.student.birthplace.stateCode, vm.birthplace);
                                                   vm.findRegionCounty(vm.student.birthplace.cityCode, vm.birthplace);
                                               }


                                               if (vm.student.residence != null) {
                                                   vm.findRegionCity(vm.student.residence.stateCode, vm.residence);
                                                   vm.findRegionCounty(vm.student.residence.cityCode, vm.residence);
                                               }
                                               if (vm.student.family != null) {
                                                   vm.findRegionCity(vm.student.family.stateCode, vm.familyRegion);
                                                   vm.findRegionCounty(vm.student.family.cityCode, vm.familyRegion);
                                               }
                                               if (vm.student.railway != null) {
                                                   vm.findRailwayStation(vm.student.railway.state);
                                               }
                                               if (vm.student.examineeArchive != null) {
                                                   vm.findRegionCity(vm.student.examineeArchive.stateCode, vm.examineeArchive);
                                                   vm.findRegionCounty(vm.student.examineeArchive.cityCode, vm.examineeArchive);
                                               }
                                               if (vm.student.prestudy != null) {
                                                   vm.findRegionCity(vm.student.prestudy.stateCode, vm.prestudy);
                                                   vm.findRegionCounty(vm.student.prestudy.cityCode, vm.prestudy);
                                               }
                                               if (vm.student.discipline != null) {
                                                   vm.findDisciplineMajor(vm.student.discipline.categoryCode, vm.discipline);
                                                   vm.findDisciplineMinor(vm.student.discipline.majorCode, vm.discipline);
                                               }
                                               if (vm.student.unit != null) {
                                                   vm.findUnitDepartment(vm.student.unit.schoolCode);
                                               }
                                               if (vm.student.directedRegion != null) {
                                                   vm.findRegionCity(vm.student.directedRegion.stateCode, vm.directedRegion);
                                                   vm.findRegionCounty(vm.student.directedRegion.cityCode, vm.directedRegion);
                                               }
                                               if (vm.student.bachelorDiscipline != null) {
                                                   vm.findBachelorDisciplineMajor(vm.student.bachelorDiscipline.categoryCode, vm.bachelorDiscipline)
                                                   vm.findBachelorDisciplineMinor(vm.student.bachelorDiscipline.majorCode, vm.bachelorDiscipline)
                                               }
                                               if (vm.student.undergraduateDiscipline != null) {
                                                   vm.findBachelorDisciplineMajor(vm.student.undergraduateDiscipline.categoryCode,
                                                                                  vm.undergraduateDiscipline)
                                                   vm.findBachelorDisciplineMinor(vm.student.undergraduateDiscipline.majorCode,
                                                                                  vm.undergraduateDiscipline)
                                               }
                                               if (vm.student.masterDiscipline != null) {
                                                   vm.findDisciplineMajor(vm.student.masterDiscipline.categoryCode, vm.masterDiscipline)
                                                   vm.findDisciplineMinor(vm.student.masterDiscipline.majorCode, vm.masterDiscipline)
                                               }

                                               if (vm.student.postgraduateDiscipline != null) {

                                                   vm.findDisciplineMajor(vm.student.postgraduateDiscipline.categoryCode, vm.postgraduateDiscipline)
                                                   vm.findDisciplineMinor(vm.student.postgraduateDiscipline.majorCode, vm.postgraduateDiscipline)
                                               }
                                               loadMetaData();
                                               setupUI();
                                           }
            )
            ;
        }

        //初始展示界面
        function setupUI() {

            vm.los = [
                "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8"
            ];

            //显示日期用的
            vm.birthdate = new Date(vm.student.birthdate);
            vm.leaveDate = new Date(vm.student.leaveDate);
            vm.archiveDate = new Date(vm.student.archiveDate);
            vm.insuranceDate = new Date(vm.student.insuranceDate);
            vm.admissionDate = new Date(vm.student.admissionDate);
            vm.expectedGraduationDate = new Date(vm.student.expectedGraduationDate);
            vm.actualGraduationDate = new Date(vm.student.actualGraduationDate);
            vm.pregraduationDate = new Date(vm.student.pregraduationDate);
            vm.grantedDegreeDate = new Date(vm.student.grantedDegreeDate);
            vm.bachelorDate = new Date(vm.student.bachelorDate);
            vm.undergradudateDate = new Date(vm.student.undergradudateDate);
            vm.masterDate = new Date(vm.student.masterDate);
            vm.postgraduateDate = new Date(vm.student.postgraduateDate);
            vm.finalEducationDate = new Date(vm.student.finalEducationDate);
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
        }

        function loadMetaData() {
            ecnuMetaDataDao.getEthnic(function (response) {
                vm.ethnics = response;
            });
            ecnuMetaDataDao.getNation(function (response) {
                vm.nations = response;
            });
            ecnuMetaDataDao.getReligion(function (response) {
                vm.religions = response;
            });
            ecnuMetaDataDao.getRegionState(function (response) {
                vm.states = response;
            });
            ecnuMetaDataDao.getExamineeOrigin(function (response) {
                vm.examineeOrigins = response;
            });
            ecnuMetaDataDao.getSpecialPlan(function (response) {
                vm.specialPlans = response;
            });
            ecnuMetaDataDao.getEnrollment(function (response) {
                vm.enrollments = response;
            });

            ecnuMetaDataDao.getDisciplineCategory(function (response) {
                vm.disciplines = response;
            });
            //FIXME:获得学院和专业(暂时没有修改)
            ecnuMetaDataDao.getUnitSchool(function (response) {
                vm.schools = response;
            });


            /* 单个新生导入增加的元数据 */
            ecnuMetaDataDao.getSsnType(function (response) {
                vm.ssnTypes = response;
            });

            ecnuMetaDataDao.getRailwayState(function (response) {
                vm.railwayStates = response;
            });

            ecnuMetaDataDao.getPrestudyUnitNature(function (response) {
                vm.prestudyUnitNatures = response;
            });

            ecnuMetaDataDao.getEducation(function (response) {
                vm.educations = response;
            });

            ecnuMetaDataDao.getExamination(function (response) {
                vm.examinations = response;
            });

            ecnuMetaDataDao.getGraduation(function (response) {
                vm.graduations = response;
            });

            ecnuMetaDataDao.getBachelorDiscipline(function (response) {
                vm.bachelorDisciplines = response;
            });

            ecnuMetaDataDao.getEducationMode(function (response) {
                vm.educationModes = response;
            });

            ecnuMetaDataDao.getDegree(function (response) {
                vm.degrees = response;
            });

            ecnuMetaDataDao.getMarriage(function (response) {
                vm.marriages = response;
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

        function getAdmissionYear(admissiontime) {
            vm.student.grade = admissiontime.getFullYear();
        }

        function getBachelorDisciplineName(bachelorMinorID) {
            if (vm.bachelorDiscipline.minors != null) {
                for (var i = 0; i < vm.bachelorDiscipline.minors.length; i++) {
                    if (vm.bachelorDiscipline.minors[i][2] == bachelorMinorID) {
                        vm.student.bachelorDisciplineName = vm.bachelorDiscipline.minors[i][1];
                    }
                }
            }
            else {
                vm.student.bachelorDisciplineName = null;
            }
        }

        function getUndergraduateDisciplineName(undergraduateMinorID) {
            if (vm.undergraduateDiscipline.minors != null) {
                for (var i = 0; i < vm.undergraduateDiscipline.minors.length; i++) {
                    if (vm.undergraduateDiscipline.minors[i][2] == undergraduateMinorID) {
                        vm.student.undergraduateDisciplineName = vm.undergraduateDiscipline.minors[i][1];
                    }
                }
            }
            else {
                vm.student.undergraduateDisciplineName = null;
            }
        }

        function getMasterDisciplineName(masterDisciplineID) {
            if (vm.masterDiscipline.minors != null) {
                for (var i = 0; i < vm.masterDiscipline.minors.length; i++) {
                    if (vm.masterDiscipline.minors[i][1] == masterDisciplineID) {
                        vm.student.masterDisciplineName = vm.masterDiscipline.minors[i][0];
                    }
                }
            }
            else {
                vm.student.masterDisciplineName = null;
            }
        }

        function getPostgraduateDisciplineName(postgraduateDisciplineID) {
            if (vm.postgraduateDiscipline.minors != null) {
                for (var i = 0; i < vm.postgraduateDiscipline.minors.length; i++) {
                    if (vm.postgraduateDiscipline.minors[i][1] == postgraduateDisciplineID) {
                        vm.student.postgraduateDisciplineName = vm.postgraduateDiscipline.minors[i][0];
                    }
                }
            }
            else {
                vm.student.postgraduateDisciplineName;
            }
        }

        function getExamineeArchiveUnitZipcode(examineeArchiveID) {
            if (vm.examineeArchive.counties != null) {
                for (var i = 0; i < vm.examineeArchive.counties.length; i++) {
                    if (vm.examineeArchive.counties[i][0] == examineeArchiveID) {
                        vm.student.examineeArchiveUnitZipcode = vm.examineeArchive.counties[i][2];
                    }
                }
            }
            else {
                vm.student.examineeArchiveUnitZipcode = null;
            }
        }

        function findRegionCity(stateCode, location) {
            ecnuMetaDataDao.getRegionCity(stateCode,
                                          function (response) {
                                              location.cities = response;
                                          });
        }

        function findRegionCounty(cityCode, location) {
            if (cityCode != null) {
                ecnuMetaDataDao.getRegionCounty(cityCode,
                                                function (response) {
                                                    location.counties = response;
                                                });
            }
            else {
                location.counties = null;
            }
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

        function findBachelorDisciplineMajor(categoryCode, bachelorDiscipline) {
            ecnuMetaDataDao.getBachelorDisciplineMajor(categoryCode,
                                                       function (response) {
                                                           bachelorDiscipline.majors = response;
                                                       });
        }

        function findBachelorDisciplineMinor(majorCode, bachelorDiscipline) {
            if (majorCode != null) {
                ecnuMetaDataDao.getBachelorDisciplineMinor(majorCode,
                                                           function (response) {
                                                               bachelorDiscipline.minors = response;
                                                           });
            }
            else {
                bachelorDiscipline.minors = null;
            }

        }

        function findRailwayStation(state) {
            ecnuMetaDataDao.getRailwayStation(state,
                                              function (response) {
                                                  vm.names = response;
                                              });
        }

        function findUnitDepartment(school) {
            ecnuMetaDataDao.getUnitDepartment(school,
                                              function (response) {
                                                  vm.departments = response;
                                              });
        }

        //FIXME: 使用ng-show替换一下几个函数
        /* 搜索输入框 */
        function nationInput() {
            var m = document.getElementById("gjs");
            m.style.display = "";
        }

        function nationSelect() {
            var m = document.getElementById("gjs");
            m.style.display = "none";

        }

        function nationClicked(nationName) {
            vm.show_nation = nationName;
        }

        function ethnicInput() {
            var m = document.getElementById("mzs");
            m.style.display = "";
        }

        function ethnicSelect() {
            var m = document.getElementById("mzs");
            m.style.display = "none";
        }

        function ethnicClicked(ethnicName) {
            vm.show_ethnic = ethnicName;
        }

        function supervisorInput() {
            var m = document.getElementById("dss");
            m.style.display = "";
        }

        function supervisorChange() {
            if (vm.show_supervisor != "") {
                vm.supervisorInput();
                ecnuStaffDao.getStaff(vm.show_supervisor, function (response) {
                    vm.staffs = response.data;
                });
            } else {
                vm.supervisorSelect();
            }
        }

        function supervisorSelect() {
            var m = document.getElementById("dss");
            m.style.display = "none";
        }

        function supervisorClicked(supervisorName) {
            vm.show_supervisor = supervisorName;
        }

        function bachelorUnitInput() {
            var m = document.getElementById("xsxwdwds");
            m.style.display = "";
        }

        function bachelorUnitChange() {
            if (vm.student.bachelorUnit.name != "") {
                vm.bachelorUnitInput();
                ecnuMetaDataDao.getUniversityIdName(vm.student.bachelorUnit.name, function (response) {
                    vm.universitys = response.data;
                });
            } else {
                vm.bachelorUnitSelect();
            }
        }

        function bachelorUnitSelect() {
            var m = document.getElementById("xsxwdwds");
            m.style.display = "none";
        }


        function undergradudateUnitInput() {
            var m = document.getElementById("bkbydwds");
            m.style.display = "";
        }

        function undergradudateUnitSelect() {
            var m = document.getElementById("bkbydwds");
            m.style.display = "none";
        }

        function undergradudateUnitClicked(undergradudateUnitName) {
            vm.student.undergradudateUnitName = undergradudateUnitName;
        }

        function undergraduateDisciplineInput() {
            var m = document.getElementById("bkbyzyds");
            m.style.display = "";
        }

        function undergraduateDisciplineSelect() {
            var m = document.getElementById("bkbyzyds");
            m.style.display = "none";
        }

        function masterUnitInput() {
            var m = document.getElementById("ssxwdwds");
            m.style.display = "";
        }

        function masterUnitSelect() {
            var m = document.getElementById("ssxwdwds");
            m.style.display = "none";
        }

        function masterUnitClicked(masterUnitName) {
            vm.student.masterUnitName = masterUnitName;
        }

        function postgraduateUnitInput() {
            var m = document.getElementById("ssbydwds");
            m.style.display = "";
        }

        function postgraduateUnitSelect() {
            var m = document.getElementById("ssbydwds");
            m.style.display = "none";
        }

        function postgraduateUnitClicked(postgraduateUnitName) {
            vm.student.postgraduateUnitName = postgraduateUnitName;
        }

        /*----------------------------------------------------------------------------------------------------------*/

        //移动电话必须为11位
        function isphoneValid(phone) {
            if (phone == null || phone.length != 11)
                vm.phoneFlag = true;
            else
                vm.phoneFlag = false;
        }

        $scope.$watch('addXsCtl.file', function () {
            if (vm.opening) {
                vm.opening = false;
                return;
            }
            var defaultImage = PathUtils.qualifiedStaticPath("/images/defaultImage.jpg");
            if (vm.file != defaultImage && vm.file != null) {
                Upload.upload(
                    {
                        url: PathUtils.qualifiedAPIPath("xj/student/imageUpload"),
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        data: {
                            file: vm.file,
                            'sno': vm.student.sno,
                            'grade': vm.student.grade
                        },
                        method: 'post'
                    })
                      .then(
                          function (resp) {
                              alert("上传成功！");
                          },
                          function (resp) {
                              alert("上传失败！");
                          },
                          function (evt) {
                              vm.progress = parseInt(100.0
                                                     * evt.loaded / evt.total);
                          });
            }
        });

        function saveStudent(student) {

            for (var key in vm.reqiredFieldMask) {
                vm.reqiredFieldMask[key] = (vm.student[key] == null);
            }

            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(vm.student.email)) {
                alert('电子邮件格式不正确');
            } else if (vm.student.mobile == null || vm.student.mobile.length != 11) {
                alert('移动电话号码位数不正确,应该为11位');
            }
            else if (vm.student.discipline != null && vm.student.unit != null && vm.student.los != null &&
                     vm.student.name != null && vm.student.sno != null) {
                if (vm.sno == null || vm.sno == "")
                    ecnuStudentDao.createStudent(student, handlePersistResult);
                else {
                    ecnuStudentDao.updateStudent(vm.sno, student, handlePersistResult);
                }
            }

        }

        function formReset() {
            vm.student = angular.copy(vm.preStudent);
            vm.show_nation = vm.student.nation.name;
            setupUI();
        }

        function handlePersistResult(response) {
            if (response == true)
                alert("保存成功！");
            else if (response == false)
                alert("保存失败！");
        }

        //页面内导航栏
        function gotoAnchor(x) {
            document.getElementsByName(x)[0].scrollIntoView();
        }

    }
})
();
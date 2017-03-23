/**
 * @author liyanbin
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var ecnuXjHome = angular.module('ecnuAdminHome');
    ecnuXjHome.controller('XsMetadataCtrl',
                          [ 'ecnuMetaDataDao', XsMetadataCtrl]);

    function XsMetadataCtrl(ecnuMetaDataDao) {
        var vm = this;
        vm.currentPage = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

        vm.numPerPage = 15;
        vm.maxSize = 5;

        vm.disciplinePageChange = disciplinePageChange;
        vm.enrollmentPageChange = enrollmentPageChange;
        vm.ethnicPageChange = ethnicPageChange;
        vm.graduationPageChange = graduationPageChange;
        vm.nationPageChange = nationPageChange;
        vm.regionPageChange = regionPageChange;
        vm.religionPageChange = religionPageChange;
        vm.specialPlanPageChange = specialPlanPageChange;
        vm.unitPageChange = unitPageChange;
        vm.universityPageChange = universityPageChange;
        vm.railwayPageChange = railwayPageChange;
        vm.examinationPageChange = examinationPageChange;
        vm.bachelorDisciplinePageChange = bachelorDisciplinePageChange;
        vm.educationModePageChange = educationModePageChange;

        /* return schools and grades when page is firstly loaded */

        disciplinePageChange();
        enrollmentPageChange();
        ethnicPageChange();
        graduationPageChange();
        nationPageChange();
        regionPageChange();
        religionPageChange();
        specialPlanPageChange();
        unitPageChange();
        universityPageChange();
        railwayPageChange();
        examinationPageChange();
        bachelorDisciplinePageChange();
        educationModePageChange();

        //--------------------------------------------------------------------------------

        function railwayPageChange() {
            ecnuMetaDataDao.getRailwayByPage(vm.currentPage[0] - 1, vm.numPerPage,
                function (response) {
                    vm.railwayTotalItems = response.totalElements;
                    vm.railwaysByPage = response.content;
                });
        }

        function disciplinePageChange() {
            ecnuMetaDataDao.getDisciplineByPage(vm.currentPage[1] - 1, vm.numPerPage,
                function (response) {
                    vm.disciplineTotalItems = response.totalElements;
                    vm.disciplinesByPage = response.content;
                    for(var i = 0; i<vm.disciplinesByPage.length; i++){
                        if(vm.disciplinesByPage[i].degreeType==1){
                            vm.disciplinesByPage[i].degreeType = "学术学位";
                        }else{
                            vm.disciplinesByPage[i].degreeType = "专业学位";
                        }

                        if(vm.disciplinesByPage[i].degreeLevel==1){
                            vm.disciplinesByPage[i].degreeLevel = "硕士";
                        }else if(vm.disciplinesByPage[i].degreeLevel==2){
                            vm.disciplinesByPage[i].degreeLevel = "博士";
                        }else if(vm.disciplinesByPage[i].degreeLevel==12){
                            vm.disciplinesByPage[i].degreeLevel = "硕博";
                        }
                    }
                });
        }

        function enrollmentPageChange() {
            ecnuMetaDataDao.getEnrollmentByPage(vm.currentPage[2] - 1, vm.numPerPage,
                function (response) {
                    vm.enrollmentTotalItems = response.totalElements;
                    vm.enrollmentsByPage = response.content;
                });
        }

        function ethnicPageChange() {
            ecnuMetaDataDao.getEthnicByPage(vm.currentPage[3] - 1, vm.numPerPage,
                function (response) {
                    vm.ethnicTotalItems = response.totalElements;
                    vm.ethnicsByPage = response.content;
                });
        }

        function examinationPageChange() {
            ecnuMetaDataDao.getExaminationByPage(vm.currentPage[4] - 1, vm.numPerPage,
                function (response) {
                    vm.examinationTotalItems = response.totalElements;
                    vm.examinationsByPage = response.content;
                });
        }

        function bachelorDisciplinePageChange() {
            ecnuMetaDataDao.getBachelorDisciplineByPage(vm.currentPage[5] - 1, vm.numPerPage,
                function (response) {
                    vm.bachelorDisciplineTotalItems = response.totalElements;
                    vm.bachelorDisciplinesByPage = response.content;
                });
        }

        function graduationPageChange() {
            ecnuMetaDataDao.getGraduationByPage(vm.currentPage[6] - 1, vm.numPerPage,
                function (response) {
                    vm.graduationTotalItems = response.totalElements;
                    vm.graduationsByPage = response.content;
                });
        }

        function nationPageChange() {
            ecnuMetaDataDao.getNationByPage(vm.currentPage[7] - 1, vm.numPerPage,
                function (response) {
                    vm.nationTotalItems = response.totalElements;
                    vm.nationsByPage = response.content;
                });
        }

        function regionPageChange() {
            ecnuMetaDataDao.getRegionByPage(vm.currentPage[8] - 1, vm.numPerPage,
                function (response) {
                    vm.regionTotalItems = response.totalElements;
                    vm.regionsByPage = response.content;
                });
        }

        function religionPageChange() {
            ecnuMetaDataDao.getReligionByPage(vm.currentPage[9] - 1, vm.numPerPage,
                function (response) {
                    vm.religionTotalItems = response.totalElements;
                    vm.religionsByPage = response.content;
                });
        }

        function specialPlanPageChange() {
            ecnuMetaDataDao.getSpecialPlanByPage(vm.currentPage[10] - 1, vm.numPerPage,
                function (response) {
                    vm.specialPlanTotalItems = response.totalElements;
                    vm.specialPlansByPage = response.content;
                });
        }

        function unitPageChange() {
            ecnuMetaDataDao.getUnitByPage(vm.currentPage[11] - 1, vm.numPerPage,
                function (response) {
                    vm.unitTotalItems = response.totalElements;
                    vm.unitsByPage = response.content;
                });
        }

        function universityPageChange() {
            ecnuMetaDataDao.getUniversityByPage(vm.currentPage[12] - 1, vm.numPerPage,
                function (response) {
                    vm.universityTotalItems = response.totalElements;
                    vm.universitysByPage = response.content;
                    for(var i = 0; i < vm.universitysByPage.length; i++){
                        if(vm.universitysByPage[i].is211==true){
                            vm.universitysByPage[i].is211="是";
                        }else{
                            vm.universitysByPage[i].is211="否";
                        }
                        if(vm.universitysByPage[i].is985==true){
                            vm.universitysByPage[i].is985="是";
                        }else{
                            vm.universitysByPage[i].is985="否";
                        }
                    }
                });
        }

        function educationModePageChange() {
            ecnuMetaDataDao.getEducationModeByPage(vm.currentPage[13] - 1, vm.numPerPage,
                function (response) {
                    vm.educationModeTotalItems = response.totalElements;
                    vm.educationModesByPage = response.content;
                });
        }

    }
})();
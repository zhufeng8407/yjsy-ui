/**
 * 元数据查询的类
 * @author xiafan
 * @date 16-9-9.
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service('ecnuMetaDataDao', ['EcnuConnection', 'QUERY_PARAMS', ecnuMetaDataDao]);

    function ecnuMetaDataDao(conn, QUERY_PARAMS) {
        var vm = this;
        var BASE_URL = "metadata/";

        vm.getEthnic = getEthnic;

        vm.getReligion = getReligion;
        vm.getAdmission = getAdmission;
        vm.getExamineeOrigin = getExamineeOrigin;
        vm.getEnrollment = getEnrollment;
        vm.getSpecialPlan = getSpecialPlan;
        vm.getGrade = getGrade;
        vm.getDegree = getDegree;
        vm.getTerm = getTerm;//学期
        vm.getRegYear = getRegYear;//学年
        vm.getDegreeType = getDegreeType;
        vm.getUniversity = getUniversity;
        vm.getUniversityIdNameCode = getUniversityIdNameCode;
        vm.getFeeSystem = getFeeSystem;
        vm.getGraduateType = getGraduateType;
        vm.getPoorLevels = getPoorLevels;

        vm.getNation = getNation;
        vm.getGender = getGender;
        vm.getRegion = getRegion;//TODO: checkout the usage
        vm.getRegionState = getRegionState;
        vm.getRegionCounty = getRegionCounty;
        vm.getRegionCity = getRegionCity;

        vm.getUnit = getUnit;//TODO: checkout the usage
        vm.getUnitSchool = getUnitSchool;
        vm.getUnitDepartment = getUnitDepartment;

        vm.getDisciplineCategory = getDisciplineCategory;
        vm.getDisciplineMajor = getDisciplineMajor;
        vm.getMinorsOfMajor = getMinorsOfMajor;

        vm.getStatusChangeType = getStatusChangeType;

        /* 单个新生导入增加的元数据查询 */
        vm.getSsnType = getSsnType;
        vm.getPrestudyUnitNature = getPrestudyUnitNature;
        vm.getExamination = getExamination;
        vm.getGraduation = getGraduation;

        vm.getBachelorDiscipline = getBachelorDiscipline;
        vm.getBachelorDisciplineMajor = getBachelorDisciplineMajor;
        vm.getBachelorDisciplineMinor = getBachelorDisciplineMinor;
        vm.getUndergradudateDisciplineMajor = getUndergradudateDisciplineMajor;
        vm.getUndergradudateDisciplineMinor = getUndergradudateDisciplineMinor;

        vm.getMarriage = getMarriage;
        vm.getEducationMode = getEducationMode;
        vm.getEducation = getEducation;
        vm.getMilitary = getMilitary;

        /* 包含分页的元数据查询 */
        vm.getRailwayByPage = getRailwayByPage;
        vm.getDisciplineByPage = getDisciplineByPage;
        vm.getEnrollmentByPage = getEnrollmentByPage;
        vm.getEthnicByPage = getEthnicByPage;
        vm.getExaminationByPage = getExaminationByPage;
        vm.getGraduationByPage = getGraduationByPage;
        vm.getNationByPage = getNationByPage;
        vm.getRegionByPage = getRegionByPage;
        vm.getReligionByPage = getReligionByPage;
        vm.getSpecialPlanByPage = getSpecialPlanByPage;
        vm.getUnitByPage = getUnitByPage;
        vm.getUniversityByPage = getUniversityByPage;
        vm.getEducationModeByPage = getEducationModeByPage;
        vm.getBachelorDisciplineByPage = getBachelorDisciplineByPage;

        //新加的获取Railway的车站
        vm.getRailwayState = getRailwayState;
        vm.getRailwayStation = getRailwayStation;

        vm.getDegreeLevel = getDegreeLevel;
        vm.getDegreeType = getDegreeType;

        vm.getXueJiModifyField=getXueJiModifyField

        //增加是否统招
        vm.getBoolean = getBoolean;
        vm.getMedical = getMedical;

        vm.findBachelorDisciplineMinor = findBachelorDisciplineMinor;
        vm.findBachelorDisciplineMajor = findBachelorDisciplineMajor;

        vm.getCampus = getCampus;

        function getCampus(callback) {
            conn.get(BASE_URL + "campus", {}, callback);
        }

        function findBachelorDisciplineMajor(categoryCode, callback) {
            conn.get(BASE_URL + "bachelor-discipline-major", {categoryCode: categoryCode}, callback);
        }

        function findBachelorDisciplineMinor(majorCode, callback) {
            conn.get(BASE_URL + "bachelor-discipline-minor", {majorCode: majorCode}, callback);
        }

        function getMedical(callback) {
            conn.get(BASE_URL + "medical", {}, callback);
        }

        //获取图片
        vm.getImage = getImage;
        function getBoolean(callback) {
            callback([
                         {name: "是", id: true}, {name: '否', id: false}
                     ]);
        }

        function getDegreeType(callback) {
            conn.get(BASE_URL + "degree-type", {}, callback);
        }

        function getDegreeLevel(callback) {
            conn.get(BASE_URL + "degree-level", {}, callback);
        }

        function getGender(callback) {
            conn.get(BASE_URL + "gender", {}, callback);
        }

        //新加的预毕业部分的API
        vm.getMetadataAPIMapping = getMetadataAPIMapping;

        function getMilitary(callback) {
            conn.get(BASE_URL + "military", {}, callback);
        }

        function getMetadataAPIMapping(callback) {
            conn.get(BASE_URL + "api-mapping", {}, callback);
        }

        function getRailwayState(callback) {
            conn.get(BASE_URL + "railway-state", {}, callback);
        }

        function getRailwayStation(state, callback) {
            conn.get(BASE_URL + "railway-station", {'state': state}, callback);
        }

        function getPoorLevels(callback) {
            callback([
                         {key: "是", value: true}, {key: '否', value: false}
                     ]);
        }

        function getGrade(callback) {
            //FIXME: currently we only return the past 10 grades, in the future we may fetch the data from backend
            var grades = [];
            var date = new Date();
            for (var i = 0; i < 20; i++) {
                grades.push(date.getYear() + 1900 - i + "");
            }
            callback(grades);
        }

        //注册学年
        function getRegYear(callback) {
            var years = [];
            var year = new Date();
            for (var i = 0; i < 10; i++) {
                var schoolYear = (year.getYear() + 1899 - i) + "-" + (year.getYear() + 1900 - i);
                years.push(schoolYear + "");
            }
            callback(years);
        }

        //学期
        function getTerm(callback) {
            var terms = [1, 2];
            callback(terms);
        }

        function getDegree(callback) {
            conn.get(BASE_URL + "degree", {}, callback);
        }

        function getEthnic(callback) {
            conn.get(BASE_URL + "ethnic", {}, callback);
        }

        function getNation(callback) {
            conn.get(BASE_URL + "nation", {}, callback);
        }

        function getReligion(callback) {
            conn.get(BASE_URL + "religion", {}, callback);
        }

        //入学方式
        function getAdmission(callback) {
            conn.get(BASE_URL + "admission", {}, callback);
        }

        //考生来源
        function getExamineeOrigin(callback) {
            conn.get(BASE_URL + "examinee-origin", {}, callback);
        }

        //录取类别
        function getEnrollment(callback) {
            conn.get(BASE_URL + "enrollment", {}, callback);
        }

        //专项计划
        function getSpecialPlan(callback) {
            conn.get(BASE_URL + "special-plan", {}, callback);
        }

        //大毕院校
        function getUniversity(callback) {
            conn.get(BASE_URL + "university", {}, callback);
        }

        //大毕院校id和name和code
        function getUniversityIdNameCode(bachelorUnitName, callback) {
            conn.get(BASE_URL + "universityIdNameCode", {'bachelorUnitName':bachelorUnitName}, callback);
        }

        //学费
        function getFeeSystem(callback) {
            conn.get(BASE_URL + "feeSystem", {}, callback);
        }

        //毕业类型
        function getGraduateType(callback) {
            conn.get(BASE_URL + "graduateType", {}, callback);
        }

        //异动类型
        function getStatusChangeType(callback) {
            conn.get(BASE_URL + "statusChangeType", {}, callback);
        }

        //证件类型码
        function getSsnType(callback) {
            conn.get(BASE_URL + "ssn-type", {}, callback);
        }

        /*以下为学科与学位表相关的服务API*/
        function getDisciplineCategory(callback) {
            conn.get(BASE_URL + "discipline-category", {}, callback);
        }

        function getDisciplineMajor(categoryCode, callback) {
            conn.get(BASE_URL + 'discipline-major', {'categoryCode': categoryCode}, callback);
        }

        function getMinorsOfMajor(majorCode, callback) {
            conn.get(BASE_URL + 'discipline-minor', {'majorCode': majorCode}, callback);
        }

        function getBachelorDisciplineMajor(categoryCode, callback) {
            conn.get(BASE_URL + 'bachelor-discipline-major', {'categoryCode': categoryCode}, callback);
        }

        function getBachelorDisciplineMinor(majorCode, callback) {
            conn.get(BASE_URL + 'bachelor-discipline-minor', {'majorCode': majorCode}, callback);
        }

        function getUndergradudateDisciplineMajor(categoryCode, callback) {
            conn.get(BASE_URL + 'bachelor-discipline-major', {'categoryCode': categoryCode}, callback);
        }

        function getUndergradudateDisciplineMinor(majorCode, callback) {
            conn.get(BASE_URL + 'bachelor-discipline-minor', {'majorCode': majorCode}, callback);
        }

        /*以下为院系相关的API*/

        function getUnitSchool(callback) {
            conn.get(BASE_URL + 'unit-school', {}, callback);
        }

        function getUnitDepartment(schoolCode, callback) {
            conn.get(BASE_URL + 'unit-department', {"schoolCode":schoolCode}, callback);
        }

        function getUnit(callback) {
            conn.get(BASE_URL + 'unit', {}, callback);
        }

        /*以下为地域相关的服务接口*/
        function getRegion(callback) {
            conn.get(BASE_URL + 'region', {}, callback);
        }

        function getRegionState(callback) {
            conn.get(BASE_URL + "region-state", {}, callback);
        }

        function getRegionCity(stateCode, callback) {
            conn.get(BASE_URL + "region-city", {'stateCode': stateCode}, callback);
        }

        function getRegionCounty(cityCode, callback) {
            conn.get(BASE_URL + "region-county", {'cityCode': cityCode}, callback);
        }

        function getPrestudyUnitNature(callback) {
            conn.get(BASE_URL + "prestudy", {}, callback);
        }

        function getExamination(callback) {
            conn.get(BASE_URL + "examination", {}, callback);
        }

        function getGraduation(callback) {
            conn.get(BASE_URL + "graduation", {}, callback);
        }

        function getBachelorDiscipline(callback) {
            conn.get(BASE_URL + "bachelor-discipline", {}, callback);
        }

        function getMarriage(callback) {
            conn.get(BASE_URL + "marriage", {}, callback);
        }

        function getEducationMode(callback) {
            conn.get(BASE_URL + "education-mode", {}, callback);
        }

        function getEducation(callback) {
            conn.get(BASE_URL + "education", {}, callback);
        }

        /*以下为分页相关的服务接口*/
        function getRailwayByPage(page, size, callback) {
            conn.get(BASE_URL + "railway-by-page", {page: page, size: size}, callback);
        }

        function getDisciplineByPage(page, size, callback) {
            conn.get(BASE_URL + "discipline-by-page", {page: page, size: size}, callback);
        }

        function getEnrollmentByPage(page, size, callback) {
            conn.get(BASE_URL + "enrollment-by-page", {page: page, size: size}, callback);
        }

        function getEthnicByPage(page, size, callback) {
            conn.get(BASE_URL + "ethnic-by-page", {page: page, size: size}, callback);
        }

        function getExaminationByPage(page, size, callback) {
            conn.get(BASE_URL + "examination-by-page", {page: page, size: size}, callback);
        }

        function getBachelorDisciplineByPage(page, size, callback) {
            conn.get(BASE_URL + "bachelor-discipline-by-page", {page: page, size: size}, callback);
        }

        function getGraduationByPage(page, size, callback) {
            conn.get(BASE_URL + "graduation-by-page", {page: page, size: size}, callback);
        }

        function getNationByPage(page, size, callback) {
            conn.get(BASE_URL + "nation-by-page", {page: page, size: size}, callback);
        }

        function getRegionByPage(page, size, callback) {
            conn.get(BASE_URL + "region-by-page", {page: page, size: size}, callback);
        }

        function getReligionByPage(page, size, callback) {
            conn.get(BASE_URL + "religion-by-page", {page: page, size: size}, callback);
        }

        function getSpecialPlanByPage(page, size, callback) {
            conn.get(BASE_URL + "special-plan-by-page", {page: page, size: size}, callback);
        }

        function getUnitByPage(page, size, callback) {
            conn.get(BASE_URL + "unit-by-page", {page: page, size: size}, callback);
        }

        function getUniversityByPage(page, size, callback) {
            conn.get(BASE_URL + "university-by-page", {page: page, size: size}, callback);
        }

        function getEducationModeByPage(page, size, callback) {
            conn.get(BASE_URL + "education-mode-by-page", {page: page, size: size}, callback);
        }


        function getXueJiModifyField(callback) {
            conn.get(BASE_URL + "xueji-modify-field", {}, callback);
        }

        function getImage(imagePath, callback) {
            conn.get(BASE_URL + "image", {imagePath: imagePath}, callback,
                     {responseType: 'arraybuffer'});
        }

    }
})();
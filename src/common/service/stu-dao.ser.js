/**
 * @author xiafan
 * @namespace ecnuUtils
 * @desc 相关的共用服务模块
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuStudentDao", ['EcnuConnection', 'QUERY_PARAMS', ecnuStudentDao]);

    /**
     * @author xiafan
     * @namespace ecnuStudentDao
     * @desc 用于访问学生信息的服务
     */
    function ecnuStudentDao(conn, QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "xj/students";

        vm.getStudentBySno = getStudentBySno;
        vm.getBriefInfo = getBriefInfo;
        vm.searchStudents = searchStudents;
        vm.getByPage = getByPage; //查询学籍表

        vm.newStudent = newStudent;
        vm.updateStudent = updateStudent;
        vm.createStudent = createStudent;
        vm.batchUpdate = batchUpdate;
        vm.importNewStudents = importNewStudents;

        vm.searchMyStudents = searchMyStudents; //查询导师所有的学生信息

        function searchMyStudents(page, size, conds, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = conds;
            conn.get(BASE_URL + "/profile", param, callback);
        }

        // 上传文件批量导入新生
        function importNewStudents(file, success, progress) {
            conn.upload(BASE_URL, {"file": file}, success, progress);
        }


        function getBriefInfo(sno, callback) {
            conn.get(BASE_URL + "/" + sno + "/profile", {}, callback);
        }

        function getByPage(page, size, condition, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = condition;
            conn.get(BASE_URL, param, callback);
        }

        function getStudentBySno(sno, callback) {
            conn.get(BASE_URL + "/" + sno, {}, callback);
        }

        function updateStudent(sno, student, callback) {
            conn.putByRequestBody(BASE_URL + "/" + sno, {'student': student}, callback);
        }

        function createStudent(student, callback) {
            conn.post(BASE_URL, {'student': student}, callback);
        }

        function searchStudents(page, size, conds, callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            param[QUERY_PARAMS.CONDITION] = conds;
            conn.get(BASE_URL + "/profile", param, callback);
        }

        function batchUpdate(file, success, progress) {
            conn.upload(BASE_URL, file, success, progress);
        }

        function newStudent() {
            var student = {};
            student.ssnType = {};
            student.ethnic = {};
            student.gender = {};
            student.marriage = {};
            student.military = {};
            student.religion = {};
            student.hometown = {};
            student.birthplace = {};
            student.residence = {};
            student.family = {};
            student.railway = {};
            student.examineeArchive = {};
            student.preStudyUnitNature = {};
            student.preStudy = {};
            student.degreeLevel = {};
            student.degreeType = {};
            student.educationMode = {};
            student.campus = {};
            student.discipline = {};
            student.unit = {};
            student.medical = {};
            student.examination = {};
            student.specialPlan = {};
            student.enrollment = {};
            student.directedRegion = {};
            student.graduation = {};
            student.examineeOrigin = {};
            student.bachelorUnit = {};
            student.bachelorDiscipline = {};
            student.undergraduateUnit = {};
            student.undergraduateDiscipline = {};
            student.undergraduateMode = {};
            student.masterUnit = {};
            student.masterDiscipline = {};
            student.masterMode = {};
            student.postgraduateUnit = {};
            student.postgraduateDiscipline = {};
            student.postgraduateMode = {};
            student.finalDegree = {};
            student.finalEducation = {};
            student.finalEducationMode = {};
            student.birthdate = new Date();
            student.leaveDate = new Date();
            student.archiveDate = new Date();
            student.insuranceDate = new Date();
            student.admissionDate = new Date();
            student.actualGraduationDate = new Date();
            student.expectedGraduationDate = new Date();
            student.pregraduationDate = new Date();
            student.grantedDegreeDate = new Date();
            student.bachelorDate = new Date();
            student.undergradudateDate = new Date();
            student.masterDate = new Date();
            student.postgraduateDate = new Date();
            student.finalEducationDate = new Date();
            return student;
        }
    }
})();
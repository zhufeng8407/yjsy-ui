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
        var SINGLE_STUDENT = "xj/students/{sno}";

        vm.getStudentBySno = getStudentBySno;
        vm.getBriefInfo = getBriefInfo;
        vm.updateStudent = updateStudent;
        vm.createStudent = createStudent;
        vm.searchStudents = searchStudents;
        vm.getByPage = getByPage; //查询学籍表

        vm.newStudent = newStudent;
        vm.batchUpdate = batchUpdate;
        vm.importNewStudents = importNewStudents;

        // 上传文件批量导入新生
        function importNewStudents(file, success, progress) {
            conn.upload(BASE_URL, {"file":file}, success, progress);
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
            // conn.post('xj/student-load/save-single-student', {'json': student}, callback);
            conn.put(BASE_URL + "/" + sno, {'student': student}, callback);
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
            student.hometown = "1";
            student.nation = "44";
            student.ethnic = "1";
            student.ssnType = "1";
            student.gender = "1";
            student.marriage = "1";
            student.military = "1";
            student.religion = "13";
            student.prestudyUnitNature = "3";
            student.isNew = "true";
            student.degreeType = "1";
            student.degreeLevel = "1";
            student.isAdmissionUnified = "true";
            student.studyMode = "1";
            student.isCheckin = "false";
            student.isRegister = "false";
            student.isFee = "false";
            student.campus = "1";
            student.feeShallPay = "0";
            student.feeTotal = "0";
            student.feeTimes = "0";
            student.feeTotal2 = "0";
            student.medical = "1";
            student.diplomaStatus = "false";
            student.leaveStatus = "false";
            student.archiveStatus = "false";
            student.term = "0";
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
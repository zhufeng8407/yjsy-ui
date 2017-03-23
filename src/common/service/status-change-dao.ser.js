/**
 * @author xiafan
 * @author zhufeng
 * @date 16-9-18.
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service('ecnuStatusChangeDao', ['EcnuConnection', ecnuStatusChangeDao]);
    function ecnuStatusChangeDao(conn) {
        var vm = this;
        var BASE_URL = "yd/request/";
        var AUDIT_BASE_URL = "yd/audit/";

        vm.save = save;
        vm.getRequestBySno = getRequestBySno;
        vm.getAuditByRequestID = getAuditByRequestID;
        vm.searchStatusChange = searchStatusChange;
        vm.acceptStatusChange = acceptStatusChange;
        vm.rejectStatusChange = rejectStatusChange;
        vm.searchStatusChangeAudits = searchStatusChangeAudits;

        function save(request, callback) {
            var requestRecord = {};
            requestRecord ['dl'] = request.major;
            requestRecord ['xl'] = request.minor;
            requestRecord ['xh'] = request.sno;
            requestRecord ['ly'] = request.reason;
            requestRecord ['term'] = request.term;
            requestRecord ['earlyGraduationTerm'] = request.earlyGraduationTerm;
            requestRecord ['staff'] = request.supervisor;
            requestRecord ['disciplineCategoryCode'] = request.disciplineCategoryCode;
            requestRecord ['disciplineMajorCode'] = request.disciplineMajorCode;
            requestRecord ['discipline'] = request.discipline;
            requestRecord ['transmitdate'] = request.transmitdate;
            requestRecord ['leaveDateFrom'] = request.leaveDateFrom;
            requestRecord ['leaveDateTo'] = request.leaveDateTo;
            requestRecord ['unit'] = request.unit;
            var param = {};
            param['selCondition'] = requestRecord;
            conn.post(BASE_URL + "save", param, callback);
        }

        function getRequestBySno(sno, callback) {
            conn.get(BASE_URL + "get-by-sno", {"sno": sno}, callback)
        }

        function getAuditByRequestID(reqID, callback) {
            conn.get(AUDIT_BASE_URL + "get-by-reqid", {"reqID": reqID}, callback)
        }

        function searchStatusChange(page, size, con, callback) {
            conn.get(AUDIT_BASE_URL + "query", {page: page, size: size, condition: con}, callback);
        }

        function acceptStatusChange(auditRecord, callback) {
            conn.post(AUDIT_BASE_URL + "accept", {"auditRecord": auditRecord}, callback);
        }

        function rejectStatusChange(auditRecord, callback) {
            conn.post(AUDIT_BASE_URL + "reject", {'auditRecord': auditRecord}, callback);
        }

        function searchStatusChangeAudits(auditRecord, callback) {
            conn.post(AUDIT_BASE_URL + "searchStatusChangeAudits", {'auditRecord': auditRecord}, callback);
        }

    }
})();
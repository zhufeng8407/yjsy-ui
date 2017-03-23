/**
 * Created by xiafan on 16-9-18.
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
            var selCondition = {};
            selCondition ['dl'] = request.major;
            selCondition ['xl'] = request.minor;
            selCondition ['xh'] = request.sno;
            selCondition ['ly'] = request.reason;
            selCondition ['term'] = request.term;
	       selCondition ['earlyGraduationTerm'] = request.earlyGraduationTerm;
	       selCondition ['staff'] = request.supervisor;
	       selCondition ['disciplineCategoryCode'] = request.disciplineCategoryCode;
	       selCondition ['disciplineMajorCode'] = request.disciplineMajorCode;
	       selCondition ['discipline'] = request.discipline;
	       selCondition ['transmitdate'] = request.transmitdate;
	       selCondition ['leaveDateFrom'] = request.leaveDateFrom;
	       selCondition ['leaveDateTo'] = request.leaveDateTo;
           selCondition ['unit'] = request.unit;
            var param = {};
            param['selCondition'] = selCondition;
            conn.post(BASE_URL + "save", param, callback);
        }

        // function save(request, callback) {
        //     conn.post(BASE_URL + "save", request, callback);
        // }

        /**function save(conds, callback) {
            conn.post(BASE_URL + "save", {"selCondition ":conds}, callback);

        }**/

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
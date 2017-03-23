(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuYbyDao", ["EcnuConnection",'QUERY_PARAMS', ecnuYbyDao]);
    function ecnuYbyDao(conn,QUERY_PARAMS) {
        var vm = this;

        var BASE_URL = "yby";

        vm.submitApply = submitApply;
        vm.submitConfig = submitConfig;
        vm.getAuditData = getAuditData;
        vm.isPassAudit = isPassAudit;
        vm.getCurStudent = getCurStudent;
        vm.itialize = itialize;
        vm.confirm = confirm;
        vm.applyReturn= applyReturn;
        vm.conditionalSearch = conditionalSearch;
        vm.getConfigInfo = getConfigInfo;
        
        function getConfigInfo(callback) {
            conn.get(BASE_URL+"/config-info",{},callback);
        }

        function conditionalSearch(conditions,page,size,callback) {
            conn.get(BASE_URL+"/search-condition",{conditions:conditions,page:page,size:size},callback);
        }

        function applyReturn(sno,callback) {
            conn.post(BASE_URL + "/" + sno + "/return",{},callback);
        }

        function confirm(sno,callback) {
            conn.post(BASE_URL + "/" + sno + "/confirm",{},callback);
        }

        function itialize(day,callback) {
            conn.post(BASE_URL + "/itialize",{day:day},callback);
        }

        function getCurStudent(sno,callback) {
            conn.get(BASE_URL + "/" + sno + "/current",{}, callback);
        }

        //学生提交申请
        function submitApply(sno,apply,callback) {
            var param = {};
            param[QUERY_PARAMS.APPLY] = apply;
            conn.post(BASE_URL + "/" + sno + "/submit",param,callback);
        }


        //管理员提交配置修改
        function submitConfig(apply,callback) {
            conn.put(BASE_URL+"/submit-config",{apply:apply},callback);
        }

        //管理员获取申请数据 呜呜这个的分页
        function getAuditData(page,size,callback) {
            var param = {};
            param[QUERY_PARAMS.PAGE] = page;
            param[QUERY_PARAMS.PAGE_SIZE] = size;
            conn.get(BASE_URL+"/get-auditdata",param,callback);
        }

        //管理员审核申请
        function isPassAudit(id,sno,accountId,flag,callback) {
            var param = {};
            param[QUERY_PARAMS.ID] = id;
            param[QUERY_PARAMS.STUDENT_NO] = sno;
            param[QUERY_PARAMS.ACCOUNT_ID] = accountId;
            param[QUERY_PARAMS.Flag] = flag;
            conn.put(BASE_URL + "/pass-audit",param,callback);
        }


    }

})();
/**
 * @author xiafan
 * @date 16/12/24.
 */

(function () {
    //额外定义这个module,只是为了保证它在所有其它文件之前被引用
    var config = angular.module('ecnuConfig', []);

    /* 以下代码在加载当前js文件后执行，这样可以获得当前js代码的位置 */
    var scripts = document.getElementsByTagName("script");
    scripts = scripts[scripts.length - 1].src;
    var ROOT_PATH = scripts.substring(0, scripts.lastIndexOf('/'));
    ROOT_PATH = ROOT_PATH.substring(0, ROOT_PATH.lastIndexOf('/'));

    var ENDPOINTS = {
        ROOT_PATH: ROOT_PATH,
        SERVICE_API_ROOT: "http://localhost:8888/api/",
        LOGIN_PAGE: ROOT_PATH + "/login/login.html",
        CHOOSE_IDENTITY: ROOT_PATH + "/login/choose-identity.html",
        STATIC_PATH: "http://localhost:8888"
    };
    Object.freeze(ENDPOINTS);
    config.constant("ENDPOINTS",ENDPOINTS);

    //定义页面功能类型
    var PAGE_TYPE = {
        UNIVERSITY: "校级管理",
        SCHOOL: "院系(一级)管理",
        DEPARTMENT: "院系(二级)管理",
        TEACHER: "老师",
        STUDENT: "学生"
    };
    Object.freeze(PAGE_TYPE);
    config.constant("PAGE_TYPE", PAGE_TYPE);

    var PAGE_URL_MAPPING = {};
    PAGE_URL_MAPPING[PAGE_TYPE.UNIVERSITY] = ROOT_PATH + "/department/index.html";
    PAGE_URL_MAPPING[PAGE_TYPE.SCHOOL] = ROOT_PATH + "/department/index.html";
    PAGE_URL_MAPPING[PAGE_TYPE.DEPARTMENT] = ROOT_PATH + "/department/index.html";
    PAGE_URL_MAPPING[PAGE_TYPE.TEACHER] = ROOT_PATH + "/ls/index.html";
    PAGE_URL_MAPPING[PAGE_TYPE.STUDENT] = ROOT_PATH + "/xs/index.html";
    Object.freeze(PAGE_URL_MAPPING);
    config.constant("PAGE_URL_MAPPING", PAGE_URL_MAPPING);

    var QUERY_PARAMS = {
        //---------------以下为默认值---------------
        VALUE_SET_ALL: "所有",
        VALUE_STRING_ALL: "所有",

        //---------------以下为参数名---------------
        CONDITION: "condition",
        //以下用于分页
        ITEMS: "items",

        ITEMS_COUNT: "count",

        PAGE_SIZE: "size",

        PAGE: "page",

        //---------------学籍相关---------------
        //学生ID，非学号
        STUDENT_ID: "stuId",

        //学号
        STUDENT_NO: "sno",

        //---------------职工相关---------------

        //职工ID，不是职工号
        STAFF_ID: "staffId",

        //职工号
        STAFF_NO: "staffNo",

        //---------------组织机构相关---------------

        //一级单位编码
        SCHOOL_CODE: "schoolCode",

        //一级单位名称
        SCHOOL_NAME: "schoolName",

        //二级单位编码
        DEPARTMENT_CODE: "departmentCode",

        //二级单位编码
        DEPARTMENT_NAME: "departmentName",

        //导师ID，非职工号
        SUPERVISOR_ID: "supervisorId",

        //---------------权限管理相关---------------
        USERNAME: "username",
        PASSWORD: "password",

        //帐号ID
        ACCOUNT_ID: "accountId",

        //角色id
        ROLE_ID: "roleId",
        ROLE_IDS: "roleIds",

        //角色名
        ROLE_NAME: "roleName",
        ROLE_NAMES: "roleNames",

        //菜单项的ID
        MENU_ID: "pageId",
        MENU_IDS: "pageIds",

        //访问域级别
        DOMAIN_LEVEL: "domainLevel",

        //具体的访问权限列表
        DOMAINS: "domains",

        //校级访问权限
        IS_UNIVERSITY: "isUniversity",

        //---------------困难管理---------------
        DIFF_ID: "diffId",

        DIFF_LEVEL: "diffLevel",

        DIFF_YEAR: "year",

        //---------------考题---------------
        EXAM_ID: "examId",
        EXAM_IDS: "examIds",

        //预毕业
        Flag: "flag",
        APPLY: "apply",
        ID: "id",

        //------通知------
        GROUP_UD: "groupId",
        MESSAGE_ID: "messageId",

        //-------上传文件相关参数---------
        FILE: "file",
        TYPE: "type"
    };
    Object.freeze(QUERY_PARAMS);
    //定义与后端传递的参数名
    config.constant("QUERY_PARAMS", QUERY_PARAMS);


    var QUERY_PARAM_VALUES = {};
})();
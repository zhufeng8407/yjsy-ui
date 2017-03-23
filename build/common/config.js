/**
 * Created by xiafan on 16/12/24.
 */



(function () {
    //额外定义这个module,只是为了保证它在所有其它文件之前被引用
    var config = angular.module('ecnuConfig', []);
    var configuration = {};

    config.constant("QUERY_PARAMS", {
        //--------以下为默认值---------
        "VALUE_SET_ALL":"所有",
        "VALUE_STRING_ALL":"所有",

        //--------以下为参数名---------
        CONDITION: "condition",
        //以下用于分页
        ITEMS: "items",

        ITEMS_COUNT: "count",

        PAGE_SIZE: "size",

        PAGE: "page",

        //----------------------学籍相关---------------------------

        //学生ID，非学号
        STUDENT_ID: "stuId",

        //学号
        STUDENT_NO: "sno",

        //-----------职工相关-------------------

        //职工ID，不是职工号
        STAFF_ID: "staffId",

        //职工号
        STAFF_NO: "staffNo",

        // -----------------组织机构相关--------------

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

        //-------------权限管理相关-----------------
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

        //------------困难管理---------
        DIFF_ID: "diffId",

        DIFF_LEVEL: "diffLevel",

        DIFF_YEAR: "year",

        //------考题------
        EXAM_ID:"examId",
        EXAM_IDS:"examIds",

        //预毕业
        Flag:"flag",
        APPLY:"apply",
        ID:"id",
        EXAM_IDS:"examIds",

        //------通知------
        GROUP_UD:"groupId",
        MESSAGE_ID:"messageId"

    });
})();

//FIXME: 暂时放置在次，将来考虑找第三方库替代
function strFormat(args) {
    if (arguments.length>0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg=new RegExp ("({"+key+"})","g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if(arguments[i]==undefined)
                {
                    return "";
                }
                else
                {
                    var reg=new RegExp ("({["+i+"]})","g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
}
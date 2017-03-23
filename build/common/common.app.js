/**
 * @author xiafan
 */

var DEPARTMENT_PAGE_TYPE = "研究生院管理";
var SCHOOL_PAGE_TYPE = "院系管理";
var STUDENT_PAGE_TYPE = "学生";
var TEACHER_PAGE_TYPE = "老师";

(function () {
    'use strict';
    /* 以下代码在加载当前js文件后执行，这样可以获得当前js代码的位置 */
    var scripts = document.getElementsByTagName("script");
    scripts = scripts[scripts.length - 1].src;
    var rootPath = scripts.substring(0, scripts.lastIndexOf('/'));
    rootPath = rootPath.substring(0, rootPath.lastIndexOf('/'));

    var utils = angular.module('ecnuUtils',
                               [
                                   'ngCookies', 'ngStorage', 'ui.bootstrap', 'ngFileUpload', 'angular-timeline'
                                   , 'ecnuConfig'
                               ]);

    utils.constant("ROOT_PATH", rootPath);
    utils.constant("SERVICE_API_ROOT", "http://localhost:8888/api/");

    utils.config(['$httpProvider', '$cookiesProvider', 'ROOT_PATH', config]);
    function config($httpProvider, $cookiesProvider, ROOT_PATH) {
        $httpProvider.defaults.withCredentials = true;
        // Set $cookies defaults
        $cookiesProvider.defaults.path = '/';
        // $cookiesProvider.defaults.secure = true;
        // $cookiesProvider.defaults.domain = "";
    }

    function humanReadableError(err) {
        if (err != null) {
            if (err.status == 401) {
                err.reason = "未授权访问！";
            } else if (err.status == 403) {
                err.reason = "非法访问！";
            } else if (err.status == 404) {
                err.reason = "服务不存在，请联系管理员！";
            } else if (err.status == 500) {
                err.reason = "服务器内部错误，请联系管理员！";
            }
        }
    }

    function displayErrorMsg(key, err) {
        if (err[key] == null) {
            return "";
        }

        var ret = "";
        if (key == "errorCode") {
            ret += "错误码:";
        } else if (key == "message") {
            ret += "错误原因:";
        }
        ret += err[key] + "</br>";
        return ret;
    }

    utils.run(['$window', '$http', '$uibModal', '$route', 'EcnuConnection', 'PageState', 'PathUtils', run]);
    function run($window, $http, $uibModal, $route, EcnuConnection, PageState, PathUtils) {
        // 下面这行代码用于保证route模块总是能够捕捉到url变化的事件
        $route.reload();

        $http.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
        EcnuConnection.errorHandler = (function (err, status) {
            // FIXME: 目前对于options和preflight请求被403的时候, err为null, status为-1。
            // 但是不能确定是否能够通过这个组合就将用户重定向到登录页面
            var reason = "";
            if (status == -1) {
                reason = "服务无法访问!";
            } else {
                humanReadableError(err);
            }
            if (err == null) {
                reason = "服务无法访问!";
            } else {
                reason = "";
                for (var key in err) {
                    reason += displayErrorMsg(key, err);
                }
            }
            var instance = $uibModal.open({
                                              animation: true,
                                              template: '<div class="panel-warning"><div class="modal-header' +
                                                        ' panel-heading">服务错误</div><div' +
                                                        ' class="modal-body panel-body">' + reason +
                                                        "</div></div>"
                                          });
            instance.result.then(function (res) {
            }, function (res) {
                if (err == null || err.status == 404 || err.status == 401 || err.status == 403) {
                    PageState.clearSession();
                }
            });

        });
    }
})();
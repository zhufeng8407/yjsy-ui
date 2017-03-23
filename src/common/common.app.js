/**
 * @author xiafan
 */

(function () {
    'use strict';

    var utils = angular.module('ecnuUtils',
                               [
                                   'ngCookies', 'ngStorage', 'ui.bootstrap', 'ngFileUpload', 'angular-timeline'
                                   , 'ecnuConfig'
                               ]);

    utils.config(['$httpProvider', '$cookiesProvider', config]);
    function config($httpProvider, $cookiesProvider) {
        $httpProvider.defaults.withCredentials = true;

        // Set $cookies defaults
        $cookiesProvider.defaults.path = '/';
        // $cookiesProvider.defaults.secure = true;
        // $cookiesProvider.defaults.domain = "";
    }

    /**
     * 将http status code转换为对应的字符含义
     * @param err
     */
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

    utils.run(['$window', '$http', '$uibModal', '$route', 'EcnuConnection', 'PageState', 'PathUtils','Prompt', run]);
    function run($window, $http, $uibModal, $route, EcnuConnection, PageState, PathUtils,Prompt) {
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
            var proMessage = {"msg": reason};
            var instance = Prompt.dangerPrompt(proMessage);
            instance.result.then(function (res) {
            }, function (res) {
                if (err == null || err.status == 404 || err.status == 401 || err.status == 403) {
                    PageState.clearSession();
                }
            });

        });
    }
})();
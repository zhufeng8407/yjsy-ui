/**
 * Created by xiafan on 16-9-9.
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');
    utils.service('EcnuConnection', ['$http', 'Upload', 'PathUtils', 'Prompt', '$httpParamSerializerJQLike', EcnuConnection]);
    /**
     * @description 服务器连接的类
     */
    function EcnuConnection($http, Upload, PathUtils, Prompt, $httpParamSerializerJQLike) {
        var conn = {};
        conn.errorHandler = errorHandler;
        conn.post = post;
        conn.get = get;
        conn.delete = deleteImpl;
        conn.patch = patch;
        conn.put = put;
        conn.upload = upload;
        conn.putByRequestBody = putByRequestBody;
        return conn;
        //FIXME: 夏帆： 郁闷，使用data传递参数时，采用这个函数进行调用无法传递data
        function invoke(method, args) {
            var url = args[0];
            var httpCfg = args[1];
            var callback = args[2];
            httpCfg["url"] = PathUtils.qualifiedAPIPath(url);
            httpCfg["method"] = method;
            if (args.length > 3) {
                var additionalCfg = args[3];
                for (var fieldName in additionalCfg) {
                    httpCfg[fieldName] = additionalCfg[fieldName];
                }
            }
            $http(httpCfg).success(function (response) {
                callback(response);
            }).error(conn.errorHandler);
        }
        function post(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("post", arguments)
        }
        function get(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("get", arguments)
        }
        function putByRequestBody(url, params, callback) {
            arguments[1] = {
                data: params
            };
            invoke("put", arguments)
        }
        function put(url, params, callback) {
            arguments[1] = {
                params: $httpParamSerializerJQLike(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            invoke("put", arguments)
        }
        function deleteImpl(url, params, callback) {
            arguments[1] = {
                params: params
            };
            invoke("delete", arguments)
        }
        function patch(url, params, callback) {
            arguments[1] = {
                data: $httpParamSerializerJQLike(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            invoke("patch", arguments)
        }
        function upload(url, param, success, progress) {
            Upload.upload(
                {
                    url: PathUtils.qualifiedAPIPath(url),
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    data: param,
                    method: 'post'
                }).then(success, conn.errorHandler, progress);
        }
    }
    /*default error handle class for the <code>EcnuConnection</code>*/
    function errorHandler(error) {
        Prompt.dangerPrompt({"msg": error});
    }

})();
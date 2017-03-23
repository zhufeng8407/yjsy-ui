/**
 * Created by xiafan on 16-9-9.
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service('EcnuConnection', ['$http', 'Upload', 'PathUtils', EcnuConnection]);
    /**
     * @description 服务器连接的类
     */
    function EcnuConnection($http, Upload, PathUtils) {
        var conn = {};

        conn.errorHandler = errorHandler;

        conn.post = post;
        conn.get = get;
        conn.delete = deleteImpl;
        conn.patch = patch;
        conn.put = put;
        conn.upload = upload;

        return conn;

        //FIXME: 夏帆： 郁闷，使用data传递参数时，采用这个函数进行调用无法传递data
        function invoke(method, args) {
            var url = args[0];
            var httpCfg = {};
            var callback = args[2];
            httpCfg["url"]=PathUtils.qualifiedAPIPath(url);
            httpCfg["method"]=method;
            httpCfg['params'] = args[1];
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
           invoke('post', arguments);
        }

        function get(url, params, callback) {
            invoke('get', arguments);
        }

        function put(url, params, callback) {
            invoke('put', arguments);
        }

        function deleteImpl(url, params, callback) {
            invoke('delete', arguments);
        }

        function patch(url, params, callback) {
            invoke('patch', arguments);
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
        console.log(error);
    }

})();
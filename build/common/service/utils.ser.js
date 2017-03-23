/**
 * @author xiafan
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    /* 操作url路径的一些服务 */
    utils.service('PathUtils', ['$location', 'ROOT_PATH', 'SERVICE_API_ROOT', PathUtils]);
    function PathUtils($location, ROOT_PATH, SERVICE_API_ROOT) {
        var vm = this;

        vm.PAGETYPE_TO_URL = {
            "教师": "/teacher/index.html",
            "院系(一级)管理": "/department/index.html",
            "院系(二级)管理": "/department/index.html",
            "校级管理": "/department/index.html",
            "学生": "/xs/index.html"
        };
        //vm.LOGIN_PAGE =
        // "https://portal1.ecnu.edu.cn/cas/login?service=http://localhost:63342/yjsy-ui/build/login/index.html";
        vm.LOGIN_PAGE = ROOT_PATH + "/login/login.html";
        vm.STATIC_PATH = "http://localhost:8888";

        vm.getRootPath = getRootPath;
        vm.getParentPath = getParentPath;
        vm.qualifiedPath = qualifiedPath;
        vm.qualifiedAPIPath = qualifiedAPIPath;
        vm.qualifiedStaticPath = qualifiedStaticPath;
        vm.removeParams = removeParams;
        vm.getPathFromUrl = getPathFromUrl;
        vm.getURLForPageType = getURLForPageType;

        function getRootPath() {
            return ROOT_PATH;
        }

        function getParentPath(path) {
            return path.substring(0, path.lastIndexOf('/'));
        }

        function qualifiedPath(path) {
            return ROOT_PATH + path;
        }

        function removeParams(path) {
            if (path.lastIndexOf('?') > 0)
                return path.substring(0, curPath.lastIndexOf('?'));
            return path;
        }

        function getPathFromUrl(url) {
            url = url.substring(ROOT_PATH.length, url.length);
            return this.removeParams(url);
        }

        function qualifiedStaticPath(path) {
            if (path.indexOf('/') == 0)
                return vm.STATIC_PATH + path;
            else
                return vm.STATIC_PATH + "/" + path;
        }

        function qualifiedAPIPath(path) {
            return SERVICE_API_ROOT + path;
        }

        function getURLForPageType(pageType) {
            return vm.qualifiedPath(vm.PAGETYPE_TO_URL[pageType]);
        }
    }

    /* 页面之间传递session数据的服务 */
    utils.service('SessionByCookie', ['$cookieStore', SessionByCookie]);
    function SessionByCookie($cookieStore) {
        var vm = this;

        vm.setItem = setItem;
        vm.getItem = getItem;
        vm.remove = remove;

        function setItem(key, value) {
            $cookieStore.put(key, value);
        }

        function getItem(key) {
            return $cookieStore.get(key);
        }

        function remove(key) {
            $cookieStore.remove(key);
        }
    }


    utils.service('LocalStorage', ['$localStorage', LocalStorage]);
    function LocalStorage($localStorage) {
        var vm = this;

        vm.setItem = setItem;
        vm.getItem = getItem;

        function setItem(key, value) {
            $localStorage[key] = value;
        }

        function getItem(key) {
            return $localStorage[key];
        }
    }

    /**导出数据服务**/
    utils.service('FileExport', FileExport);
    function FileExport() {
        this.export = function (data, type, filename) {
            var blob = new Blob([data], {type: type});
            saveAs(blob, filename);
        }
    }

    /**加载图片,常用类型有image/jpeg**/
    utils.service('LoadImage', LoadImage);
    function LoadImage() {
        this.loadImage = function (data, type) {
            var blob = new Blob([data], {type: type});
            return blob;
        }
    }

    utils.service('EcnuCitizenIDValidation', EcnuCitizenIDValidation);
    function EcnuCitizenIDValidation() {
        var vm = this;

        var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];    //十七位数字本体码权重
        var checkSum = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];    //mod11,对应校验码字符值

        this.validate = validate;

        function validate(idNum) {
            if (idNum == null)
                return false;
            if (idNum.length && idNum.length == 18) {
                var sum = 0;
                var mode = 0;
                for (var i = 0; i < 17; i++) {
                    sum = sum + idNum.charAt(i) * weight[i];
                }
                mode = sum % 11;
                return checkSum[mode] == idNum.charAt(17);
            } else
                return false;
        }
    }
})();

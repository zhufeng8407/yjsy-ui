/**
 * @author xiafan
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    /* 操作url路径的一些服务 */
    utils.service('PathUtils', ['PAGE_URL_MAPPING', 'ENDPOINTS', PathUtils]);
    function PathUtils(PAGE_URL_MAPPING, ENDPOINTS) {
        var vm = this;

        vm.getRootPath = getRootPath;
        vm.getParentPath = getParentPath;
        vm.qualifiedPath = qualifiedPath;
        vm.qualifiedAPIPath = qualifiedAPIPath;
        vm.qualifiedStaticPath = qualifiedStaticPath;
        vm.removeParams = removeParams;
        vm.getPathFromUrl = getPathFromUrl;
        vm.getURLForPageType = getURLForPageType;

        function getRootPath() {
            return ENDPOINTS.ROOT_PATH;
        }

        function getParentPath(path) {
            return path.substring(0, path.lastIndexOf('/'));
        }

        function qualifiedPath(path) {
            return  ENDPOINTS.ROOT_PATH + path;
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
                return  ENDPOINTS.STATIC_PATH + path;
            else
                return  ENDPOINTS.STATIC_PATH + "/" + path;
        }

        function qualifiedAPIPath(path) {
            return  ENDPOINTS.SERVICE_API_ROOT + path;
        }

        function getURLForPageType(pageType) {
            return PAGE_URL_MAPPING[pageType];
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

    utils.service("Prompt", ['$uibModal', 'PathUtils', Prompt]);
    function Prompt($uibModal, PathUtils) {
        var vm = this;

        var buttonNames = {"names": ['关闭']};
        var buttons = [
            function () {
            }
        ];

        vm.customPrompt = customPrompt;
        vm.infoPrompt = infoPrompt;
        vm.warningPrompt = warningPrompt;
        vm.dangerPrompt = dangerPrompt;
        vm.successPrompt = successPrompt;
        vm.deletePrompt = deletePrompt;

        function customPrompt(iconType, proMessage, buttons, buttonNames) {
            return $uibModal.open({
                                      animation: true,
                                      templateUrl: PathUtils.qualifiedPath(
                                          "/common/directive/propmtMessage-panel.html"),
                                      controller: 'PromptMessageCtrl',
                                      controllerAs: 'promptMessageCtrl',
                                      windowClass: 'app-modal-window',
                                      resolve: {
                                          iconType: iconType,
                                          proMessage: proMessage,
                                          buttons: function () {
                                              return buttons
                                          },
                                          buttonNames: buttonNames
                                      }
                                  });
        }

        function infoPrompt(proMessage) {
            var type = {'type': 'fa-info-circle'};
            return customPrompt(type, proMessage, buttons, buttonNames);
        }

        function warningPrompt(proMessage) {
            var type = {'type': 'fa-exclamation-triangle'};
            return customPrompt(type, proMessage, buttons, buttonNames);
        }

        function dangerPrompt(proMessage) {
            var type = {'type': 'fa-times-circle'};
            return customPrompt(type, proMessage, buttons, buttonNames);
        }

        function successPrompt(proMessage) {
            var type = {'type': 'fa-check-circle'};
            return customPrompt(type, proMessage, buttons, buttonNames);
        }

        function deletePrompt(proMessage) {
            var type = {'type': 'fa-exclamation-triangle'};
            return customPrompt(type, proMessage, buttons, buttonNames);
        }
    }
})();

/**
 * @author xiafan
 * @namespace ecnuUtils
 * @desc 相关的共用服务模块
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuMenuDao", ecnuMenuDao);

    ecnuMenuDao.$inject = ['EcnuConnection', 'PathUtils', 'ecnuPopularPage'];
    /**
     * @author xiafan
     * @namespace ecnuStudentDao
     * @desc 用于访问学生信息的服务
     */
    function ecnuMenuDao(conn, pathUtils, ecnuPopularPage) {
        var vm = this;

        vm.getMenu = getMenu;
        vm.getPage = getPage;
        vm.searchMenu = searchMenu;

        vm.MENU_API = "auth/menus";

        function getMenu(callback) {
            conn.get(vm.MENU_API + "/granted-pages", {}, function (result) {
                vm.urlHashTable = result.urlHashTable;
                callback(constructMenu(result));
            });
        }

        function searchMenu(keywords, callback) {
            conn.get(vm.MENU_API, {"keywords": keywords}, callback);
        }

        function getPage(callback) {
            conn.get(vm.MENU_API + "", {}, function (result) {
                callback(constructMenu(result));
            });
        }

        function constructMenu(menuObj) {
            var url2MenuItem = {};

            for (var i = 0; i < menuObj.length; i++) {
                menuObj[i].index = i;
                setupTreeAndHashtableIntern(null, menuObj[i], url2MenuItem);
            }

            return {urlHashTable: url2MenuItem, menu: menuObj};

            function setupTreeAndHashtableIntern(parent, current, url2MenuItem) {
                if (current.hasOwnProperty('url')) {
                    current.url = pathUtils.qualifiedPath(current.url);
                    url2MenuItem[current.url] = current;
                }

                current.parent = parent;
                if (current.hasOwnProperty('subMenu')) {
                    for (var i = 0; i < current.subMenu.length; i++) {
                        current.subMenu[i].index = i;
                        setupTreeAndHashtableIntern(current, current.subMenu[i], url2MenuItem);
                    }
                }
            }
        }
    }

})();
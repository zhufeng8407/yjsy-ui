/**
 * 记录用户常用页面的服务
 * @author xiafan
 * @date 16-11-8.
 */

(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("ecnuPopularPage", ['LocalStorage', 'PageState', ecnuPopularPage]);
    function ecnuPopularPage(localStorage, PageState) {
        var vm = this;

        var LAST_ACCESS_DATE = "lastDate";
        var POP_PAGE_LIST = "pops";

        vm.STORAGE_SIZE = 15;
        vm.getFreqMenus = getFreqMenus;
        vm.hitPage = hitPage;

        function getKey() {
            return PageState.getUser().getAccountId() + "." + PageState.getCurPageType();
        }

        function getFreqMenus(urlHashTable) {
            var objs = localStorage.getItem(getKey());

            var cygn = new Object();
            cygn.name = "常用功能";
            cygn.url = "";
            cygn.iconClass = "";
            cygn.subMenu = new Array();

            if (objs != null) {
                objs[LAST_ACCESS_DATE] = new Date();
                var popList = objs[POP_PAGE_LIST];
                for (var i = 0; i < Math.min(popList.length, 5); i++) {
                    var menuObj = urlHashTable[popList[i].url];
                    if (menuObj)
                        cygn.subMenu.push(menuObj);
                }
            }
            return cygn;
        }

        function hitPage(url) {
            var objs = localStorage.getItem(getKey());
            if (objs == null || !objs.hasOwnProperty(LAST_ACCESS_DATE)) {
                objs = {};
                objs[LAST_ACCESS_DATE] = new Date();
                objs[POP_PAGE_LIST] = [];
                localStorage.setItem(getKey(), objs);
            } else {
                objs[LAST_ACCESS_DATE] = new Date();
            }

            var links = objs[POP_PAGE_LIST];
            var hitIdx = -1;
            for (var i = 0; i < links.length; i++) {
                if (links[i].url == url) {
                    links[i].count++;
                    hitIdx = i;
                } else if (links[i].count > 0) {
                    links[i].count--;
                }
            }
            if (hitIdx == -1 && links.length <= vm.STORAGE_SIZE) {
                links.push({"url": url, "count": 1});
                hitIdx = links.length - 1;
            } else if (hitIdx == -1 && links[vm.STORAGE_SIZE - 1].count == 0) {
                links[vm.STORAGE_SIZE] = {"url": url, "count": 1};
                hitIdx = vm.STORAGE_SIZE;
            }

            if (hitIdx > 0) {
                var hitMenu = links[hitIdx];
                while (hitIdx > 0) {
                    if (links[hitIdx].count > links[hitIdx - 1].count) {
                        links[hitIdx] = links[hitIdx - 1];
                        links[hitIdx - 1] = hitMenu;
                    } else {
                        break;
                    }
                    hitIdx--;
                }
            }

            localStorage.setItem(getKey(), objs);
        }
    }
})();
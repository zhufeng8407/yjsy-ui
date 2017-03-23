/**
 * @author xiafan
 * 控制页面相关的状态信息，例如当前用户，访问权限等等
 */
(function () {
    'use strict';
    var utils = angular.module('ecnuUtils');

    utils.service("PageState", ['$cookies', '$window', 'PathUtils', 'ecnuAccountDao', PageState]);
    function PageState($cookies, $window, pathUtils, ecnuAccountDao) {
        var vm = this;

        vm.user = new User();
        vm.pageType = null;
        vm.queryConstraint = null;

        vm.isLogin = isLogin;
        vm.getUser = getUser;
        vm.isPageForNewbie = isPageForNewbie;
        vm.choosePageType = choosePageType;
        vm.getPageTypes = getPageTypes;
        vm.getQueryConstraint = getQueryConstraint;
        vm.logout = logout;
        vm.clearSession = clearSession;
        vm.getCurPageType = getCurPageType;

        function logout() {
            ecnuAccountDao.logout(function (response) {
                vm.clearSession();
            });
        }

        /**
         * 清空前端在session里面保存的session信息
         */
        function clearSession() {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            $window.location.href = pathUtils.LOGIN_PAGE;
        }

        /**
         * 获取权限约束信息，返回的结果中表明了用户可以访问的具体域
         * @returns {null|*}
         */
        function getQueryConstraint() {
            if (vm.queryConstraint == null)
                updateQueryConstaint();
            return vm.queryConstraint;
        }

        /**
         * 判断当前用户是否登录,目前通过cookie判断
         * @returns {boolean}
         */
        function isLogin() {
            return vm.user.getName() != undefined;
        }

        /**
         * 返回当前用户
         * @returns {User}
         */
        function getUser() {
            return vm.user;
        }

        function getCurPageType() {
            return $cookies.getObject('pageType');
        }

        /**
         * 基于用户选择的页面类型，设置当前的活跃角色（包括前端和后端的设置），设置成功之后跳转到相应的功能界面
         * @param pageType
         */
        function choosePageType(pageType) {
            $cookies.putObject('pageType', pageType);
            var activeRoles = [];
            var roles = vm.user.getRoles();


            for (var idx in roles) {
                var role = roles[idx];
                if (getPageTypeOfRole(role) == pageType) {
                    activeRoles.push(role);
                }
            }
            vm.pageType = pageType;
            vm.user.setActiveRoles(activeRoles);
            var roleIdsSet = new Set();
            for (var i = 0; i < activeRoles.length; i++) {
                roleIdsSet.add(activeRoles[i].roleId);
            }
            var roleIdsArray = Array.from(roleIdsSet);
            ecnuAccountDao.setRoles(vm.user.getAccountId(), roleIdsArray, function () {
                updateQueryConstaint();
                $window.location.href = pathUtils.getURLForPageType(pageType);
            });
        }

        /**
         * 根据角色返回可访问的功能页面
         * @param curRole
         * @returns {*}
         */
        function getPageTypeOfRole(curRole) {
            if (curRole.isUniv) {
                return "校级管理";
            } else if (curRole.studentID) {
                return "学生";
            } else if (curRole.facultyID) {
                return "教师";
            } else if (curRole.department) {
                return "院系(二级)管理";
            } else if (curRole.school) {
                return "院系(一级)管理";
            }
        }

        /**
         * 基于当前用户的角色，返回用户可以放到大功能页
         * @returns {Array}
         */
        function getPageTypes() {
            var pageTypes = [];
            var pageToRoles = {};
            var roles = getUser().getRoles();
            for (var roleIdx in roles) {
                var curRole = roles[roleIdx];
                var curPageType = getPageTypeOfRole(curRole);
                if (curPageType in pageToRoles) {
                    if (pageToRoles[curPageType].indexOf(curRole.roleName) == -1)
                        pageToRoles[curPageType].push(curRole.roleName);
                } else {
                    pageToRoles[curPageType] = [curRole.roleName];
                }
            }

            for (var pageType in pageToRoles) {
                pageTypes.push({
                                   "page": pageType,
                                   "roles": pageToRoles[pageType]
                               });
            }
            return pageTypes;
        }

        /**
         * 判断当前页面是不是管理新生的功能
         * @returns {boolean}
         */
        function isPageForNewbie() {
            return $window.location.href.indexOf('xsgl') != -1;
        }

        /**
         * 当前方法返回用户查询时的约束,这些约束在搜索栏里面对可选项进行控制
         */
        function updateQueryConstaint() {
            vm.queryConstraint = {isUniv: false, schools: null, studentID: -1, facultyID: -1};
            var queryConstraint = vm.queryConstraint;
            var COMPLETE_DOMAIN = "所有";

            var activeRoles = vm.user.getActiveRoles();
            for (var idx in activeRoles) {
                var role = activeRoles[idx];
                queryConstraint.isUniv = queryConstraint.isUniv || role.isUniv;
                if (queryConstraint.isUniv)
                    break;
                if (role.school != COMPLETE_DOMAIN) {
                    if (queryConstraint.schools != null && Object.keys(queryConstraint.schools).length == 0) {
                        continue;
                    } else if (queryConstraint.schools == null) {
                        queryConstraint.schools = {};
                        queryConstraint.schools[role.school] = null;
                    }

                    if (role.department && role.department != COMPLETE_DOMAIN) {
                        var curDeparts = queryConstraint.schools[role.school];
                        if (curDeparts != null && Object.keys(curDeparts).length == 0) {
                            continue;
                        } else if (curDeparts == null) {
                            curDeparts = {};
                            curDeparts[role.department] = null;
                            queryConstraint.schools[role.school] = curDeparts;
                        }
                    } else {
                        queryConstraint.schools[role.school] = {};
                    }
                } else if (role.school == COMPLETE_DOMAIN) {
                    queryConstraint.schools = {};
                }
                queryConstraint.studentID = queryConstraint.studentID > role.studentID ?
                    queryConstraint.studentID :
                    role.studentID;
                queryConstraint.facultyID = queryConstraint.facultyID > role.facultyID ?
                    queryConstraint.facultyID :
                    role.facultyID;
            }
        }

        function User() {
            var vm = this;

            vm.setName = setName;
            vm.getName = getName;
            vm.getUserID = getUserID;
            vm.setUserID = setUserID;
            vm.setAccountId = setAccountId;
            vm.getAccountId = getAccountId;
            vm.getRoles = getRoles;
            vm.setRoles = setRoles;
            vm.setActiveRoles = setActiveRoles;
            vm.getActiveRoles = getActiveRoles;

            function setAccountId(accountId) {
                return $cookies.putObject("accountId", accountId);
            }

            function getAccountId() {
                return $cookies.getObject("accountId");
            }

            function getUserID() {
                return $cookies.getObject("userID");
            }

            function setUserID(uid) {
                return $cookies.putObject("userID", uid);
            }

            function getName() {
                return $cookies.getObject("name");
            }

            function setName(name) {
                $cookies.putObject("name", name);
            }

            function getRoles() {
                return $cookies.getObject("roles");
            }

            function setRoles(roles) {
                $cookies.putObject("roles", roles);
            }

            function getActiveRoles() {
                return $cookies.getObject("activeRoles");
            }

            function setActiveRoles(roles) {
                $cookies.putObject("activeRoles", roles);
            }

        }
    }
})();
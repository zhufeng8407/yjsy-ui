/**
 * @author xiafan
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var homeApp = angular.module('teachhome', ['ui.calendar', 'ngRoute', 'ui.bootstrap', 'ecnuUtils']);

    // 设置页面跳转功能
    homeApp.config(config);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'teachhome.htm',
            controller: "TeachHomePageCtrl",
            controllerAs: "teachHomePageCtrl"
        }).when('/my-student.html', {
            templateUrl: 'yd/my-student.view.html',
            controller: "MyStudentCtrl",
            controllerAs: "myStudentCtrl"
        }).when('/ydsh.html', {
            templateUrl: 'yd/ydsh.view.html'
        });
    }

    homeApp.controller('HomeMenuCtrl', HomeMenuCtrl);
    HomeMenuCtrl.$inject = [
        '$scope',
        '$location',
        'ecnuMenuDao',
        'PathUtils',
        'ecnuPopularPage'
    ];
    function HomeMenuCtrl($scope, $location, ecnuMenuDao, pathUtils, ecnuPopularPage) {
        var vm = this;//定义一个引用全局变量的全局对象

        ecnuMenuDao.getMenu(function (result) {
            vm.menu = result.menu;
            vm.urlHashTable = result.urlHashTable;
            ecnuPopularPage.hitPage(pathUtils.removeParams($location.absUrl()));
        });

        $scope.$on('$routeChangeSuccess', function (angularEvent, current, previous) {
            ecnuPopularPage.hitPage(pathUtils.removeParams($location.absUrl()));
        });
    }

    homeApp.controller('HomeContentCtrl', HomeContentCtrl);
    HomeContentCtrl.$inject = [
        'ecnuStaffDao',
        'PageState',
        'ecnuMetaDataDao',
        'LoadImage'
    ];
    function HomeContentCtrl(ecnuStaffDao, PageState, ecnuMetaDataDao, LoadImage) {
        var vm = this;

        ecnuStaffDao.getBriefInfo(PageState.getUser().getUserID(), function (response) {
            vm.staff = response;
            var imagePath;
            // if(vm.student.photo != null && vm.student.photo != "")
            //     imagePath = vm.student.photo;
            // else
            imagePath = "defaultImage.jpg";
            ecnuMetaDataDao.getImage(imagePath, function (res) {
                vm.staffImage = URL.createObjectURL(LoadImage.loadImage(res, "image/jpeg"));
            })
        });

    }
})();
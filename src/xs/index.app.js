/**
 * @author xiafan
 * @description 学生个人主页相关的控制逻辑定义
 */

(function () {
    'use strict';
    var homeApp = angular.module('stuhome', ['ui.calendar', 'ngRoute', 'ui.bootstrap', 'ecnuUtils']);

    // 设置页面跳转功能
    homeApp.config(config);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider.when('/enter-step.html', {
            templateUrl: 'xj/enter-step.html'
        });

        $routeProvider.when('/', {
            templateUrl: 'stuhome.htm',
            controller: "StuHomePageCtrl",
            controllerAs: "stuHomePageCtrl"
        }).when('/enter-exam.html', {
            templateUrl: 'xj/enter-exam.view.html'
        }).when('/xs-info.html', {
            templateUrl: 'xj/stucard.view.html'
        }).when('/status-change-apply.html', {
            templateUrl: 'xj/status-bench.view.html'
        }).when('/yby-check-info.html', {
            templateUrl: 'xj/yby/xs-confirminfo.view.html'
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
        var vm = this;

        ecnuMenuDao.getMenu(function (result) {
            vm.menu = result.menu;
            vm.urlHashTable = result.urlHashTable;
        });

        $scope.$on('$routeChangeSuccess', function (angularEvent, current, previous) {
            var curUrl = pathUtils.removeParams($location.absUrl());
            ecnuPopularPage.hitPage(curUrl);
        });
    }

    homeApp.controller('HomeContentCtrl', HomeContentCtrl);
    HomeContentCtrl.$inject = [
        'ecnuStudentDao',
        'PageState', 'ecnuMetaDataDao','LoadImage'
    ];
    function HomeContentCtrl(ecnuStudentDao, PageState, ecnuMetaDataDao,LoadImage) {
        var vm = this;

        ecnuStudentDao.getBriefInfo(PageState.getUser().getUserID(), function (response) {
            vm.student = response;
            var imagePath;
            if(vm.student.photo != null && vm.student.photo != "")
                imagePath = vm.student.photo;
            else
                imagePath = "defaultImage.jpg";
            ecnuMetaDataDao.getImage(imagePath,function (res) {
                vm.stuImage = URL.createObjectURL(LoadImage.loadImage(res,"image/jpeg"));
            })
        });

    }
})();
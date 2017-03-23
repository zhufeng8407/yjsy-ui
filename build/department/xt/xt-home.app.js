/**
 * @author xiafan
 */

(function () {
    'use strict';
    var ecnuAdminHome = angular.module('ecnuAdminHome', [
        'ecnuUtils', 'ecnuDpHome',
        'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ngRoute', 'treeControl','angularTrix'
    ]);

    ecnuAdminHome.config(config);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            redirectTo: 'zhgl/jsgl.view.html'
        }).when('/zhgl/js-manage.html', {
            templateUrl: 'zhgl/jsgl.view.html'
        }).when('/zhgl/zh-manage.html', {
            templateUrl: 'zhgl/zhgl.view.html'
        }).when('/zhgl/jsym-manage.html', {
            templateUrl: 'zhgl/jsymgl.view.html'
        }).when('/metadata.html', {
            templateUrl: './metadata.view.html',
            controller: 'XsMetadataCtrl',
            controllerAs: 'xsMetadataCtrl'
        }).when('/notification.html',{
            templateUrl:'./notification.view.html',
            controller:'NotificationCtrl',
            controllerAs:'notificationCtrl'
        }).when('/manageNotification.html',{
            templateUrl:'./manageNotification.view.html',
            controller:'ManageNotificationCtrl',
            controllerAs:'manageNotificationCtrl'
        });
    }

    /*
     ecnuAdminHome.controller("accountHomeCtrl", accountHomeCtrl);
     function accountHomeCtrl() {
     var vm = this;
     vm.user = {uid: 1, name: '1'}
     }*/
})();


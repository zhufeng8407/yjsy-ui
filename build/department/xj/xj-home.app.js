/**
 * @author xiafan
 * @author liyanbin
 */

(function () {
    'use strict';
    var xjHomeApp = angular.module('ecnuXueJi', [
        'ecnuUtils', 'ecnuConfig', 'ecnuDpHome', 'ui.bootstrap', 'ngRoute', 'ngAnimate', 'ng-echarts', 'ngFileUpload',
        'ngBootbox', 'angular-sortable-view', 'ngSanitize', 'angular-scroll-animate'
        , 'ngFileSaver'
    ]);

    xjHomeApp.config(config);
    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            redirectTo: '/lsgl/xj-info.html'
        });

        //学籍管理
        $routeProvider.when('/xsgl/add-xs.html', {
            templateUrl: 'xsgl/view/add-xs.view.html'
        }).when('/xsgl/xs-exam.html', {
            templateUrl: 'xsgl/view/xs-exam.view.html'
        }).when('/xsgl/xs-import.html', {
            templateUrl: 'xsgl/view/xs-import.view.html',
            controller: 'XsImportCtrl',
            controllerAs: 'xsImportCtrl'
        }).when('/xsgl/xs-info.html', {
            templateUrl: 'xsgl/view/xs-info.view.html',
            controller: 'XsInfoCtrl',
            controllerAs: "xsInfoCtrl"
        }).when('/xsgl/xs-repo.html', {
            templateUrl: 'xsgl/view/xs-repo.view.html',
            controller: 'XsRepoCtrl',
            controllerAs: "xsRepoCtrl"
        });

        //信息管理
        $routeProvider.when('/lsgl/xj-info.html', {
            templateUrl: 'xsgl/view/xs-info.view.html',
            controller: 'XsInfoCtrl',
            controllerAs: "xsInfoCtrl"
        }).when('/xsgl/xs-poverty.html', {
            templateUrl: 'xsgl/view/xs-difficulty.view.html',
            controller: 'XsDifficultyCtrl',
            controllerAs: 'xsDiffCtrl'
        }).when('/xsgl/xj-ds-import.html', {
            templateUrl: 'xsgl/view/xj-ds-import.view.html',
            controller: 'DsImportCtrl',
            controllerAs: 'dsImportCtrl'
        });

        //注册管理
        $routeProvider.when('/xsgl/xs-registion.html', {
            templateUrl: 'xsgl/view/xs-registion.view.html',
            controller: 'XsRegistrationCtrl',
            controllerAs: 'xsRegistrationCtrl'
        }).when('/xsgl/view-registion.html', {
            templateUrl: 'xsgl/view/view-registion.view.html',
            controller: 'XsRegistrationCtrl',
            controllerAs: 'xsRegistrationCtrl'
        }).when('/xsgl/xs-checkin.html', {
            templateUrl: 'xsgl/view/xs-checkin.view.html',
            controller: 'XsCheckinCtrl',
            controllerAs: 'xsCheckinCtrl'
        }).when('/xsgl/xs-fee.html', {
            templateUrl: 'xsgl/view/xs-fee.view.html',
            controller: 'XsFeeCtrl',
            controllerAs: 'xsFeeCtrl'
        });

        //异动管理
        $routeProvider.when('/xjyd/ydsq.html', {
            templateUrl: 'xjyd/view/ydsq.view.html'
        }).when('/xjyd/ydsp.html', {
            templateUrl: 'xjyd/view/ydsp.view.html'
        }).when('/xjyd/ydlx.html', {
            templateUrl: 'xjyd/view/ydlx.view.html'
        }).when('/xjyd/ydlc.html', {
            templateUrl: 'xjyd/view/ydlc.view.html'
        });

        //综合事务管理
        $routeProvider.when('/zhsw-xjcard-print.html', {
            templateUrl: 'zhsw/xjcard-print.view.html'
        }).when('/zhsw-yjsz-bb.html', {
            templateUrl: 'zhsw/yjsz-bb.view.html'
        });


        //预毕业相关
        $routeProvider.when('/yby-info.html', {
            templateUrl: 'yby/info.view.html',
            controller: 'YbyInfoCtrl',
            controllerAs: "ybyInfoCtrl"
        }).when('/yby-maintain.html', {
            templateUrl: 'yby/maintain.view.html',
            controller: 'YbyMaintainCtrl',
            controllerAs: "ybyMaintainCtrl"
        }).when('/dep-yby-maintain.html', {
            templateUrl: 'yby/dep-maintain.view.html',
            controller: 'YbyMaintainCtrl',
            controllerAs: "ybyMaintainCtrl"
        }).when('/yby-audit.html', {
            templateUrl: 'yby/audit.view.html',
            controller: 'YbyAuditCtrl',
            controllerAs: "ybyAuditCtrl"
        });
    }

})();
/**
 * Created by guhang on 2016/10/20.
 */
var LoginHome = angular.module('LoginHome', ['ecnuUtils', 'ui.bootstrap', 'ngRoute']);
LoginHome.controller('LoginCtrl',
                     ['$window', 'PageState', 'ecnuAccountDao', 'ENDPOINTS', LoginCtrl]);
function LoginCtrl($window, PageState, ecnuAccountDao, ENDPOINTS) {
    var vm = this;
    vm.loginSuccess = false;

    this.submit = submit;
    this.login = login;

    //以下为函数定义
    function login() {
        var ticket = QueryString('ticket');
        if (ticket == undefined) {
            alert("登录信息错误!");
            $window.location.href = ENDPOINTS.LOGIN_PAGE;
        }

        ecnuAccountDao.login(ticket, initWithRoles);
    }

    function submit() {
        ecnuAccountDao.formLogin(vm.username, vm.password, initWithRoles);

        function initWithRoles(res) {
            var user = PageState.getUser();

            vm.name = res.userName;
            vm.roles = res.roles;
            user.setName(res.userName);
            user.setUserID(res.uID);
            user.setAccountId(res.accountId);
            user.setRoles(res.roles);
            $window.location.href = ENDPOINTS.CHOOSE_IDENTITY;
        }
    }

    function QueryString(item) {
        var sValue = $window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue
    }

}
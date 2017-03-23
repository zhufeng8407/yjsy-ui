/**
 * Created by xiafan on 16/11/24.
 */

(function () {
    var app = angular.module('stuhome');

    app.controller('StudentCardCtrl', ['ecnuStudentDao', 'PageState', StudentCardCtrl]);
    function StudentCardCtrl(ecnuStudentDao, PageState) {
        var vm = this;

        vm.sno = PageState.getUser().getUserID();
    }
})();

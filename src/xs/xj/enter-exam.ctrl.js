(function () {
    var app = angular.module('stuhome');

    app.controller('QuestionSettingCtrl', [ 'ecnuExamDao', QuestionSettingCtrl]);
    function QuestionSettingCtrl(ecnuExamDao) {
        var vm = this;

        vm.submit = submit;

        vm.answer = new Array(30);

        ecnuExamDao.getPaper(function (res) {
            vm.items = res;
        });

        function submit() {
            ecnuExamDao.submitAnswer(vm.answer,function (res) {
                alert("你做对了" + res + "题!");
            });
        }
    }
})();

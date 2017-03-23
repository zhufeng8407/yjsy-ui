/**
 * @author xiafan
 * @namespace ecnuUtils
 * @desc 相关的共用服务模块
 */

(function() {
	'use strict';

	describe('Test cases of ecnuUtils', function() {
		/**
		 * module is a function provided by ngmock to load in a given module
		 */
		beforeEach(module('ecnuUtils'));

		/**
		 * @desc inject is a function provided by ngmock to provide a service
		 *       similar to $inject
		 */
		it('get info of stu', inject(function(ecnuStudentDao, $rootScope) {
			var ret;
			ecnuStudentDao.getStuInfo(0).then(function(result) {
				ret = result;
			});

			// promise是通过$digest循环实现的，因此这里必须手动的调用一次$apply才会有结果
			$rootScope.$apply();
			expect(ret).toEqual({
				name : "夏帆",
				namePy : "xia fan",
				age : 20,
				gender : "女"
			});
		}));
	});

})();

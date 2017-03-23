/**
 * Created by xiafan on 16/10/22.
 */

(function () {
    'use strict';
    var ecnuDpHome = angular.module('ecnuDpHome');

    function isSchoolValid(constraint, school) {
        if (Object.keys(constraint.schools).length == 0) {
            return 1;
        } else if (school in constraint.schools) {
            return 0;
        } else {
            return -1;
        }
    }

    function isDepartmentValid(constraint, school, department) {
        if (isSchoolValid(constraint, school) == 1) {
            return 1;
        } else if (isSchoolValid(constraint, school) == 0) {
            if (Object.keys(constraint.schools[school]).length == 0) {
                return 1;
            } else if (department in constraint.schools[school]) {
                return 0;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    ecnuDpHome.filter('validateSchool', function () {
                          return function (input, constraint) {
                              if (constraint.isUniv)
                                  return input;
                              var output = [];
                              for (var i = 0; i < input.length; i++) {
                                  var school = input[i];
                                  if (isSchoolValid(constraint, school[1]) != -1)
                                      output.push(school);
                              }
                              return output;
                          };
                      }
    );

    ecnuDpHome.filter('validateDepartment', function () {
                          return function (input, constraint, school) {
                              if (constraint.isUniv)
                                  return input;
                              else {
                                  var output = [];
                                  for (var i = 0; i < input.length; i++) {
                                      var department = input[i];
                                      if (isDepartmentValid(constraint, school, department[1]) != -1)
                                          output.push(department);
                                  }
                                  return output;
                              }
                          };
                      }
    );

    ecnuDpHome.filter('validateGrade', function () {
                          return function (input, constraint, school, department) {
                              if (constraint.isUniv) {
                                  return input;
                              } else {
                                  var output = [];
                                  if (isDepartmentValid(constraint, school, department) == 1)
                                      return input;
                                  else if (isDepartmentValid(constraint, school, department) == 0) {
                                      var grades = constraint.schools[school][department];
                                      if (Object.keys(grades).length == 0) {
                                          return input;
                                      } else {
                                          for (var i = 0; i < input.length; i++) {
                                              if (input[i] in grades)
                                                  output.push(input[i]);
                                          }
                                      }
                                  }
                                  return output;
                              }
                          };
                      }
    );

})();
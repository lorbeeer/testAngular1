
'use strict';

angular.module('dbrans.validate', ['ng']).

  directive('dbransValidate', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attr, ngModelController) {
        var moreValidators = scope.$eval(attr.dbransValidate);
        angular.extend(ngModelController.$validators, moreValidators);
      }
    };
  }).

  directive('dbransValidateAsync', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attr, ngModelController) {
        var moreValidators = scope.$eval(attr.dbransValidateAsync);
        angular.extend(ngModelController.$asyncValidators, moreValidators);
      }
    };
  });
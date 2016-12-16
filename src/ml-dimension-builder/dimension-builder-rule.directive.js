(function() {
  'use strict';

  angular.module('ml-dimension-builder').directive('dimensionBuilderRule', [
    function dimensionBuilderRule() {
      return {
        scope: {
          dimensionFields: '=',
          rule: '=dimensionBuilderRule',
          onRemove: '&',
        },

        templateUrl: '/ml-dimension-builder/RuleDirective.html'
      };
    }
  ]);
})();

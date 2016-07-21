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

        templateUrl: 'ml-dimension-builder/RuleDirective.html',

        link: function(scope) {
          scope.getType = function() {
            var fields = scope.dimensionFields,
                field = scope.rule.field;

            if (! fields || ! field) return;

            return fields[field].type;
          };
        }
      };
    }
  ]);
})();

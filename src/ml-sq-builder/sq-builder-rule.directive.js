(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilderRule', [
    function sqBuilderRule() {
      return {
        scope: {
          sqFields: '=',
          rule: '=sqBuilderRule',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/RuleDirective.html',

        link: function(scope) {
          scope.shortName = function(field) {
            return field.localname || field['path-expression'];
          };
        }
      };
    }
  ]);
})();

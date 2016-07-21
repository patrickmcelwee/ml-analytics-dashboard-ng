(function() {
  'use strict';

  // Determines which Rule type should be displayed
  angular.module('ml-dimension-builder').directive('dimensionType', [
    function dimensionType() {
      return {
        scope: {
          type: '=dimensionType',
          rule: '=',
          guide: '=',
        },

        template: '<ng-include src="getTemplateUrl()" />',

        link: function(scope) {
          scope.getTemplateUrl = function() {
            var type = scope.type;
            if (! type) return;

            type = type.charAt(0).toUpperCase() + type.slice(1);

            return 'ml-dimension-builder/types/' + type + '.html';
          };

          scope.inputNeeded = function() {
            // None of these requires an input.
            var needs = [];

            return ~needs.indexOf(scope.rule.operation);
          };
        },
      };
    }
  ]);

})();

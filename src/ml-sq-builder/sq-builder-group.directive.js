(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilderGroup', [
    'RecursionHelper',
    'groupClassHelper',

    function sqBuilderGroup(RH, groupClassHelper) {
      return {
        scope: {
          sqFields: '=',
          group: '=sqBuilderGroup',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/GroupDirective.html',

        compile: function(element) {
          return RH.compile(element, function(scope, el, attrs) {
            var depth = scope.depth = (+ attrs.depth);
            var group = scope.group;

            scope.addRule = function() {
              group.rules.push({});
            };
            scope.addGroup = function() {
              group.rules.push({
                type: 'group',
                subType: 'and-query',
                rules: []
              });
            };

            scope.removeChild = function(idx) {
              group.rules.splice(idx, 1);
            };

            scope.getGroupClassName = function() {
              return groupClassHelper(depth + 1);
            };
          });
        }
      };
    }
  ]);
})();

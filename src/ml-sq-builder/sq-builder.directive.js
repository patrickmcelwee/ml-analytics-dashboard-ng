(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilder', [
    'sqBuilderService',

    function EB(sqBuilderService) {
      return {
        templateUrl: '/ml-sq-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.filters = [];

          /**
           * Removes either group or rule
           */
          scope.removeChild = function(idx) {
            scope.filters.splice(idx, 1);
          };

          /**
           * Adds a single rule
           */
          scope.addRule = function() {
            scope.filters.push({});
          };

          /**
           * Adds a group of rules
           */
          scope.addGroup = function() {
            scope.filters.push({
              type: 'group',
              subType: 'and-query',
              rules: []
            });
          };

          scope.$watch('report.needsUpdate', function(curr) {
            if (! curr) return; 
            scope.filters = sqBuilderService.toFilters(data.query, scope.report.fields);
            scope.report.needsUpdate = false;
          });

          scope.$watch('filters', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue))  {
              scope.data.query.length = 0;
              angular.extend(
                scope.data.query,
                sqBuilderService.toQuery(scope.filters, scope.report.fields)
              );
            }

          }, true);
        }
      };
    }
  ]);
})();

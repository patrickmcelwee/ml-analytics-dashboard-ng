(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilder', [
    'sqBuilderService',

    function EB(sqBuilderService) {
      return {
        scope: {
          data: '=sqBuilder',
        },

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

          scope.showQuery = function() {
            var query = scope.getStructuredQuery();
            return JSON.stringify(query, null, 2);
          };

          scope.getStructuredQuery = function() {
            var query = {
              'query': {
                "queries": []
              }
            };
            var rootQuery = {};
            rootQuery[scope.data.operation] = {'queries': scope.data.query};

            query.query.queries.push(rootQuery);
            return query;
          };

          scope.$watch('data.needsUpdate', function(curr) {
            if (! curr) return;

            scope.filters = sqBuilderService.toFilters(data.query, scope.data.fields);
            scope.data.needsUpdate = false;
          });

          scope.$watch('filters', function(curr) {
            if (! curr) return;

            data.query = sqBuilderService.toQuery(scope.filters, scope.data.fields);
          }, true);
             data.structuredQuery = scope.getStructuredQuery();
        }
      };
    }
  ]);
})();

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

          if ( typeof scope.data.structuredQuery === 'undefined' ) {
            Object.defineProperty(scope.data, 'structuredQuery', {
              get: function() {
                var rootQuery = {};
                rootQuery[scope.data.operation] = {'queries': scope.data.query};
                return {
                  'query': {
                    "queries": [ rootQuery ]
                  }
                };
              }
            });
          }

          scope.renderStructuredQuery = function() {
            return JSON.stringify(scope.data.structuredQuery, null, 2);
          };

          scope.showStructuredQuery = function() {
            scope.structuredQueryIsHidden = false;
          };

          scope.hideStructuredQuery = function() {
            scope.structuredQueryIsHidden = true;
          };

          scope.hideStructuredQuery();

          // scope.$watch('data.needsUpdate', function(curr) {
          //   if (! curr) return; 
          //   scope.filters = sqBuilderService.toFilters(data.query, scope.data.fields);
          //   scope.data.needsUpdate = false;
          // });

          scope.$watch('filters', function(curr) {
            if (! curr) return;

            data.query = sqBuilderService.toQuery(scope.filters, scope.data.fields);
          }, true);
        }
      };
    }
  ]);
})();

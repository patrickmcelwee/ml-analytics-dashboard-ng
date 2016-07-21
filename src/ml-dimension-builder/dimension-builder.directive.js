(function() {
  'use strict';

  angular.module('ml-dimension-builder').directive('dimensionBuilder', ['dimensionBuilderService',
    function DB(dimensionBuilderService) {
      return {
        scope: {
          data: '=dimensionBuilder',
        },

        templateUrl: '/ml-dimension-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.facets = [];

          /**
           * Removes a dimension
           */
          scope.removeDimension = function(idx) {
            scope.facets.splice(idx, 1);
          };

          /**
           * Adds a dimension
           */
          scope.addDimension = function() {
            scope.facets.push({});
          };

          scope.$watch('data.needsRefresh', function(curr) {
            if (! curr) return;

            scope.facets = dimensionBuilderService.toFacets(data.dimensions, scope.data.fields);
            scope.data.needsRefresh = false;
          });

          scope.$watch('facets', function(curr) {
            if (! curr) return;

            data.dimensions = dimensionBuilderService.toDimensions(scope.facets, scope.data.fields);
          }, true);
        }
      };
    }
  ]);
})();

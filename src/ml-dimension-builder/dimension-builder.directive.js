(function() {
  'use strict';

  angular.module('ml-dimension-builder').directive('dimensionBuilder', [
    function DB() {
      return {
        scope: {
          data: '=dimensionBuilder',
        },

        templateUrl: '/ml-dimension-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.facets = [];

          scope.highLevelType = function(type) {
            switch(type) {
              case 'int':
              case 'unsignedInt':
              case 'long':
              case 'unsignedLong':
              case 'float':
              case 'double':
              case 'decimal':
                return 'numeric';
              default:
                return type;
            }
          };

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

          scope.renderDimensionConfig = function() {
            var dimensions = {
              dimensions: data.dimensions
            };
            return JSON.stringify(dimensions, null, 2);
          };

          scope.showDimensionConfig = function() {
            scope.dimensionConfigIsHidden = false;
          };

          scope.hideDimensionConfig = function() {
            scope.dimensionConfigIsHidden = true;
          };

          scope.hideDimensionConfig();

          scope.$watch('data.needsRefresh', function(curr) {
            if (! curr) return;

            scope.facets = data.dimensions;
            scope.data.needsRefresh = false;
          });

          scope.$watch('facets', function(curr) {
            if (! curr) return;

            data.dimensions = scope.facets;
          }, true);
        }
      };
    }
  ]);
})();

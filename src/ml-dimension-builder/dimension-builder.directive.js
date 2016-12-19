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
            scope.data.dimensions.splice(idx, 1);
          };

          /**
           * Adds a dimension
           */
          scope.addDimension = function() {
            scope.data.dimensions.push({});
          };

          scope.renderDimensionConfig = function() {
            var dimensions = {
              dimensions: scope.data.dimensions
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

        }
      };
    }
  ]);
})();

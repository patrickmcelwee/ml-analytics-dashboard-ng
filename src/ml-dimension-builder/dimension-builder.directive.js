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

          scope.isColumnField = function(field) {
            return scope.highLevelType(field['scalar-type']) === 'string';
          };

          scope.isComputeField = function(field) {
            return scope.highLevelType(field['scalar-type']) === 'numeric';
          };

          scope.shortName = function(field) {
            return field.localname || field['path-expression'];
          };

          scope.addColumn = function(field) {
            scope.data.columns.push(field);
          };

          scope.addCompute = function(field, operation) {
            scope.data.computes.push({
              fn: operation,
              ref: field
            });
          };

          scope.renderGroupByConfig = function() {
            return JSON.stringify(
              {
                columns: scope.data.columns,
                computes: scope.data.computes
              },
              null,
              2
            );
          };

          scope.showGroupByConfig = function() {
            scope.groupByConfigIsHidden = false;
          };

          scope.hideGroupByConfig = function() {
            scope.groupByConfigIsHidden = true;
          };

          scope.hideGroupByConfig();

        }
      };
    }
  ]);
})();

(function() {
  'use strict';

  angular.module('ml-dimension-builder').directive('dimensionBuilderChooser', [
    function dimensionBuilderChooser() {
      return {
        scope: {
          dimensionFields: '=',
          item: '=dimensionBuilderChooser',
          onRemove: '&',
        },

        templateUrl: '/ml-dimension-builder/ChooserDirective.html'
      };
    }
  ]);


})();

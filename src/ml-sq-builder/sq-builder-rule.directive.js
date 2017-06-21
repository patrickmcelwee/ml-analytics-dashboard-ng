(function() {
  'use strict';

  angular
    .module('ml-sq-builder')
    .directive('sqBuilderRule', ['mlAnalyticsIndexService',
    function sqBuilderRule(indexService) {
      return {
        scope: {
          sqFields: '=',
          rule: '=sqBuilderRule',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/RuleDirective.html',

        link: function(scope) {
          scope.isQueryableIndex = function(field) {
            return _.includes(
              ['string', 'numeric', 'discreteDate'],
              indexService.highLevelType(field)
            );
          };
        }
      };
    }
  ]);
})();

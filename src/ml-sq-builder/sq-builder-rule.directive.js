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
          scope.shortName = indexService.shortName;
          
          scope.isQueryableIndex = function(field) {
            return _.includes(
              ['string', 'numeric'],
              indexService.highLevelType(field)
            );
          };
        }
      };
    }
  ]);
})();

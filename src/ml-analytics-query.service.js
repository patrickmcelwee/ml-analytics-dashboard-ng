(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsQueryService', queryServiceFactory);

  queryServiceFactory.$inject = ['$http'];

  function queryServiceFactory($http) {
    return {
      execute: function(query) {
        return $http({
          method: 'POST',
          url: '/v1/resources/group-by',
          data: query
        });
      }
    };
  }
})();

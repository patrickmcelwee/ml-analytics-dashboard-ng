(function () {
  'use strict';
  angular.module('ml.analyticsDashboard.source')
    .directive('mlAnalyticsDataSource', mlAnalyticsDataSource);

  function mlAnalyticsDataSource() {
    return {
      restrict: 'E',
      templateUrl: '/ml-analytics-dashboard/source/source.html',
      controller: 'mlAnalyticsDataSourceCtrl'
    };
  }
}());

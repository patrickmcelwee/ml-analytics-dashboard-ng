(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.chart').
    directive('mlAnalyticsChart', mlAnalyticsChart);

  function mlAnalyticsChart() {
    return {
      restrict: 'E',
      templateUrl: '/ml-analytics-dashboard/chart/chart.html',
      scope: {
        analyticsConfig: '='
      },
      controller: 'mlAnalyticsChartCtrl'
    };
  }
  
}());

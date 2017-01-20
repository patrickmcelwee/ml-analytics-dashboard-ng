(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.chart').
    directive('mlAnalyticsChart', mlAnalyticsChart);

  function mlAnalyticsChart() {
    return {
      restrict: 'E',
      templateUrl: '/ml-analytics-chart/chart.html',
      scope: {
        queryObject: '='
      },
      controller: 'mlAnalyticsChartCtrl'
    };
  }
  
}());

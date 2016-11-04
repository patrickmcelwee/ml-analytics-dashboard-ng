(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlAnalyticsViewChart', mlAnalyticsViewChart);

  function mlAnalyticsViewChart() {
    return {
      restrict: 'E',
      templateUrl: '/templates/ml-report/ml-analytics-view-chart.html',
      controller: 'mlAnalyticsViewChartCtrl'
    };
  }
}());

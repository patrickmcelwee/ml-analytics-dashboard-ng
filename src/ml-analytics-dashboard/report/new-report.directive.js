(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsNewReport', mlAnalyticsNewReport);

  function mlAnalyticsNewReport() {
    return {
      restrict: 'E',
      templateUrl: '/templates/new-report.html',
      controller: 'NewReportCtrl'
    };
  }
}());

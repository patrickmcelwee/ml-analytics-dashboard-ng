(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDashboardHome', mlAnalyticsDashboardHome);

  function mlAnalyticsDashboardHome() {
    return {
      restrict: 'E',
      templateUrl: '/templates/home.html'
    };
  }
}());

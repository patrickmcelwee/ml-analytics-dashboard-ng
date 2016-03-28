(function () {
  'use strict';
  angular.module('app.mlAnalyticsDashboard')
    .directive('mlAnalyticsDashboard', mlAnalyticsDashboard);

  function mlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/dashboard.html',
      controller: 'SidebarCtrl'
    };
  }
}());

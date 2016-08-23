(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('manageMlAnalyticsDashboard', manageMlAnalyticsDashboard);

  function manageMlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/manage.html',
      controller: 'ManageCtrl'
    };
  }
}());

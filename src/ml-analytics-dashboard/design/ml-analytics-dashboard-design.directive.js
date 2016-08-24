(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDesign', mlAnalyticsDesign);

  function mlAnalyticsDesign() {
    return {
      restrict: 'E',
      templateUrl: '/templates/designer.html',
      controller: 'ReportDesignerCtrl'
    };
  }
}());

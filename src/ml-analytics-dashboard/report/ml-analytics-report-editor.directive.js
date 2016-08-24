(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsReportEditor', mlAnalyticsReportEditor);

  function mlAnalyticsReportEditor() {
    return {
      restrict: 'E',
      templateUrl: '/templates/editor.html',
      controller: 'ReportEditorCtrl'
    };
  }
}());

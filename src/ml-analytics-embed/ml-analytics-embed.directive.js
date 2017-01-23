(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.embed').
    directive('mlAnalyticsEmbed', mlAnalyticsEmbed);

  mlAnalyticsEmbed.$inject = ['ReportService'];

  function mlAnalyticsEmbed(reportService) {
    return {
      restrict: 'E',
      template: '<ml-analytics-chart analytics-config="config"></ml-analytics-chart>',
      scope: {
        reportUri: '='
      },
      link: function(scope) {
        reportService.getReport(scope.reportUri).then(function(response) {
          scope.config = response.data.widgets[0].dataModelOptions.data;
        });
      }
    };
  }

}());

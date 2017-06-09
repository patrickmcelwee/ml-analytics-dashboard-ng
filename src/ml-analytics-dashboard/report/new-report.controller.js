(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl',
    [
      '$scope', '$location', '$rootScope', 'ReportService',
      function($scope, $location, $rootScope, ReportService) {

        $scope.report = {};

        $scope.createReport = function() {
          $scope.report.uri = '/ml-analytics-dashboard-reports/' +
            encodeURIComponent($scope.report.name) +
            '-' +
            Math.floor((Math.random() * 1000000) + 1) +
            '.json';
            
          ReportService.createOrUpdateReport($scope.report).then(function() {
            $rootScope.$broadcast('mlAnalyticsDashboard:ReportCreated', $scope.report);
            $location.search('ml-analytics-mode', 'design');
            $location.search('ml-analytics-uri', $scope.report.uri);
          });
        };

      }
    ]
  );
}());

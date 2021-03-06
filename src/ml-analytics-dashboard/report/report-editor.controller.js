(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportEditorCtrl',
    ['$scope', '$location', 'ReportService',
      function($scope, $location, ReportService) {

        $scope.report = {};
        $scope.report.uri = $location.search()['ml-analytics-uri'];
        ReportService.getReport($scope.report.uri).then(function(response) {
          angular.extend($scope.report, response.data);
        });

        $scope.updateReport = function() {
          ReportService.createOrUpdateReport($scope.report).then(function() {
            $location.search('ml-analytics-mode', 'home');
          });
        };

      }
    ]
  );
}());

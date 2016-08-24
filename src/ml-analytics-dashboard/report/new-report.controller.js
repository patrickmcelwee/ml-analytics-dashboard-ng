(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl', ['$scope', '$location', '$rootScope', 'ReportService',
    function($scope, $location, $rootScope, ReportService) {

    $scope.report = {};
    $scope.report.privacy = 'public';

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.createReport = function() {
      ReportService.createReport($scope.report).then(function(response) {
        var uri = response.replace(/(.*\?uri=)/, '');
        $scope.report.uri = uri;

        $rootScope.$broadcast('ReportCreated', $scope.report);
        $location.search('ml-analytics-mode', 'design');
        $location.search('ml-analytics-uri', uri);
      });
    };

  }]);
}());

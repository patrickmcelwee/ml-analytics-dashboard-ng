(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl', ['$scope', '$location', '$rootScope', 'userService', 'ReportService',
    function($scope, $location, $rootScope, userService, ReportService) {

    $scope.currentUser = null;
    $scope.report = {};
    $scope.report.privacy = 'public';

    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
    });

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
        $location.path('/ml-analytics-dashboard/designer' + uri);
      });
    };

  }]);
}());

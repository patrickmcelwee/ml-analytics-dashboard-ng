(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ReportEditorCtrl', ['$scope', '$stateParams', '$state',
        '$location', 'ReportService',
    function($scope, $stateParams, $state, $location, ReportService) {

    $scope.report = {};
    $scope.report.uri = $location.search()['ml-analytics-uri'];
    ReportService.getReport($scope.report.uri).then(function(response) {
      angular.extend($scope.report, response.data);
    });

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.updateReport = function() {
      ReportService.updateReport($scope.report).then(function(response) {
        $location.search('ml-analytics-mode', 'home');
      });
    };

  }]);
}());

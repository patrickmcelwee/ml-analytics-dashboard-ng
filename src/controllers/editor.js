(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportEditorCtrl', ['$scope', '$stateParams', '$state', 'ReportData', 'ReportService',
    function($scope, $stateParams, $state, ReportData, ReportService) {

    $scope.report = {};
    $scope.report.uri = decodeURIComponent($stateParams.uri);
    angular.extend($scope.report, ReportData.data);

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.updateReport = function() {
      ReportService.updateReport($scope.report).then(function(response) {
        //$scope.updateTableRow();
        $state.go('root.analytics-dashboard.home');
      });
    };

  }]);
}());

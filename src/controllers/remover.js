(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportRemoverCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'ReportService',
    function($rootScope, $scope, $stateParams, $state, ReportService) {

    $scope.report.uri = decodeURIComponent($stateParams.uri);

    $scope.deleteReport = function() {
      ReportService.deleteReport($scope.report.uri).then(function(response) {
        $rootScope.$broadcast('ReportDeleted', $scope.report.uri);
        $state.go('root.ml-analytics-dashboard.home');
      }, function(response) {
        alert(response);
      });
    };

    $scope.cancel = function() {
      $state.go('root.ml-analytics-dashboard.home');
    };

  }]);
}());

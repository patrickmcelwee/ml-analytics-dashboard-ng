(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = ['$scope', '$location'];

  function ManageCtrl($scope, $location) {
    $scope.managerMode = 'manage';

    $scope.createReport = function() {
      $scope.managerMode = 'new';
      $location.path('/ml-analytics-dashboard/new-report');
    };

  }

}());

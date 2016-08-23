(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = ['$scope', '$location'];

  function ManageCtrl($scope, $location) {

    $scope.createReport = function() {
      $location.path('/ml-analytics-dashboard/new-report');
    };

  }

}());

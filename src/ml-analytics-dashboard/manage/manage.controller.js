(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = ['$scope', '$location'];

  function ManageCtrl($scope, $location) {

    $scope.newReportForm = function() {
      $location.search('ml-analytics-mode', 'new');
    };

    $scope.gotoDesigner = function(uri) {
      $location.search('ml-analytics-mode', 'design');
      $location.search('ml-analytics-uri', uri);
    };

  }

}());

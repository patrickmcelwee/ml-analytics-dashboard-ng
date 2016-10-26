(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlResultsGridCtrl', mlResultsGridCtrl);

  mlResultsGridCtrl.$inject = ['$scope'];

  function mlResultsGridCtrl($scope) {
    $scope.sortColumn = 0;
    $scope.sortReverse = false;

    $scope.sorter = function(item) {
      return item[$scope.sortColumn];
    };

    $scope.setSortColumn = function(column) {
      if (column === $scope.sortColumn) {
        $scope.sortReverse = !$scope.sortReverse;
      } else {
        $scope.sortColumn = column;
      }
    };
  }

})();

(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlResultsGrid', mlResultsGrid);

  function mlResultsGrid() {
    return {
      restrict: 'E',
      templateUrl: '/templates/ml-report/ml-results-grid.html',
      scope: {
        resultsObject: '=',
        queryError: '='
      }
    };
  }
}());

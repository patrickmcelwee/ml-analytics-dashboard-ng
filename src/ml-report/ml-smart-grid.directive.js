(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlSmartGrid', mlSmartGrid);

  function mlSmartGrid() {
    return {
      restrict: 'A',
      replace: false,
      templateUrl: '/templates/ml-report/chart-builder.html',
      controller:  'mlSmartGridCtrl',

      link: function($scope, element, attrs) {
        $scope.element = element;

        // $scope.$watch('widget.mode', function(mode) {
        //   $scope.report.needsUpdate = true;
        // });
      }
    };
  }
}());

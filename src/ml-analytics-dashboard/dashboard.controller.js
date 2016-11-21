(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = [ '$rootScope', '$scope'];

  function DashboardCtrl($rootScope, $scope) {

    function establishMode() {
      if($location.search()['ml-analytics-mode']) {
        $scope.mode = $location.search()['ml-analytics-mode'];
      } else {
        $location.search('ml-analytics-mode', 'home');
      }
    }

    establishMode();
  }
}());

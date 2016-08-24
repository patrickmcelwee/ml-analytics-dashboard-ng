(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = [ '$rootScope', '$scope', '$location', '$window',
                          'userService', 'ReportService', 'WidgetDefinitions'];

  function DashboardCtrl($rootScope, $scope, $location, $window, userService,
                       ReportService, WidgetDefinitions) {

    establishMode();

    function establishMode() {
      if($location.search()['ml-analytics-mode']) {
        $scope.mode = $location.search()['ml-analytics-mode'];
      } else {
        $location.search('ml-analytics-mode', 'home');
      }
    }

    $scope.currentUser = null;
    $scope.search = {};
    $scope.showLoading = false;
    $scope.widgetDefs = WidgetDefinitions;
    $scope.reports = [];

    // The report selected for update or delete.
    $scope.report = {};

    // Retrieve reports if the user logs in
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
      $scope.getReports();
    });

    $scope.getReports = function() {
      $scope.showLoading = true;
      ReportService.getReports().then(function(response) {
        var contentType = response.headers('content-type');
        var page = MarkLogic.Util.parseMultiPart(response.data, contentType);
        $scope.reports = page.results;
        $scope.showLoading = false;
      }, function() {
        $scope.showLoading = false;
      });
    };

    $scope.addWidget = function(widgetDef) {
      ReportService.getDashboardOptions($scope.reportDashboardOptions).addWidget({
        name: widgetDef.name
      });
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.search('ml-analytics-mode', 'edit');
      $location.search('ml-analytics-uri', $scope.report.uri);
    };

    $scope.deleteReport = function(report) {
      if ($window.confirm(
        'This action will delete this report permanently. ' +
        'Are you sure you want to delete it?')) {
        ReportService.deleteReport(report.uri).then(function(response) {
          for (var i = 0; i < $scope.reports.length; i++) {
            if (report.uri === $scope.reports[i].uri) {
              // The first parameter is the index, the second 
              // parameter is the number of elements to remove.
              $scope.reports.splice(i, 1);
              break;
            }
          }
        }, function(response) {
          $window.alert(response);
        });
      }
    };

    $scope.$on('$locationChangeSuccess', function(latest, old) {
      establishMode();
    });

    $scope.$on('ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

  }
}());

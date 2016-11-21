(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = ['$scope', '$location', '$window', 'userService',
                        'ReportService', 'WidgetDefinitions'];

  function ManageCtrl($scope, $location, $window, userService,
                      ReportService, WidgetDefinitions) {

    $scope.currentUser = null;
    $scope.search = {};
    $scope.showLoading = false;
    $scope.widgetDefs = WidgetDefinitions;
    $scope.reports = [];

    function establishMode() {
      if($location.search()['ml-analytics-mode']) {
        $scope.mode = $location.search()['ml-analytics-mode'];
      } else {
        $location.search('ml-analytics-mode', 'home');
      }
    }

    establishMode();

    // The report selected for update or delete.
    $scope.report = {};

    $scope.addWidget = function(widgetDef) {
      ReportService.getDashboardOptions($scope.reportDashboardOptions).addWidget({
        name: widgetDef.name
      });
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

    $scope.newReportForm = function() {
      $location.search('ml-analytics-mode', 'new');
    };

    $scope.gotoDesigner = function(uri) {
      $location.search('ml-analytics-mode', 'design');
      $location.search('ml-analytics-uri', uri);
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.search('ml-analytics-mode', 'edit');
      $location.search('ml-analytics-uri', $scope.report.uri);
    };

    $scope.getReports = function() {
      $scope.showLoading = true;
      ReportService.getReports().then(function(response) {
        $scope.reports = response.data.results;
        _.each($scope.reports, function(report) {
          report.name = report.extracted.content[0].name;
        });
        $scope.showLoading = false;
      }, function() {
        $scope.showLoading = false;
      });
    };

    // Retrieve reports if the user logs in
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
      $scope.getReports();
    });

    $scope.$on('$locationChangeSuccess', function(latest, old) {
      establishMode();
    });

    $scope.$on('ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

  }

}());

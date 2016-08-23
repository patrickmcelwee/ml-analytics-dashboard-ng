(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('SidebarCtrl', SidebarCtrl);

  SidebarCtrl.$inject = [ '$rootScope', '$scope', '$location', '$state',
                          'userService', 'ReportService', 'WidgetDefinitions'];

  function SidebarCtrl($rootScope, $scope, $location, $state, userService,
                       ReportService, WidgetDefinitions) {

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

    $scope.gotoDesigner = function(uri) {
      $location.path('/ml-analytics-dashboard/designer' + uri);
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/ml-analytics-dashboard/editor' + report.uri);
    };

    $scope.showReportRemover = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/ml-analytics-dashboard/remover' + report.uri);
    };

    $scope.setReport = function(report) {
      angular.extend($scope.report, report);
    };

    $scope.updateTableRow = function() {
      for (var i = 0; i < $scope.reports.length; i++) {
        var report = $scope.reports[i];
        if (report.uri === $scope.report.uri) {
          report.name = $scope.report.name;
          report.description = $scope.report.description;
          break;
        }
      }
    };

    $scope.$on('ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

    $scope.$on('ReportDeleted', function(event, reportUri) {
      for (var i = 0; i < $scope.reports.length; i++) {
        if (reportUri === $scope.reports[i].uri) {
          // The first parameter is the index, the second 
          // parameter is the number of elements to remove.
          $scope.reports.splice(i, 1);
          break;
        }
      }
    });

  }
}());

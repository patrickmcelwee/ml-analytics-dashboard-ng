(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', [
    'highcharts-ng',
    'ml.analyticsDashboard.report',
    'ngTable',
    'ui.dashboard',
    'ui.router'
  ])
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('root.analytics-dashboard', {
        url: '/analytics-dashboard',
        template: '<ml-analytics-dashboard></ml-analytics-dashboard>'
      })
      .state('root.analytics-dashboard.new-report', {
        url: '/new-report',
        templateUrl: '/templates/new-report.html',
        controller: 'NewReportCtrl'
      })
      .state('root.analytics-dashboard.home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('root.analytics-dashboard.designer', {
        url: '/designer{uri:path}',
        templateUrl: '/templates/designer.html',
        controller: 'ReportDesignerCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              return response;
            });
          }
        }
      })
      .state('root.analytics-dashboard.remover', {
        url: '/remover{uri:path}',
        templateUrl: '/templates/remover.html',
        controller: 'ReportRemoverCtrl'
      })
      .state('root.analytics-dashboard.editor', {
        url: '/editor{uri:path}',
        templateUrl: '/templates/editor.html',
        controller: 'ReportEditorCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              return response;
            });
          }
        }
      });
  }

}());

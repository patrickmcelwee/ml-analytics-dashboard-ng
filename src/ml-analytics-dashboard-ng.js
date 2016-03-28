(function () {
  'use strict';

  angular.module('app.mlAnalyticsDashboard', [])
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('analytics-dashboard', {
        url: '/analytics-dashboard',
        template: '<ml-analytics-dashboard></ml-analytics-dashboard>'
      })
      .state('analytics-dashboard.new-report', {
        url: '/new-report',
        templateUrl: 'app/analytics/new-report.html',
        controller: 'NewReportCtrl'
      })
      .state('analytics-dashboard.home', {
        url: '/home',
        templateUrl: 'app/analytics/home.html',
        controller: 'HomeCtrl'
      })
      .state('analytics-dashboard.designer', {
        url: '/designer{uri:path}',
        templateUrl: 'app/analytics/designer.html',
        controller: 'ReportDesignerCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      })
      .state('analytics-dashboard.remover', {
        url: '/remover{uri:path}',
        templateUrl: 'app/analytics/remover.html',
        controller: 'ReportRemoverCtrl'
      })
      .state('analytics-dashboard.editor', {
        url: '/editor{uri:path}',
        templateUrl: 'app/analytics/editor.html',
        controller: 'ReportEditorCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      });
  }

}());

(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', [
    'highcharts-ng',
    'ml.analyticsDashboard.report',
    'ml.common',
    'ngTable',
    'ui.dashboard',
    'ui.router'
  ])
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('root.ml-analytics-dashboard.remover', {
        url: '/remover{uri:path}',
        templateUrl: '/templates/remover.html',
        controller: 'ReportRemoverCtrl'
      })
      .state('root.ml-analytics-dashboard.editor', {
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

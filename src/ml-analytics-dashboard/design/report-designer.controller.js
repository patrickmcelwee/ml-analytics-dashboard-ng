(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').
    controller('ReportDesignerCtrl', ReportDesignerCtrl);

  ReportDesignerCtrl.$inject = [
    '$scope', '$location', 'ReportService', 'WidgetDefinitions'
  ];

  function ReportDesignerCtrl($scope, $location,
      ReportService, WidgetDefinitions) {

    $scope.report = {
      uri: $location.search()['ml-analytics-uri'],
      aliases: {},
      frequencyAlias: 'Frequency',
      defaultResultsLimit: 100
    };

    $scope.manager = {
      exportConfig: function() {
        ReportService.getReport($scope.report.uri).
        then(function(resp) {
          var url = URL.createObjectURL(new Blob([angular.toJson(resp.data)]));
          var a = document.createElement('a');
          a.href = url;
          var uriParts = $scope.report.uri.split('/');
          a.download = uriParts[uriParts.length - 1];
          a.target = '_blank';
          a.click();
        });
      }
    };

    $scope.reportModel = {};

    var saveWidgets = function() {
      ReportService.createOrUpdateReport($scope.report);
    };

    var defaultWidgets;
    createDefaultWidgets();

    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;

        $scope.report.widgets = value.widgets;
        saveWidgets();
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    $scope.reportDashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: WidgetDefinitions,
      defaultWidgets: defaultWidgets,
      hideToolbar: false,
      hideWidgetName: true,
      explicitSave: false,
      stringifyStorage: false,
      storage: storage,
      storageId: $scope.report.uri
    };

    ReportService.setDashboardOptions($scope.reportDashboardOptions);

    ReportService.getReport($scope.report.uri)
      .then(function(resp) {
        angular.extend($scope.report, resp.data);
        initWithData();
      }
    );

    function initWithData() {
      //defaults
      createDefaultWidgets();
      ReportService.loadWidgets(defaultWidgets);
    }

    function createDefaultWidgets() {
      if ($scope.report.widgets) {
        defaultWidgets = _.map($scope.report.widgets, function(widget) {
          return {
            name: widget.name,
            attrs: widget.attrs,
            style: widget.size,
            dataModelOptions: widget.dataModelOptions
          };
        });
      } else {
        defaultWidgets = [];
      }
    }

    $scope.returnHome = function() {
      $location.search('ml-analytics-mode', 'home');
      $location.search('ml-analytics-uri', null);
    };

  }
}());

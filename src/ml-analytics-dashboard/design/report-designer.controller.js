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
      aliases: {}
    };

    $scope.reportModel = {};

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
        $scope.saveWidgets();
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
        initWithData(resp.data);
    });

    function initWithData(savedReport) {
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

    $scope.$on('widgetAdded', function(event, widget) {
      event.stopPropagation();
    });

    $scope.saveWidgets = function() {
      ReportService.updateReport($scope.report);
    };

  }
}());

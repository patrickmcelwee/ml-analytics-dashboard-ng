(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').
    controller('ReportDesignerCtrl', ReportDesignerCtrl);

  ReportDesignerCtrl.$inject = [
    '$scope', '$location', '$http',
    'ReportService', 'WidgetDefinitions', 'mlAnalyticsIndexService'
  ];

  function ReportDesignerCtrl($scope, $location, $http,
      ReportService, WidgetDefinitions, indexService) {
     
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
      $scope.report.groupingStrategy = 'collection';
      $scope.report.originalDocs = [];

      createDefaultWidgets();
      ReportService.loadWidgets(defaultWidgets);
      $scope.getDbConfig(); 
    }

    function createDefaultWidgets() {
      if ($scope.report.widgets) {
        defaultWidgets = _.map($scope.report.widgets, function(widget) {
          return {
            name: widget.name,
            title: widget.title,
            attrs: widget.attrs,
            style: widget.size,
            dataModelOptions: widget.dataModelOptions
          };
        });
      } else {
        defaultWidgets = [];
      }
    }

    var createFields = function(indexes) {
      return _.map(indexes, function(index) {
        return {
          alias: indexService.shortName(index, $scope.report.aliases),
          ref: index
        };
      });
    }; 

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.report.groupingStrategy
      };

      $scope.reportModel.loadingConfig = true;

      if ($scope.report.targetDatabase) {
        params['rs:database'] = $scope.report.targetDatabase;
      }

      $http.get('/v1/resources/index-discovery', {
        params: params
      }).then(function(response) {
        $scope.reportModel.loadingConfig = false;

        if (response.data.errorResponse) {
          $scope.reportModel.configError = response.data.errorResponse.message;
          return;
        }

        $scope.report.targetDatabase = response.data['current-database'];
        $scope.report.databases = response.data.databases;

        if (!_.isEmpty(response.data.docs)) {
          $scope.reportModel.configError = null;

          var docs = response.data.docs;
          $scope.report.originalDocs = docs;
          $scope.report.directories = Object.keys(docs);
          if (!_.includes($scope.report.directories, $scope.report.directory)) {
            $scope.report.directory = undefined;
          }
          $scope.report.fields = createFields(docs[$scope.report.directory]);

          if ($scope.report.fields) {
            // communicating with sq-builder
            $scope.report.needsUpdate = true;
          }

        } else {
          $scope.reportModel.configError = 'No documents with range indices in the database';
        }

      }, function(response) {
        $scope.reportModel.loadingConfig = false;
        $scope.reportModel.configError = response.data;
      });
    };

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

    $scope.$watch('report.directory', function() {
      if ($scope.report.directory) {
        $scope.report.fields = createFields(
          $scope.report.originalDocs[$scope.report.directory]
        );
      }
    });

  }
}());

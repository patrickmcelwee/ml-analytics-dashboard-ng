(function() {
  'use strict';

  // Report Service
  angular.module('ml.analyticsDashboard').service('ReportService', ['$http', '$q', 'MLRest', function($http, $q, mlRest) {
    var dashboardOptions = null;
    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    this.getStorage = function() {
      return storage;
    };

    this.setDashboardOptions = function(options) {
      dashboardOptions = options;
    };

    this.getDashboardOptions = function() {
      return dashboardOptions;
    };

    this.getReports = function() {
      var search = {
        'search': {
          'options': {
            'search-option': ['unfiltered']
          },
          'query': {
            'queries': [{
              'collection-query': {
                'uri': ['ml-analytics-dashboard-reports']
              }
            }]
          }
        }
      };

      // HTTP header names are case-insensitive.
      //
      // A multi-document read is distinguished from a normal search 
      // operation by setting the Accept header to multipart/mixed.
      //
      // Can use the 'category' parameter only with multipart/mixed accept.
      return mlRest.search({
               'pageLength': 20,
               'category': 'content',
               'format': 'json'
              }, search);
    };

    this.getReport = function(uri) {
      return mlRest.getDocument(uri, {format: 'json'});
    };

    this.createReport = function(report) {
      return mlRest.createDocument(report, {
         directory: '/ml-analytics-dashboard-reports/',
         collection: ['ml-analytics-dashboard-reports'],
         format: 'json',
         extension: '.json'
       });
    };

    this.deleteReport = function(uri) {
      return mlRest.deleteDocument(uri);
    };

    this.updateReport = function(data) {
      return mlRest.updateDocument(data, {uri: data.uri});
    };

    this.get = function(url) {
      return $http.get(url);
    };

    this.post = function(url, data) {
      return $http.post(url, data);
    };

    this.put = function(url, data) {
      return $http.put(url, data);
    };

    this.delete = function(url) {
      return $http.delete(url);
    };
  }]);

  angular.module('ml.analyticsDashboard').factory('WidgetDefinitions', ['SmartGridDataModel',  
    function(SmartGridDataModel) {
    return [
      {
        name: 'Chart Builder',
        directive: 'ml-smart-grid',
        title: 'Chart Builder',
        icon: 'fa fa-th',
        dataAttrName: 'grid',
        dataModelType: SmartGridDataModel,
        dataModelOptions: {
          database: '',
          groupingStrategy: '',
          directory: '',
          query: {},
          dimensions: [],
          chart: 'column',
          pageLength: 10,
          parameters: []
        },
        style: {
          width: '100%'
        },
        settingsModalOptions: {
          templateUrl: '/templates/widgets/qb-settings.html',
          //controller: 'QueryBuilderWidgetSettingsCtrl',
          backdrop: false
        },
        onSettingsClose: function(result, widget) {
          //jQuery.extend(true, widget, result);
          widget.title = result.title;
          widget.dataModelOptions.pageLength = result.dataModelOptions.pageLength;
          widget.dataModelOptions.chart = result.dataModelOptions.chart;
          angular.copy(result.dataModelOptions.parameters, widget.dataModelOptions.parameters);
        },
        onSettingsDismiss: function(reason, scope) {
          // Do nothing here, since the user pressed cancel
        }
      }
    ];
  }]);
}());

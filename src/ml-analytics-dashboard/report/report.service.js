(function() {
  'use strict';

  // Report Service
  angular.module('ml.analyticsDashboard').service('ReportService', ['$http', 'MLRest', function($http, mlRest) {
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

    this.loadWidgets = function(widgets) {
      dashboardOptions.loadWidgets(widgets);
    };

    this.getReports = function() {
      var search = {
        'search': {
          'options': {
            'search-option': ['unfiltered'],
            'extract-document-data': {
              'extract-path': ['/name']
            }
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

      return mlRest.search({
        'pageLength': 20,
        'format': 'json'
      }, search);
    };

    this.getReport = function(uri) {
      return mlRest.getDocument(uri, {format: 'json'});
    };

    this.createOrUpdateReport = function(report) {
      return mlRest.updateDocument(report, {
        collection: ['ml-analytics-dashboard-reports'],
        uri: report.uri
      });
    };

    this.deleteReport = function(uri) {
      return mlRest.deleteDocument(uri);
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

  angular.module('ml.analyticsDashboard').factory('WidgetDefinitions', ['WidgetDataModel',  
    function(WidgetDataModel) {
      return [
        {
          name: 'Chart Builder',
          directive: 'ml-smart-grid',
          icon: 'fa fa-th',
          dataAttrName: 'grid',
          dataModelType: WidgetDataModel,
          dataModelOptions: {
            data: {
              title: 'Chart'
            }
          },
          style: {
            width: '100%'
          }
        }
      ];
    }
  ]);
}());

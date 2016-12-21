(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlSmartGridCtrl', mlSmartGridCtrl);

  mlSmartGridCtrl.$inject = ['$scope', '$http', '$q'];

  function mlSmartGridCtrl($scope, $http, $q) {
    // Set the initial mode for this widget to View.
    $scope.widget.mode = 'View';
    $scope.isGridCollapsed  = true;
    $scope.shouldShowChart = false;

    $scope.model = {
      queryConfig: null,
      queryError: null,
      config: null,
      configError: null,
      results: null,
      includeFrequency: false,
      loadingConfig: false,
      loadingResults: false,
      groupingStrategy: 'collection',
      showBuilder: false
    };

    if ($scope.widget.dataModelOptions.groupingStrategy) {
      $scope.model.groupingStrategy = $scope.widget.dataModelOptions.groupingStrategy;
    }

    $scope.deferredAbort = null;

    $scope.data = {};
    $scope.data.operation = 'and-query';
    $scope.data.query = [];
    $scope.data.needsUpdate = true;
    $scope.data.directory = $scope.widget.dataModelOptions.directory;
    $scope.data.columns = [];
    $scope.data.computes = [];

    $scope.executor = {};

    $scope.clearResults = function() {
      $scope.model.results = null;
    };

    $scope.shortName = function(field) {
      return field.localname || field['path-expression'];
    };

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.model.groupingStrategy
      };

      $scope.model.showBuilder = false;
      $scope.model.loadingConfig = true;

      if ($scope.model.config) {
        params['rs:database'] = $scope.model.config['current-database'];
      } else if ($scope.widget.dataModelOptions.database) {
        params['rs:database'] = $scope.widget.dataModelOptions.database;
      }

      $scope.clearResults();
      $scope.model.includeFrequency = false;
      // $scope.model.config = null;
      $scope.model.queryConfig = {
        'result-type': 'group-by',
        rows: [],
        columns: [],
        computes: [],
        options: ['headers=true'],
        query: {query: {}}
      };

      $http.get('/v1/resources/index-discovery', {
        params: params
      }).then(function(response) {
        $scope.model.loadingConfig = false;

        if (response.data.errorResponse) {
          $scope.model.configError = response.data.errorResponse.message;
          return;
        }

        $scope.data.targetDatabase = response.data['current-database'];
        $scope.data.databases = response.data.databases;

        if (!_.isEmpty(response.data.docs)) {
          $scope.model.configError = null;

          var docs = response.data.docs;
          $scope.data.originalDocs = docs;
          $scope.data.directories = Object.keys(docs);
          $scope.data.fields = angular.copy(docs[$scope.data.directory]);
;
          if ($scope.data.fields) {
            $scope.setDocument();
          }

        } else {
          $scope.model.configError = 'No documents with range indices in the database';
        }

        $scope.execute();
      }, function(response) {
        $scope.model.loadingConfig = false;
        $scope.model.configError = response.data;
      });
    };

    $scope.setDocument = function() {
      if ($scope.data.directory) {
        $scope.data.operation = 'and-query';
        $scope.data.query = [];

        if ($scope.data.directory === $scope.widget.dataModelOptions.directory) {
          if ($scope.widget.dataModelOptions.query && 
              $scope.widget.dataModelOptions.query.query &&
              $scope.widget.dataModelOptions.query.query.queries) {
            var query = $scope.widget.dataModelOptions.query.query.queries[0];
            var operation = Object.keys(query)[0];
            $scope.data.operation = operation;
            $scope.data.query = query[operation].queries;
          } else {
            $scope.data.operation = 'and-query';
            $scope.data.query = [];
          }

          if ($scope.widget.dataModelOptions.columns) {
            angular.copy($scope.widget.dataModelOptions.columns, $scope.data.columns);
          } else {
            $scope.data.columns = [];
          }
          if ($scope.widget.dataModelOptions.computes) {
            angular.copy($scope.widget.dataModelOptions.computes, $scope.data.computes);
          } else {
            $scope.data.computes = [];
          }
        } else {
          $scope.data.operation = 'and-query';
          $scope.data.query = [];
          $scope.data.columns = [];
          $scope.data.computes = [];
        }

        $scope.data.needsUpdate = true;

        $scope.model.showBuilder = true;
      } else {
        $scope.model.showBuilder = false;
      }
    };

    $scope.save = function() {
      $scope.widget.dataModelOptions.database = $scope.data.targetDatabase;
      $scope.widget.dataModelOptions.groupingStrategy = $scope.model.groupingStrategy;
      $scope.widget.dataModelOptions.directory = $scope.data.directory;

      $scope.widget.dataModelOptions.query = {};

      angular.copy($scope.data.structuredQuery, $scope.widget.dataModelOptions.query);
      $scope.widget.dataModelOptions.columns = $scope.data.columns;
      $scope.widget.dataModelOptions.computes = $scope.data.computes;

      $scope.options.saveDashboard();
    };

    $scope.execute = function() {
      var columns = $scope.widget.dataModelOptions.columns;
      // Number of groupby fields.
      var count = columns.length;

      // If there is no column, we will do simple 
      // search, otherwise we will do aggregate computations.
      $scope.model.loadingResults = true;
      if (count)
        $scope.executeComplexQuery(count);
      else
        $scope.executeSimpleQuery(1);
    };

    $scope.executeComplexQuery = function(count) {
      var queries = $scope.widget.dataModelOptions.query.query.queries;
      if (queries.length === 1) {
        // The first element has only one key.
        var firstElement = queries[0];
        var key = Object.keys(firstElement)[0];

        // The group-by will fail if an or-query is empty, so we
        // convert an empty query at the root level.
        if (firstElement[key].queries.length === 0)
          queries = [];
      }

      var query = {
        'queries': queries
      };

      if ($scope.widget.mode === 'View' && $scope.executor.qtext) {
        query.qtext = $scope.executor.qtext;
      } else {
        query.qtext = '';
      }

      var params = {};
      var queryConfig = angular.copy($scope.model.queryConfig);

      if ($scope.model.config) {
        params['rs:database'] = $scope.model.config['current-database'];
      }

      if ($scope.model.includeFrequency) {
        queryConfig.computes.push({fn: 'frequency'});
      }

      queryConfig.query.query = query;

      queryConfig.columns = $scope.widget.dataModelOptions.columns;
      queryConfig.computes = $scope.widget.dataModelOptions.computes;

      $scope.model.loadingResults = true;
      $scope.clearResults();

      $scope.deferredAbort = $q.defer();
      $http({
        method: 'POST',
        url: '/v1/resources/group-by',
        params: params,
        data: queryConfig,
        timeout: $scope.deferredAbort.promise
      }).then(function(response) {
        $scope.model.results = response.data;
        $scope.model.queryError = null;
        $scope.model.loadingResults = false;

        $scope.createComplexTable($scope.model.results.headers, $scope.model.results.results);
        $scope.createHighcharts(count, $scope.model.results.headers, $scope.model.results.results);

      }, function(response) {
        $scope.model.loadingResults = false;

        if (response.status !== 0) {
          $scope.model.queryError = {
            title: response.statusText,
            description: response.data
          };
        }
      });
    };

    $scope.createComplexTable = function(headers, results) {
      $scope.cols = [];

      headers.forEach(function(header) {
        $scope.cols.push({
          field: header, 
          title: header, 
          sortable: header, 
          show: true
        });
      });

      var records = [];
      results.forEach(function(row) {
        var record = {};
        for (var i = 0; i < row.length; i++) {
          record[headers[i]] = row[i];
        }
        records.push(record);
      });

      var initialParams = {
        count: $scope.widget.dataModelOptions.pageLength, // count per page
        sorting: {}
      };
      initialParams.sorting[headers[0]] = 'desc';
    };

    $scope.executeSimpleQuery = function(start) {
      $scope.model.loadingResults = false;
    };

    $scope.createHighcharts = function(count, headers, results) {
      var chartType = $scope.widget.dataModelOptions.chart;

      if (results[0].length === count) {
        $scope.shouldShowChart = false;
        $scope.isGridCollapsed = false;
      } else {
        $scope.shouldShowChart = true;
        $scope.isGridCollapsed = true;
      }

      if (chartType === 'column')
        $scope.createColumnHighcharts(count, headers, results);
      else
        $scope.createPieHighcharts(count, headers, results);
    };

    // Create a column chart
    $scope.createColumnHighcharts = function(count, headers, results) {
      var categories = [];
      var series = [];

      // count is number of groupby fields.
      // Skip all groupby fields.
      for (var i = count; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < count; i++) {
          groups.push(row[i]);
        }
        categories.push(groups.join(','));

        for (i = count; i < row.length; i++) {
          series[i-count].data.push(row[i]);
        }
      });

      $scope.highchartConfig = {
        options: {
          chart: {
            type: 'column'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        series: series
      };
    };

    // Create a pie chart
    $scope.createPieHighcharts = function(count, headers, results) {
      var colors = Highcharts.getOptions().colors;
      var measures = [];
      var series = [];

      // count is number of groupby fields.
      // Skip all groupby fields.
      for (var i = count; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
        measures.push(headers[i]);
      }

      var rings = series.length;
      if (rings > 1) {
        var percent = Math.floor(100/rings);
        var ring = 0;

        // The innermost ring
        series[ring].size = percent + '%';
        /*series[ring].dataLabels = {
          distance: -30
        };*/

        for (ring = 1; ring < rings; ring++) {
          series[ring].innerSize = percent*ring + '%';
          series[ring].size = percent*(ring+1) + '%';
          /*series[ring].dataLabels = {
            distance: (0-percent*ring)
          };*/
        }
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < count; i++) {
          groups.push(row[i]);
        }
        var category = groups.join(',');

        for (i = count; i < row.length; i++) {
          series[i-count].data.push({
            name: category,
            color: colors[i-count],
            y: row[i]
          });
        }
      });

      var title = 'Measures: ' + measures;

      $scope.highchartConfig = {
        options: {
          chart: {
            type: 'pie'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            pie: {
              showInLegend: true,
              shadow: false,
              center: ['50%', '50%'],
              dataLabels: {
                enabled: true,
                useHTML: false,
                format: '<b>{point.name} {series.name}</b>: {point.percentage:.1f}%',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: title
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        series: series
      };
    };

    // Kick off
    $scope.getDbConfig();
  }
})();

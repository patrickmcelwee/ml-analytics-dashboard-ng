(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlSmartGridCtrl', mlSmartGridCtrl);

  mlSmartGridCtrl.$inject = ['$scope', '$http', '$q'];

  function mlSmartGridCtrl($scope, $http, $q) {
    $scope.widget.mode = 'Design';
    $scope.isGridCollapsed  = true;
    $scope.shouldShowChart = false;

    $scope.model = {
      queryError: null,
      configError: null,
      results: null,
      loadingConfig: false,
      loadingResults: false
    };

    $scope.deferredAbort = null;

    $scope.initializeQuery = function() {
      $scope.data.operation = 'and-query';
      $scope.data.rootQuery = {};
      $scope.data.rootQuery[$scope.data.operation] = {
        'queries': $scope.data.query
      };
      $scope.data.serializedQuery = {
        'result-type': 'group-by',
        columns: [],
        computes: [],
        options: ['headers=true'],
        query: {
          query: {
            queries: [$scope.data.rootQuery],
            qtext: ''
          }
        }
      };
      // if ($scope.data.groupingStrategy === 'collection' && $scope.data.directory) {
      //   $scope.data.serializedQuery.query.query.queries.push({
      //     'collection-query': {
      //       'uri': [$scope.data.directory]
      //     }
      //   });
      // }
    };

    if ($scope.widget.dataModelOptions.data) {
      $scope.data = $scope.widget.dataModelOptions.data;
      if ($scope.widget.dataModelOptions.data.serializedQuery) {
        var query = $scope.widget.dataModelOptions.data.serializedQuery.query.query.queries[0];
        var operation = Object.keys(query)[0];
        $scope.data.query = query[operation].queries;
        $scope.data.operation = operation;
        $scope.data.rootQuery[$scope.data.operation] = {
          'queries': $scope.data.query
        };
        $scope.data.serializedQuery.query.query.queries = [$scope.data.rootQuery];
      }
    } else {
      $scope.data = {
        groupingStrategy: 'collection',
        query: [],
        needsUpdate: true,
        originalDocs: []
      };
      $scope.initializeQuery();
    }

    $scope.executor = {};

    $scope.clearResults = function() {
      $scope.model.results = null;
    };

    // TODO: move into column/row directive
    $scope.dataManager = {
      removeCompute: function(index) {
        $scope.data.serializedQuery.computes.splice(index, 1);
      },
      removeColumn: function(index) {
        $scope.data.serializedQuery.columns.splice(index, 1);
      }
    };

    // TODO: move into showQuery directive?
    $scope.renderGroupByConfig = function() {
      return angular.toJson($scope.data.serializedQuery, true);
    };
    $scope.showGroupByConfig = function() {
      $scope.groupByConfigIsHidden = false;
    };
    $scope.hideGroupByConfig = function() {
      $scope.groupByConfigIsHidden = true;
    };
    $scope.hideGroupByConfig();

    $scope.shortName = function(field) {
      return field.localname || field['path-expression'];
    };

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.data.groupingStrategy
      };

      $scope.model.loadingConfig = true;

      if ($scope.data.targetDatabase) {
        params['rs:database'] = $scope.data.targetDatabase;
      }

      $scope.clearResults();

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
          if (!_.includes($scope.data.directories, $scope.data.directory)) {
            $scope.data.directory = undefined;
            $scope.initializeQuery();
          }
          $scope.data.fields = docs[$scope.data.directory];

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
      $scope.data.needsUpdate = true;
    };

    $scope.save = function() {
      $scope.widget.dataModelOptions.data = $scope.data;
      $scope.options.saveDashboard();
    };

    $scope.execute = function() {
      var columns, computes;
      if ($scope.data.serializedQuery) {
        columns  = $scope.data.serializedQuery.columns;
        computes = $scope.data.serializedQuery.computes;
      } else {
        columns  = [];
        computes = [];
      }

      if (columns.length + computes.length > 0) {
        $scope.model.loadingResults = true;
        $scope.executeComplexQuery(columns.length);
      }
    };

    $scope.executeComplexQuery = function(columnCount) {
      var params = {};

      $scope.model.loadingResults = true;
      $scope.clearResults();

      $scope.deferredAbort = $q.defer();
      $http({
        method: 'POST',
        url: '/v1/resources/group-by',
        params: params,
        data: $scope.data.serializedQuery,
        timeout: $scope.deferredAbort.promise
      }).then(function(response) {
        $scope.model.results = response.data;
        $scope.model.queryError = null;
        $scope.model.loadingResults = false;

        $scope.createComplexTable($scope.model.results.headers, $scope.model.results.results);
        $scope.createHighcharts(columnCount, $scope.model.results.headers, $scope.model.results.results);

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

    $scope.createHighcharts = function(columnCount, headers, results) {
      var chartType = $scope.widget.dataModelOptions.chart;

      if (results[0] && results[0].length === columnCount) {
        $scope.shouldShowChart = false;
        $scope.isGridCollapsed = false;
      } else {
        $scope.shouldShowChart = true;
        $scope.isGridCollapsed = true;
      }

      if (chartType === 'column')
        $scope.createColumnHighcharts(columnCount, headers, results);
      else
        $scope.createPieHighcharts(columnCount, headers, results);
    };

    // Create a column chart
    $scope.createColumnHighcharts = function(columnCount, headers, results) {
      var categories = [];
      var series = [];

      // columnCount is number of groupby fields.
      // Skip all groupby fields.
      for (var i = columnCount; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < columnCount; i++) {
          groups.push(row[i]);
        }
        categories.push(groups.join(','));

        for (i = columnCount; i < row.length; i++) {
          series[i-columnCount].data.push(row[i]);
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
    $scope.createPieHighcharts = function(columnCount, headers, results) {
      var colors = Highcharts.getOptions().colors;
      var measures = [];
      var series = [];

      // columnCount is number of groupby fields.
      // Skip all groupby fields.
      for (var i = columnCount; i < headers.length; i++) {
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
        for (var i = 0; i < columnCount; i++) {
          groups.push(row[i]);
        }
        var category = groups.join(',');

        for (i = columnCount; i < row.length; i++) {
          series[i-columnCount].data.push({
            name: category,
            color: colors[i-columnCount],
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

    $scope.$watch('data.directory', function() {
      $scope.data.fields = $scope.data.originalDocs[$scope.data.directory];
    });

    $scope.$watch('data.operation', function(newOperation, oldOperation) {
      if (newOperation !== oldOperation) {
        delete $scope.data.rootQuery[oldOperation];
        $scope.data.rootQuery[newOperation] = {
          'queries': $scope.data.query
        };
      }
    });

    // Kick off
    $scope.getDbConfig();
  }
})();

(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.chart').
    controller('mlAnalyticsChartCtrl', mlAnalyticsChartCtrl);

  mlAnalyticsChartCtrl.$inject = ['$scope', '$http', '$q'];

  function mlAnalyticsChartCtrl($scope, $http, $q) {
    $scope.isGridCollapsed  = true;
    $scope.shouldShowChart = false;
    $scope.shouldShowGrid = false;

    $scope.queryState = {
      queryError: null,
      configError: null,
      results: null,
      loadingResults: false
    };

    var clearResults = function() {
      $scope.shouldShowChart = false;
      $scope.shouldShowGrid = false;
      $scope.queryState.results = {};
    };

    var executeComplexQuery = function(columnCount) {
      var params = {};

      $scope.queryState.loadingResults = true;
      clearResults();

      $scope.deferredAbort = $q.defer();
      $http({
        method: 'POST',
        url: '/v1/resources/group-by',
        params: params,
        data: $scope.analyticsConfig.serializedQuery,
        timeout: $scope.deferredAbort.promise
      }).then(function(response) {
        $scope.queryState.results = response.data;
        $scope.queryState.queryError = null;
        $scope.queryState.loadingResults = false;

        createHighcharts(columnCount, $scope.queryState.results.headers, $scope.queryState.results.results);

      }, function(response) {
        $scope.queryState.loadingResults = false;

        if (response.status !== 0) {
          $scope.queryState.queryError = {
            title: response.statusText,
            description: response.data
          };
        }
      });
    };

    $scope.execute = function() {
      if ($scope.analyticsConfig && $scope.analyticsConfig.serializedQuery) {
        var columns  = $scope.analyticsConfig.serializedQuery.columns;
        var computes = $scope.analyticsConfig.serializedQuery.computes;

        if (columns.length + computes.length > 0) {
          $scope.queryState.loadingResults = true;
          executeComplexQuery(columns.length);
        } else {
          clearResults();
        }
      } else {
        clearResults();
      }
    };

    // Create a column chart
    var createColumnHighcharts = function(columnCount, headers, results) {
      var categories = [];
      var series = [];
      var i;

      // columnCount is number of groupby fields.
      // Skip all groupby fields.
      for (i = columnCount; i < headers.length; i++) {
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
    var createPieHighcharts = function(columnCount, headers, results) {
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

    var createHighcharts = function(columnCount, headers, results) {

      if (results[0] && results[0].length === columnCount) {
        $scope.shouldShowChart = false;
        $scope.shouldShowGrid = true;
        $scope.isGridCollapsed = false;
      } else {
        $scope.shouldShowChart = true;
        $scope.shouldShowGrid = true;
        $scope.isGridCollapsed = true;
      }

      switch ($scope.analyticsConfig.chartType) {
        case 'column':
          createColumnHighcharts(columnCount, headers, results);
          break;
        case 'pie':
          createPieHighcharts(columnCount, headers, results); 
          break;
        default:
          createColumnHighcharts(columnCount, headers, results);
      }
    };

    $scope.$watch('analyticsConfig', function(newConfig, oldConfig) {
      if (newConfig) {
        $scope.execute();
      }
    }, true);

  }
}());

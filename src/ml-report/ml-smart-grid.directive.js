(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report').directive('mlSmartGrid', ['$compile', 'MLRest',
    function($compile, mlRest) {

    return {
      restrict: 'A',
      replace: false,
      templateUrl: '/templates/ml-report/chart-builder.html',
      controller: function($scope, $http, $q, $filter) {
        // Set the initial mode for this widget to View.
        $scope.widget.mode = 'View';

  /*
        $scope.data.fields = {
          'state': {type: 'string', classification: 'json-property'},
          'city': {type: 'string', classification: 'element', ns: 'claim-ns'},
          'payor': {type: 'string', classification: 'field', collation: 'claim-collation'},
          'payment': {type: 'number', classification: 'element', ns: '', minimum: 10, maximum: 900},
          'paid': {type: 'boolean', classification: 'json-property', ns: '', }
        };
  */
        $scope.model = {
          queryConfig: null,
          queryError: null,
          config: null,
          configError: null,
          results: null,
          includeFrequency: false,
          loadingConfig: false,
          loadingResults: false,
          groupingStrategy: 'root',
          showBuilder: false
        };

        if ($scope.widget.dataModelOptions.groupingStrategy) {
          $scope.model.groupingStrategy = $scope.widget.dataModelOptions.groupingStrategy;
        }

        $scope.deferredAbort = null;

        $scope.data = {};
        $scope.data.docs = [];
        $scope.data.fields = {};
        $scope.data.operation = 'and-query';
        $scope.data.query = [];
        $scope.data.dimensions = [];
        $scope.data.needsUpdate = true;
        $scope.data.needsRefresh = true;
        $scope.data.directory = $scope.widget.dataModelOptions.directory;
        $scope.data.directory_model = null;
        $scope.data.parameters = $scope.widget.dataModelOptions.parameters;

        $scope.executor = {};
        $scope.executor.transform = 'smart-filter';
        $scope.executor.disableRun = true;
        $scope.executor.disableDownload = true;

        $scope.grid = {
          page: 1,
          total: 0
        };

        $scope.clearResults = function() {
          $scope.model.results = null;
          $scope.executor.dimensions = [];
          $scope.executor.results = [];
          $scope.executor.disableDownload = true;
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

          $scope.data.docs = [];
          $scope.data.fields = {};

          $http.get('/v1/resources/index-discovery', {
            params: params
          }).then(function(response) {
            $scope.model.loadingConfig = false;

            if (response.data.errorResponse) {
              $scope.model.configError = response.data.errorResponse.message;
              return;
            }

            $scope.model.config = response.data;

            var docsExist = !angular.equals($scope.model.config.docs, {});
            if (docsExist) {
              $scope.model.configError = null;

              var docs = $scope.model.config.docs;
              var keys = Object.keys(docs);

              // For each configured doc
              keys.forEach(function(key) {
                var doc = {
                  id: key, 
                  name: key,
                  fields: {}
                };
                var indexes = docs[key];

                indexes.forEach(function(index) {
                  var field = {
                    type: index['scalar-type']
                  };
                  field['ref-type'] = index['ref-type'];

                  var ns = index['namespace-uri'];
                  if (ns || ns === '') {
                    field.ns = ns;
                  }

                  var collation = index.collation;
                  if (collation) {
                    field.collation = collation;
                  }

                  if (index.localname) {
                    if (index['parent-localname']) {
                      // attribute range index
                      field.classification = 'attribute';
                      field['parent-localname'] = index['parent-localname'];
                      field['parent-namespace-uri'] = index['parent-namespace-uri'];
                    } else {
                      // element range index
                      field.classification = 'element';
                    }
                    doc.fields[index.localname] = field;
                  } else if (index['path-expression']) {
                    // path range index
                    field.classification = 'path-expression';
                    doc.fields[index['path-expression']] = field;
                  }
                });

                $scope.data.docs.push(doc);
              });

              for (var i = 0; i < $scope.data.docs.length; i++) {
                var model = $scope.data.docs[i];
                if (model.id === $scope.data.directory) {
                  $scope.data.directory_model = model;
                  $scope.setDocument();
                  break;
                }
              }

              $scope.executor.disableRun = false;
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
          if ($scope.data.directory_model) {
            var directory = $scope.data.directory_model.id;
            $scope.data.directory = directory;
            $scope.executor.dimensions = [];
            $scope.executor.results = [];

            for (var i = 0; i < $scope.data.docs.length; i++) {
              var doc = $scope.data.docs[i];
              if (doc.id === directory) {
                $scope.data.fields = doc.fields;
                break;
              }
            }
            $scope.data.operation = 'and-query';
            $scope.data.query = [];
            $scope.data.dimensions = [];

            if (directory === $scope.widget.dataModelOptions.directory) {
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

              if ($scope.widget.dataModelOptions.dimensions) {
                angular.copy($scope.widget.dataModelOptions.dimensions, $scope.data.dimensions);
              } else {
                $scope.data.dimensions = [];
              }
            } else {
              $scope.data.operation = 'and-query';
              $scope.data.query = [];
              $scope.data.dimensions = [];
            }

            $scope.data.needsUpdate = true;
            $scope.data.needsRefresh = true;

            $scope.model.showBuilder = true;
          } else {
            $scope.model.showBuilder = false;
          }
        };

        $scope.save = function() {
          $scope.widget.dataModelOptions.database = $scope.model.config['current-database'];
          $scope.widget.dataModelOptions.groupingStrategy = $scope.model.groupingStrategy;
          $scope.widget.dataModelOptions.directory = $scope.data.directory_model.id;

          $scope.widget.dataModelOptions.query = {};
          $scope.widget.dataModelOptions.dimensions = [];

          angular.copy($scope.data.structuredQuery, $scope.widget.dataModelOptions.query);
          angular.copy($scope.data.dimensions, $scope.widget.dataModelOptions.dimensions);

          $scope.options.saveDashboard();
        };

        $scope.download = function() {
          var data = [];

          var headerRow = [];
          if ($scope.model.results) {
            // Complex query
            $scope.model.results.headers.forEach(function(header) {
              headerRow.push(header); 
            });
            data.push(headerRow);

            $scope.model.results.results.forEach(function(result) {
              data.push(result); 
            });
          } else if ($scope.executor.results.length > 0) {
            // Simple query
            $scope.executor.dimensions.forEach(function(dimension) {
              headerRow.push(dimension.name); 
            });
            data.push(headerRow);

            $scope.executor.results.forEach(function(result) {
              data.push(result); 
            });
          }

          $http({
            method: 'POST',
            url: '/api/report/prepare',
            data: {data : data}
          }).then(function(response) {
            // You can't download file through Ajax.
            window.location = '/api/report/download';
          }, function(response) {
            // error
          });
        };

        $scope.execute = function() {
          var dimensions = $scope.widget.dataModelOptions.dimensions;
          // Number of groupby fields.
          var count = 0;

          dimensions.forEach(function(dimension) {
            if (dimension.groupby) count++;
          });

          // If there is no groupby dimension, we will do simple 
          // search, otherwise we will do aggregate computations.
          $scope.model.loadingResults = true;
          if (count)
            $scope.executeComplexQuery(count);
          else
            $scope.executeSimpleQuery(1);
        };

        $scope.getColumn = function(name) {
          var directory = $scope.widget.dataModelOptions.directory;
          var fields = $scope.model.config.docs[directory];
          for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (name === field.localname || name === field['path-expression'])
              return field;
          }
          return null;
        };

        function getParameterValue(name) {
          var parameters = $scope.widget.dataModelOptions.parameters;

          for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i];
            var temp = '#' + parameter.name + '#';
            if (name === temp)
              return parameter.value;
          }

          return null;
        }

        function setQueryParameters(query) {
          var type = typeof query;

          if (type == 'object') {
            for (var key in query) {
              if (key === 'text' || key === 'value') {
                var value = getParameterValue(query[key]);
                if (value !== null)
                  query[key] = value;
              } else {
                setQueryParameters(query[key]);
              }
            }
          }
        }

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

          setQueryParameters(queries);

          var query = {
            'queries': queries
          };

          if ($scope.widget.mode === 'View' && $scope.executor.simple) {
            query.qtext = $scope.executor.simple;
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

          var dimensions = $scope.widget.dataModelOptions.dimensions;
          dimensions.forEach(function(dimension) {
            var key = Object.keys(dimension)[0];

            if (key !== 'atomic') {
              var name = dimension[key].field;
              var column = $scope.getColumn(name);

              if (key === 'groupby') {
                queryConfig.columns.push(column);
              } else {
                queryConfig.computes.push({
                  fn: key,
                  ref: column
                });
              }
            }
          });

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

            $scope.executor.disableDownload = false;
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

        $scope.createSimpleTable = function(headers, results) {
          $scope.cols = [
            //{ field: "name", title: "Name", sortable: "name", show: true },
            //{ field: "age", title: "Age", sortable: "age", show: true },
            //{ field: "money", title: "Money", show: true }
          ];

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
            page: 1, // show first page
            count: $scope.widget.dataModelOptions.pageLength, // count per page
            sorting: {}
          };
          initialParams.sorting[headers[0]] = 'desc';

          var total = $scope.grid.total;
        };

        $scope.createComplexTable = function(headers, results) {
          $scope.cols = [
            //{ field: "name", title: "Name", sortable: "name", show: true },
            //{ field: "age", title: "Age", sortable: "age", show: true },
            //{ field: "money", title: "Money", show: true }
          ];

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
            page: 1, // show first page
            count: $scope.widget.dataModelOptions.pageLength, // count per page
            sorting: {}
          };
          initialParams.sorting[headers[0]] = 'desc';
        };

        $scope.fetchPage = function() {
          var start = 1 + ($scope.grid.page - 1) * $scope.widget.dataModelOptions.pageLength;

          $scope.model.loadingResults = true;
          $scope.executeSimpleQuery(start);
        };

        $scope.executeSimpleQuery = function(start) {
          $scope.model.loadingResults = false;
          // var queries;
          // if ($scope.widget.dataModelOptions.query.query) {
          //   queries = $scope.widget.dataModelOptions.query.query.queries;
          // } else {
          //   queries = [];
          // }

          // setQueryParameters(queries);

          // var query = {
          //   'queries': queries
          // };

          // var search = {
          //   'search': {
          //     'query': query
          //   }
          // };

          // if ($scope.widget.mode === 'View' && $scope.executor.simple) {
          //   query.qtext = $scope.executor.simple;
          // }

          // var params = {
          //   'pageLength': $scope.widget.dataModelOptions.pageLength,
          //   'start': start, // current pagination offset
          //   'category': 'content',
          //   'view': 'metadata',
          //   'format': 'json'
          // };
          // var directory = $scope.widget.dataModelOptions.directory;
          // if (directory) {
          //   params.directory = '/' + directory + '/';
          // }

          // $scope.clearResults();

          // var dimensions = $scope.widget.dataModelOptions.dimensions;
          // var headers = [];

          // dimensions.forEach(function(dimension) {
          //   var key = Object.keys(dimension)[0];
          //   var name = dimension[key].field;
          //   var type = $scope.data.fields[name].type;
          //   var item = {name: name, type: type};
          //   $scope.executor.dimensions.push(item);
          //   headers.push(name);
          // });

          // // We need two transforms: one for JSON, one for XML.
          // // These transforms filter the document. The XML
          // // transform also converts am XML document to JSON.
          // if ($scope.executor.transform) {
          //   // params.transform = $scope.executor.transform;

          //   $scope.executor.dimensions.forEach(function(dimension) {
          //     params['trans:' + dimension.name] = dimension.type;
          //   });
          // }

          // mlRest.search(params, search).then(function(response) {
          //   $scope.model.loadingResults = false;

          //   var contentType = response.headers('content-type');
          //   var pageResults = MarkLogic.Util.parseMultiPart(response.data, contentType);
          //   var results = pageResults.results;

          //   $scope.grid.total = pageResults.metadata.total;

          //   results.forEach(function(result) {
          //     var item = [];
          //     $scope.executor.dimensions.forEach(function(dimension) {
          //       var name = dimension.name;
          //       item.push(result[name]);
          //     });

          //     console.log('pushing item into executor: ' + item);
          //     $scope.executor.results.push(item);
          //   });

          //   $scope.executor.disableDownload = false;

          //   $scope.createSimpleTable(headers, $scope.executor.results);
          // });
        };

        $scope.createHighcharts = function(count, headers, results) {
          var chartType = $scope.widget.dataModelOptions.chart;

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
      },

      link: function($scope, element, attrs) {
        $scope.element = element;

        $scope.$watch('widget.mode', function(mode) {
          $scope.data.needsUpdate = true;
          $scope.data.needsRefresh = true;
        });
      }
    };
  }]);
}());

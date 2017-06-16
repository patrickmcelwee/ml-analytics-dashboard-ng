(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.embed').
    directive('mlAnalyticsEmbed', mlAnalyticsEmbed);

  mlAnalyticsEmbed.$inject = ['ReportService', '$http'];

  function mlAnalyticsEmbed(reportService, $http) {
    return {
      restrict: 'E',
      template: '<ml-analytics-chart analytics-config="config"></ml-analytics-chart>',
      scope: {
        reportUri: '=',
        chartId: '=',
        mlSearch: '=',
        dynamicConfig: '='
      },
      link: function(scope) {
        var widget, originalConfig, queryOptionsXML;

        reportService.getReport(scope.reportUri).then(function(response) {
          widget = _.find(response.data.widgets, function(widget) {
            return widget.dataModelOptions.chartMetadata.chartId === 
              scope.chartId;
          }) || response.data.widgets[0];
          originalConfig = widget.dataModelOptions.data;

          setSearchContext();
        });

        var setSearchContext = function() {
          if (originalConfig) {
            scope.config = _.cloneDeep(originalConfig);
            var serialized = scope.config.serializedQuery;

            serialized.queryOptions = queryOptionsXML;
            serialized.query.query.queries =
              originalConfig.serializedQuery.query.query.queries.concat(
                scope.mlSearch.getQuery().query.queries
              );
            serialized.query.query.qtext = 
              scope.mlSearch.qtext;
            if (scope.dynamicConfig) {
              if (scope.dynamicConfig.chartConfig) {
                scope.config = _.assign(
                  scope.config,
                  scope.dynamicConfig.chartConfig
                );
              }
              if (scope.dynamicConfig.queryConfig &&
                  scope.dynamicConfig.queryConfig.additionalQueries
              ) {
                scope.dynamicConfig.queryConfig.additionalQueries.forEach(function(additional) {
                  serialized.query.query.queries.push(additional);
                });
              }
            }
          }
        };

        var getQueryOptions = function() {
          var queryOptionsName = scope.mlSearch.getQueryOptions();
          return $http({
            method: 'GET',
            url: '/v1/config/query/' + queryOptionsName,
            headers: {
              'Accept': 'application/xml'
            }
          });
        };

        scope.$watch('mlSearch.results', function(newResults) {
          if (newResults && !angular.equals({}, newResults)) {
            if (queryOptionsXML) {
              setSearchContext();
            } else {
              getQueryOptions().then(function(response) {
                queryOptionsXML = response.data;
                setSearchContext();
              });
            }
          }
        });

      }
    };
  }

}());

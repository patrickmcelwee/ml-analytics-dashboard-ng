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
        mlSearch: '='
      },
      link: function(scope) {
        var widget, originalConfig, queryOptionsXML;

        reportService.getReport(scope.reportUri).then(function(response) {
          widget = _.find(response.data.widgets, function(widget) {
            return widget.dataModelOptions.chartMetadata.chartId === 
              scope.chartId;
          }) || response.data.widgets[0];
          originalConfig = widget.dataModelOptions.data;

          // TODO: right now, this could generate too many group-bys because it
          // runs twice, but this check sets up a race condition where the
          // chart fails to load if the search results return before all this
          // widget checking is finished 
          // if (!scope.mlSearch) {
          scope.config = originalConfig;
          // }
        });

        var setSearchContext = function() {
          if (originalConfig) {
            scope.config = angular.copy(originalConfig);
            scope.config.serializedQuery.queryOptions = queryOptionsXML;
            scope.config.serializedQuery.query.query.queries =
              originalConfig.serializedQuery.query.query.queries.concat(
                scope.mlSearch.getQuery().query.queries
              );
            scope.config.serializedQuery.query.query.qtext = 
              scope.mlSearch.qtext;
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

        scope.$watch('mlSearch.results', function(newResults, oldResults) {
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

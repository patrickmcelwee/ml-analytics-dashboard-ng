(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlSmartGridCtrl', mlSmartGridCtrl);

  mlSmartGridCtrl.$inject = ['$scope'];

  function mlSmartGridCtrl($scope) {
    $scope.widget.mode = 'Design';
    $scope.widget.editingResultsLimit = false;

    $scope.model = {
      loadingResults: false
    };

    $scope.initializeQuery = function() {
      $scope.chartMetadata = $scope.chartMetadata || {
        chartId: $scope.report.widgets.length
      };
      $scope.data = $scope.data || {
        chartType: 'column',
        query: [],
        needsUpdate: true
      };
      $scope.data.operation = 'and-query';
      $scope.data.rootQuery = {};
      $scope.data.rootQuery[$scope.data.operation] = {
        'queries': $scope.data.query
      };

      $scope.data.serializedQuery = {
        'result-type': 'group-by',
        columns: [],
        computes: [],
        options: ['headers=true', 'limit=' + $scope.report.defaultResultsLimit, 'item-order', 'ascending'],
        query: {
          query: {
            queries: [$scope.report.dataSource.constraint, $scope.data.rootQuery]
          }
        }
      };
    };

    var initializeFromSavedState = function() {
      $scope.initializeQuery();
      if ($scope.widget.dataModelOptions.chartMetadata) {
        $scope.chartMetadata = $scope.widget.dataModelOptions.chartMetadata;
      }
      if ($scope.widget.dataModelOptions.data.rootQuery) {
        $scope.data = angular.copy($scope.widget.dataModelOptions.data);
        // Wire up references between parts of the data structure
        // TODO? Eliminate these and just always use in-place?
        $scope.data.rootQuery[$scope.data.operation] = {
          'queries': $scope.data.query
        };
        $scope.data.serializedQuery.query.query.queries = [
          $scope.report.dataSource.constraint,
          $scope.data.rootQuery
        ];
      }
    };

    $scope.executor = {};

    // TODO: move into column/row directive
    $scope.dataManager = {
      removeCompute: function(index) {
        $scope.data.serializedQuery.computes.splice(index, 1);
      },
      removeColumn: function(index) {
        $scope.data.serializedQuery.columns.splice(index, 1);
      }
    };

    $scope.getResultsLimit = function() {
      var limitOption = _.find($scope.data.serializedQuery.options, function(option) {
        return _.startsWith(option, 'limit=');
      });
      if (limitOption) {
        return parseInt(limitOption.replace('limit=', ''));
      }
    };

    $scope.getResultsOrderOption = function() {
      var orderOption = _.find($scope.data.serializedQuery.options, function(option) {
        return _.endsWith(option, '-order');
      });
      if (orderOption) {
        return orderOption.replace('-order', '');
      }
    };

    $scope.getResultsOrderDirectionOption = function() {
      return _.find($scope.data.serializedQuery.options, function(option) {
        return option === 'ascending' || option === 'descending';
      });
    };

    $scope.setResultsLimit = function(newLimit) {
      var newOptions = _.filter($scope.data.serializedQuery.options, function(option) {
        return !_.startsWith(option, 'limit=');
      });
      newOptions.push('limit=' + newLimit);
      $scope.data.serializedQuery.options = newOptions;
    };

    $scope.setResultsOrderOption = function(newOrderOption) {
      var newOptions = _.filter($scope.data.serializedQuery.options, function(option) {
        return !_.endsWith(option, '-order');
      });
      newOptions.push(newOrderOption + '-order');
      $scope.data.serializedQuery.options = newOptions;
    };

    $scope.setResultsOrderDirectionOption = function(newOrderDirectionOption) {
      var newOptions = _.filter($scope.data.serializedQuery.options, function(option) {
        return option !== 'ascending' && option !== 'descending';
      });
      newOptions.push(newOrderDirectionOption);
      $scope.data.serializedQuery.options = newOptions;
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

    $scope.save = function() {
      $scope.widget.dataModelOptions.data = angular.copy($scope.data);
      $scope.widget.dataModelOptions.chartMetadata =
        angular.copy($scope.chartMetadata);
      $scope.options.saveDashboard();
    };

    $scope.revert = function() {
      initializeFromSavedState();
    };

    $scope.$watch('data.operation', function(newOperation, oldOperation) {
      if (newOperation !== oldOperation) {
        delete $scope.data.rootQuery[oldOperation];
        $scope.data.rootQuery[newOperation] = {
          'queries': $scope.data.query
        };
      }
    });

    var matchColumnToChangedField = function(field, columnOrCompute) {
      if (angular.equals(columnOrCompute.ref, field.ref)) {
        if (columnOrCompute.fn) {
          columnOrCompute.alias = columnOrCompute.fn + '(' + field.alias +  ')';
        } else {
          columnOrCompute.alias = field.alias;
        }
      }
    };

    $scope.$watch('report.dataSource.constraint', function() {
      $scope.data.serializedQuery.query.query.queries = [
        $scope.report.dataSource.constraint,
        $scope.data.rootQuery
      ];
    }, true);

    $scope.$watch('report.dataSource.fields', function(newFields, oldFields) {
      if (newFields && oldFields.length > 0) {
        var i;
        for (i=0; i<newFields.length; i++) {
          if (!angular.equals(newFields[i], oldFields[i])) {
            _.map(
              $scope.data.serializedQuery.columns,
              matchColumnToChangedField.bind(null, newFields[i])
            );
            _.map(
              $scope.data.serializedQuery.computes,
              matchColumnToChangedField.bind(null, newFields[i])
            );
          }
        }
      }
    }, true);

    // Kick off
    initializeFromSavedState();
  }
})();

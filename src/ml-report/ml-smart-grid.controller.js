(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlSmartGridCtrl', mlSmartGridCtrl);

  mlSmartGridCtrl.$inject = ['$scope', '$http', 'mlAnalyticsIndexService'];

  function mlSmartGridCtrl($scope, $http, indexService) {
    $scope.widget.mode = 'Design';

    $scope.model = {
      loadingResults: false
    };

    $scope.deferredAbort = null;

    $scope.initializeQuery = function() {
      $scope.data = $scope.data || {
        chartType: 'column',
        query: [],
        needsUpdate: true
      };
      $scope.data.metaConstraint = {};
      if ($scope.report.groupingStrategy === 'collection' && $scope.report.directory) {
        $scope.data.metaConstraint = {
          'collection-query': {
            'uri': [$scope.report.directory]
          }
        };
      }
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
            queries: [$scope.data.metaConstraint, $scope.data.rootQuery]
          }
        }
      };
    };

    var initializeFromSavedState = function() {
      $scope.initializeQuery();
      if ($scope.widget.dataModelOptions.data) {
        $scope.data = angular.copy($scope.widget.dataModelOptions.data);
        // Wire up references between parts of the data structure
        // TODO? Eliminate these and just always use in-place?
        $scope.data.rootQuery[$scope.data.operation] = {
          'queries': $scope.data.query
        };
        $scope.data.serializedQuery.query.query.queries = [
          $scope.data.metaConstraint,
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

    $scope.shortName = indexService.shortName;

    $scope.save = function() {
      $scope.widget.dataModelOptions.data = angular.copy($scope.data);
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

    // Kick off
    initializeFromSavedState();
  }
})();

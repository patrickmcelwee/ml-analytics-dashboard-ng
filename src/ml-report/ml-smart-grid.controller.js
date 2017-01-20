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
      $scope.data.metaConstraint = {};
      if ($scope.data.groupingStrategy === 'collection' && $scope.data.directory) {
        $scope.data.metaConstraint = {
          'collection-query': {
            'uri': [$scope.data.directory]
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
            queries: [$scope.data.metaConstraint, $scope.data.rootQuery],
            qtext: ''
          }
        }
      };
    };

    if ($scope.widget.dataModelOptions.data) {
      $scope.data = $scope.widget.dataModelOptions.data;
      // Wire up references between parts of the data structure
      // TODO? Eliminate these and just always use in-place?
      $scope.data.rootQuery[$scope.data.operation] = {
        'queries': $scope.data.query
      };
      $scope.data.serializedQuery.query.query.queries = [
        $scope.data.metaConstraint,
        $scope.data.rootQuery
      ];
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

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.data.groupingStrategy
      };

      $scope.model.loadingConfig = true;

      if ($scope.data.targetDatabase) {
        params['rs:database'] = $scope.data.targetDatabase;
      }

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

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard.source').
    controller('mlAnalyticsDataSourceCtrl', mlAnalyticsDataSourceCtrl);

  mlAnalyticsDataSourceCtrl.$inject = [
    '$scope', '$http', 'mlAnalyticsIndexService'
  ];

  function mlAnalyticsDataSourceCtrl($scope, $http, indexService) {
    var originalDocs = {};
    $scope.discovery = {};

    if (!$scope.report.dataSource) {
      $scope.report.dataSource = {
        groupingStrategy: 'collection',
        constraint: {}
      };
    }
    $scope.source = $scope.report.dataSource;

    var createFields = function(indexes) {
      return _.map(indexes, function(index) {
        return {
          alias: indexService.shortName(index, $scope.report.aliases),
          ref: index
        };
      });
    }; 

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.source.groupingStrategy
      };

      $scope.reportModel.loadingConfig = true;

      if ($scope.source.targetDatabase) {
        params['rs:database'] = $scope.source.targetDatabase;
      }

      $http.get('/v1/resources/index-discovery', {
        params: params
      }).then(function(response) {
        $scope.reportModel.loadingConfig = false;

        if (response.data.errorResponse) {
          $scope.reportModel.configError = response.data.errorResponse.message;
          return;
        }

        $scope.source.targetDatabase = response.data['current-database'];
        $scope.discovery.databases = response.data.databases;

        if (!_.isEmpty(response.data.docs)) {
          $scope.reportModel.configError = null;

          var docs = response.data.docs;
          originalDocs = docs;
          $scope.discovery.directories = Object.keys(docs);
          if (!_.includes($scope.discovery.directories, $scope.source.directory)) {
            $scope.source.directory = undefined;
          }
          $scope.source.fields = createFields(docs[$scope.source.directory]);

          if ($scope.source.fields) {
            // communicating with sq-builder
            $scope.report.needsUpdate = true;
          }

        } else {
          $scope.reportModel.configError = 'No documents with range indices in the database';
        }

      }, function(response) {
        $scope.reportModel.loadingConfig = false;
        $scope.reportModel.configError = response.data;
      });
    };
    $scope.getDbConfig(); 

    $scope.$watch('source.directory', function() {
      if ($scope.source.directory) {
        if ($scope.source.groupingStrategy === 'collection') {
          $scope.source.constraint = {
            'collection-query': {
              'uri': [$scope.source.directory]
            }
          };
        } else {
          $scope.source.constraint = {};
        }

        $scope.source.fields = createFields(
          originalDocs[$scope.source.directory]
        );
      } else {
        $scope.source.constraint = {};
      }
    }, true);

    $scope.$watch('report.dataSource', function(newSource, oldSource) {
      if (newSource) {
        $scope.source = $scope.report.dataSource;
      }
    });

  }
}());

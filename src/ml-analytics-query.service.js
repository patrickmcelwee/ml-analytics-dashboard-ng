/* global _ */
(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsQueryService', queryServiceFactory);

  queryServiceFactory.$inject = ['$http'];

  function queryServiceFactory($http) {
    function parse(queryRepresentation) {
      var references = {};
      _.each(queryRepresentation.columns, function(column) {
        var reference;
        switch(column.ref['ref-type']) {
          case 'element-reference':
            reference = {
              elementReference: {
                namespaceURI: column.ref['namespace-uri'],
                localname: column.ref.localname,
                scalarType: column.ref['scalar-type'],
                collation: column.ref.collation,
                nullable: false
              }
            };
            break;
        }
        references[column.alias] = reference;
      });

      return {
        '$optic': {
          'ns': 'op',
          'fn': 'operators',
          'args': [
            {
              'ns': 'op',
              'fn': 'from-lexicons',
              'args': [references, null, null]
            },
            {
              'ns': 'op',
              'fn': 'group-by',
              'args': [
                [
                  {
                    'ns': 'op',
                    'fn': 'col',
                    'args': _.map(queryRepresentation.columns, 'alias')
                  }
                ],
                null
              ]
            }
          ]
        }
      };
    }

    return {
      parse: parse,
      execute: function(query) {
        return $http({
          method: 'POST',
          url: '/v1/rows',
          data: parse(query)
        });
      }
    };
  }
})();

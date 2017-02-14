/* global _ */
(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsQueryService', queryServiceFactory);

  queryServiceFactory.$inject = ['$http'];

  function queryServiceFactory($http) {
    function convert(queryConfig) {
      var references = {};
      _.each(queryConfig.columns, function(column) {
        var reference;
        var referenceDetails = {
          namespaceURI: column.ref['namespace-uri'],
          localname: column.ref.localname,
          scalarType: column.ref['scalar-type'],
          collation: column.ref.collation,
          nullable: false
        };
        switch(column.ref['ref-type']) {
          case 'element-reference':
            reference = { elementReference: referenceDetails };
            break;
        }
        references[column.alias] = reference;
      });
      _.each(queryConfig.computes, function(column) {
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
        references[column.fieldAlias || column.alias] = reference;
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
                    'args': _.map(queryConfig.columns, 'alias')
                  }
                ],
                _.map(queryConfig.computes, function(compute) {
                  return {
                    ns: 'op',
                    fn: compute.fn,
                    args: [
                      {
                        ns: 'op',
                        fn: 'col',
                        args: [compute.alias]
                      },
                      {
                        ns: 'op',
                        fn: 'col',
                        args: [compute.fieldAlias]
                      },
                      null
                    ]
                  };
                })
              ]
            }
          ]
        }
      };
    }

    return {
      convert: convert,
      execute: function(query) {
        return $http({
          method: 'POST',
          url: '/v1/rows',
          data: convert(query)
        });
      }
    };
  }
})();

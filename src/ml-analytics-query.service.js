/* global _ */
(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsQueryService', queryServiceFactory);

  queryServiceFactory.$inject = ['$http'];

  function queryServiceFactory($http) {
    function convert(queryConfig) {
      var references = {};
      var addToReferences = function(field) {
        var reference;
        var referenceDetails = {
          namespaceURI: field.ref['namespace-uri'],
          localname: field.ref.localname,
          pathExpression: field.ref['path-expression'],
          scalarType: field.ref['scalar-type'],
          collation: field.ref.collation,
          nullable: false
        };
        switch(field.ref['ref-type']) {
          case 'element-reference':
            reference = { elementReference: referenceDetails };
            break;
          case 'path-reference':
            reference = {pathReference: referenceDetails};
            break;
          default:
            throw 'Unexpected ref-type: ' + field.ref['ref-type'];
        }
        references[field.fieldAlias || field.alias] = reference;
      };
      _.each(queryConfig.columns, addToReferences);
      _.each(queryConfig.computes, addToReferences);

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
                _.map(queryConfig.columns, function(column) {
                  return {
                    ns: 'op',
                    fn: 'col',
                    args: [column.alias]
                  };
                }),
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

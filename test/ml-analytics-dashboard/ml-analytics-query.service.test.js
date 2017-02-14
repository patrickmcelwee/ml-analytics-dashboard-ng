/* eslint-env jasmine */
/* global module, inject */
describe('mlAnalyticsQueryService', function() {
  var queryService;
  beforeEach(module('ml.analyticsDashboard'));

  beforeEach(function() {
    inject(function($injector) {
      queryService = $injector.get('mlAnalyticsQueryService');
    });
  });

  describe('parse', function() {
    var initialQuery =  {
      'columns': [
        {
          'alias': 'eyeColor',
          'ref': {
            'localname': 'eyeColor',
            'scalar-type': 'string',
            'collation': 'http://marklogic.com/collation/codepoint',
            'ref-type': 'element-reference',
            'namespace-uri': ''
          }
        }
      ],
      'computes': [],
      'query': {
        'query': {
          'queries': [
            {
              'collection-query': {
                'uri': [
                  'data/people'
                ]
              }
            },
            {
              'and-query': {
                'queries': []
              }
            }
          ]
        }
      }
    };

    it('converts to optic query', function() {
      var opticQuery = {
        '$optic': {
          'ns': 'op', 
          'fn': 'operators', 
          'args': [
            {
              'ns': 'op', 
              'fn': 'from-lexicons', 
              'args': [
                {
                  'eyeColor': {
                    'elementReference': {
                      'namespaceURI': '', 
                      'localname': 'eyeColor', 
                      'scalarType': 'string', 
                      'collation': 'http://marklogic.com/collation/codepoint', 
                      'nullable': false
                    }
                  } 
                }, 
                null, 
                null
              ]
            }, 
            {
              'ns': 'op', 
              'fn': 'group-by', 
              'args': [
                [
                  {
                    'ns': 'op', 
                    'fn': 'col', 
                    'args': [
                      'eyeColor' ]
                  }
                ], 
                null
              ]
            }
          ]
        }
      };
      expect(queryService.parse(initialQuery)).toEqual(opticQuery);
    });
  });

});

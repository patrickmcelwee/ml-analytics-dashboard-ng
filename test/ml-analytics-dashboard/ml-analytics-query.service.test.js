/* eslint-env jasmine */
/* global module, inject */
describe('mlAnalyticsQueryService', function() {
  'use strict';

  var queryService, config, expected;
  beforeEach(module('ml.analyticsDashboard'));

  beforeEach(function() {
    inject(function($injector) {
      queryService = $injector.get('mlAnalyticsQueryService');
    });

    config =  {
      'columns': [],
      'computes': [],
      'query': { 'query': { 'queries': [
        // {
        //   'collection-query': {
        //     'uri': [
        //       'data/people'
        //     ]
        //   }
        // },
        // {
        //   'and-query': {
        //     'queries': []
        //   }
        // }
      ]}}
    };

    expected = {
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
                  'args': [ 'eyeColor' ]
                }
              ], 
              []
            ]
          }
        ]
      }
    };
  });

  describe('convert', function() {
    var eyeColorConfig = {
      'alias': 'eyeColor',
      'ref': {
        'localname': 'eyeColor',
        'scalar-type': 'string',
        'collation': 'http://marklogic.com/collation/codepoint',
        'ref-type': 'element-reference',
        'namespace-uri': ''
      }
    };

    var docFormatConfig = {
      alias: 'docFormat',
      ref: {
        'path-expression': 'docFormat',
        'scalar-type': 'string',
        'collation': 'http://marklogic.com/collation/codepoint',
        'ref-type': 'path-reference'
      }
    };

    var avgAgeConfig = {
      alias: 'avg(age)',
      fieldAlias: 'age',
      ref: {
        'localname': 'age',
        'scalar-type': 'int',
        'ref-type': 'element-reference',
        'namespace-uri': ''
      },
      fn: 'avg'
    };


    it('converts single column to optic query', function() {
      config.columns = [eyeColorConfig];
      var result = queryService.convert(config);
      expect( JSON.stringify(result) ).toEqual( JSON.stringify(expected) );
    });

    it('converts two columns', function() {
      config.columns = [eyeColorConfig, docFormatConfig];
      expected.$optic.args[0].args[0].docFormat = {
        pathReference: {
          pathExpression: 'docFormat', 
          scalarType: 'string', 
          collation: 'http://marklogic.com/collation/codepoint', 
          nullable: false
        }
      };
      expected.$optic.args[1].args[0].push({
        ns: 'op',
        fn: 'col',
        args: ['docFormat']
      });
      var result = queryService.convert(config);
      expect( JSON.stringify(result) ).toEqual( JSON.stringify(expected) );
    });

    it('converts 1-column, 1-row', function() {
      var expectedAvgAge = {
        ns: 'op',
        fn: 'avg',
        args: [
          {
            ns: 'op',
            fn: 'col',
            args: ['avg(age)']
          },
          {
            ns: 'op',
            fn: 'col',
            args: ['age']
          },
          null
        ]
      };
      config.columns = [eyeColorConfig];
      config.computes = [avgAgeConfig];
      expected.$optic.args[0].args[0].age = {
        elementReference: {
          namespaceURI: '', 
          localname: 'age', 
          scalarType: 'int', 
          nullable: false
        }
      };
      expected.$optic.args[1].args[1] = [expectedAvgAge];
      var result = queryService.convert(config);
      expect( JSON.stringify(result) ).toEqual( JSON.stringify(expected) );
    });

  });


});

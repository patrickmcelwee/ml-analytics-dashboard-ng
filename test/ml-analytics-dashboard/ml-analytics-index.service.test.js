describe('mlAnalyticsIndexService', function() {
  var indexService;

  beforeEach(module('ml.analyticsDashboard'));

  beforeEach(function() {
    inject(function($injector) {
      indexService = $injector.get('mlAnalyticsIndexService');
    });
  });

  describe('highLevelType', function() {
    var expectations = {
      string: ['string', 'anyURI'],
      numeric: [
        'int', 'unsignedInt', 'long', 'unsignedLong', 'float',
        'double', 'decimal'
      ],
      date: [
        'dateTime', 'time', 'date', 'gMonthYear', 'gYear', 'gMonth',
        'gDay', 'yearMonthDuration', 'dayTimeDuration'
      ],
      geo: ['point', 'long-lat-point'],
      unknown: ['unknown']
    };

    it('sets the right highLevelTypes', function() {
      var index;
      var validate = function(expected) {
        expectations[expected].forEach(function(scalarType) {
          index = {'scalar-type': scalarType};
          expect(indexService.highLevelType(index)).toBe(expected);
        });
      };
      Object.keys(expectations).forEach(validate);
    });

    it('works when nested inside ref property', function() {
      var index;
      var validate = function(expected) {
        expectations[expected].forEach(function(scalarType) {
          index = {ref: {'scalar-type': scalarType}};
          expect(indexService.highLevelType(index)).toBe(expected);
        });
      };
      Object.keys(expectations).forEach(validate);
    });


  });

  describe('shortName', function() {

    it('first uses localname', function() {
      var index = {localname: 'name'};
      expect(indexService.shortName(index)).toBe('name');
    });

    it('includes the element for attribute indexes', function() {
      var index = {localname: 'attr', 'parent-localname': 'element'};
      expect(indexService.shortName(index)).toBe('element/@attr');
    });

    it('then uses path-expression', function() {
      var index = {'path-expression': 'name'};
      expect(indexService.shortName(index)).toBe('name');
    });

    it('allows indexes to be passed in as ref property', function() {
      var index = {ref: {localname: 'name'}};
      expect(indexService.shortName(index)).toBe('name');

      index = {ref: {localname: 'attr', 'parent-localname': 'element'}};
      expect(indexService.shortName(index)).toBe('element/@attr');

      index = {ref: {'path-expression': 'name'}};
      expect(indexService.shortName(index)).toBe('name');
    });

    it('will use an alias if available', function() {
      var index = {alias: 'alias', ref: {localname: 'name'}};
      expect(indexService.shortName(index)).toBe('alias');
    });

    it('will use an external alias object if available', function() {
      var index = {localname: 'name'};
      var aliases = {'name': 'alias'};
      expect(indexService.shortName(index, aliases)).toBe('alias');
    });
  });
});

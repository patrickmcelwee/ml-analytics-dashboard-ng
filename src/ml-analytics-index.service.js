(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsIndexService', indexServiceFactory);

  function indexServiceFactory() {

    function highLevelType(index) {
      if (index.ref) { index = index.ref; }
      var type = index['scalar-type'];
      switch (type) {
        case 'string':
        case 'anyURI':
          return 'string';
        case 'int':
        case 'unsignedInt':
        case 'long':
        case 'unsignedLong':
        case 'float':
        case 'double':
        case 'decimal':
          return 'numeric';
        case 'dateTime':
        case 'time':
        case 'date':
        case 'gMonthYear':
        case 'gYear':
        case 'gMonth':
        case 'gDay':
        case 'yearMonthDuration':
        case 'dayTimeDuration':
          return 'date';
        case 'point':
        case 'long-lat-point':
          return 'geo';
        default:
          return type;
      }
    }
     
    function shortName(index, aliases) {
      var name;
      if (index.alias) { return index.alias; }
      if (index.ref) { index = index.ref; }
      if (index.localname) {
        if (index['parent-localname']) {
          name = index['parent-localname'] + '/@' + index.localname;
        } else {
          name = index.localname;
        }
      } else {
        name = index['path-expression'];
      }
      return (aliases && aliases[name]) || name; }

    return {
      highLevelType: highLevelType,
      shortName: shortName
    };
  }
})();

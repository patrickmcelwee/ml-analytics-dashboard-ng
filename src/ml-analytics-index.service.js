(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsIndexService', indexServiceFactory);

  function indexServiceFactory() {
    return {
      highLevelType: function(index) {
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
    };
  }
})();

(function() {
  'use strict';

  angular.module('ml-dimension-builder')
    .directive('dimensionBuilder', dimensionBuilder);

  dimensionBuilder.$inject = ['mlAnalyticsIndexService'];

  function dimensionBuilder(indexService) {
    return {
      templateUrl: '/ml-dimension-builder/BuilderDirective.html',
      link: function(scope) {

        // generated by https://gist.github.com/joemfb/b682504c7c19cd6fae11
        var aggregates = {'by-type':{'float':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'unsignedInt':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'int':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'dateTime':['max','min','count'],'gYear':['max','min','count'],'gMonth':['max','min','count'],'yearMonthDuration':['max','sum','min','count','avg'],'decimal':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'anyURI':['count'],'dayTimeDuration':['max','sum','min','count','avg'],'date':['max','min','count'],'double':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'string':['count'],'gYearMonth':['max','min','count'],'time':['max','min','count'],'point':['max','min','count'],'unsignedLong':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'long':['variance','max','covariance-population','stddev','covariance','stddev-population','median','sum','min','count','avg','correlation','variance-population'],'gDay':['max','min','count']},'info':{'variance-population':{'reference-arity':1},'correlation':{'reference-arity':2},'avg':{'reference-arity':1},'count':{'reference-arity':1},'min':{'reference-arity':1},'sum':{'reference-arity':1},'median':{'reference-arity':1},'stddev-population':{'reference-arity':1},'covariance':{'reference-arity':2},'stddev':{'reference-arity':1},'covariance-population':{'reference-arity':2},'max':{'reference-arity':1},'variance':{'reference-arity':1}}};

        scope.indexService = indexService;

        scope.isColumnField = function(field) {
          return _.includes(
            ['string'], // no dates or geo yet
            indexService.highLevelType(field)
          );
        };

        scope.isComputeField = function(field) {
          return indexService.highLevelType(field) === 'numeric';
        };

        scope.addColumn = function(field) {
          scope.data.serializedQuery.columns.push(field);
        };

        scope.availableFns = function(field) {
          return aggregates['by-type'][ field.ref['scalar-type'] ].filter(function(fn) {
            //TODO: support arity=2
            return aggregates.info[ fn ]['reference-arity'] === 1;
          });
        };

        scope.addCompute = function(field, operation) {
          var compute = angular.copy(field);
          compute.fn = operation;
          compute.fieldAlias = compute.alias;
          compute.alias = operation + '(' + compute.alias +  ')';
          scope.data.serializedQuery.computes.push(compute);
        };

        scope.recordAlias = function(field) {
          var existingAliases = Object.keys(scope.report.aliases);
          existingAliases.forEach(function(existing) {
            if (angular.equals(scope.report.aliases[existing], field.ref)) {
              delete scope.report.aliases[existing];
            }
          });
          scope.report.aliases[field.alias] = field.ref;
        };

      }
    };
  }
})();

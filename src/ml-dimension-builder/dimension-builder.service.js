(function() {
  'use strict';

  angular.module('ml-dimension-builder')
    .factory('dimensionBuilderService', [
      function() {
        return {
          toFacets: toFacets,
          toDimensions: toDimensions,
        };
      }
    ]);

  function toFacets(dimensions, fieldMap) {
    var facets = dimensions.map(parseDimensionGroup.bind(dimensions, fieldMap));
    return facets;
  }

  function toDimensions(facets, fieldMap) {
    var dimensions = facets.map(parseFacetGroup.bind(facets, fieldMap)).filter(function(item) {
      return !! item;
    });
    return dimensions;
  }

  function parseDimensionGroup(fieldMap, group, truthy) {
    if (truthy !== false) truthy = true;

    var operation = Object.keys(group)[0];
    var obj = getDimensionTemplate('item');

    switch (operation) {
      case 'avg':
      case 'count':
      case 'max':
      case 'median':
      case 'min':
      case 'stddev':
      case 'stddev-population':
      case 'sum':
      case 'variance':
      case 'variance-population':
      case 'groupby':
      case 'atomic':
        obj.field = group[operation].field;
        obj.operation = operation;
        delete obj.value;
        break;
      default:
        obj.field = Object.keys(group[operation])[0];
        break;
    }

    return obj;
  }

  function parseFacetGroup(fieldMap, group) {
    var obj = {};

    if (group.type === 'group') {
      obj[group.operation] = group.rules.map(parseFacetGroup.bind(group, fieldMap)).filter(function(item) {
        return !! item;
      });
      return obj;
    }

    var fieldName = group.field;
    var fieldData = fieldMap[fieldName];

    if (! fieldName) return;

    switch (fieldData.type) {
      case 'string':
      case 'int':
      case 'long':
      case 'decimal':
      case 'boolean':
      case 'date':
        if (! group.operation) return;

        obj[group.operation] = {};
        obj[group.operation].field = fieldName;
        break;

      default:
        throw new Error('unexpected operation');
    }

    return obj;
  }

  function getDimensionTemplate(type) {
    var templates = {
      item: {
        field: '',
        operation: '',
        value: ''
      }
    };

    return angular.copy(templates[type]);
  }
})();

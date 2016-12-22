(function() {
  'use strict';

  // Convert filters into queries, and vice versa
  angular.module('ml-sq-builder')
    .factory('sqBuilderService', [
      function() {
        return {
          toFilters: toFilters,
          toQuery: toQuery,
        };
      }
    ]);

  function toFilters(query, fieldMap) {
    var filters = query.map(parseQueryGroup.bind(query, fieldMap));
    return filters;
  }

  function toQuery(filters, fieldMap) {
    var query = filters.map(parseFilterGroup.bind(filters, fieldMap)).filter(function(item) {
      return !! item;
    });
    return query;
  }

  function parseQueryGroup(fieldMap, group) {
    var typeMap = {
      'or-query': 'group',
      'and-query': 'group',
      'value-query': 'value',
      'word-query': 'word',
      'range-query': 'range'
    };

    // The group parameter is an element in the query array.
    var key = Object.keys(group)[0];
    var query = group[key];
    var type = typeMap[key];
    var obj = getFilterTemplate(type);

    switch (key) {
      case 'or-query':
      case 'and-query':
        obj.rules = group[key].queries.map(parseQueryGroup.bind(group, fieldMap));
        obj.subType = key;
        break;
      case 'value-query':
        obj.field = getConstraintName(query);
        obj.subType = key;

        var fieldData = fieldMap[obj.field];
        if (fieldData.type === 'boolean') {
          // group.text is true or false
          obj.value = query.text ? 1 : 0;
        } else {
          obj.value = query.text;
        }

        break;
      case 'word-query':
        obj.field = getConstraintName(query);
        obj.subType = key;
        obj.value = query.text;
        break;
      case 'range-query':
        if (query['path-index']) {
          obj.field = getConstraintName(query);
          obj.subType = 'value-query';
          obj.value = query.value;
        } else {
          obj.field = getConstraintName(query);
          obj.subType = query['range-operator'];
          obj.operator = obj.subType;
          obj.value = query.value;
        }
        break;
      default:
        throw new Error('unexpected query');
    }

    return obj;
  }

  function parseFilterGroup(fieldMap, group) {
    var obj = {};

    if (group.type === 'group') {
      obj[group.subType] = group.rules.map(parseFilterGroup.bind(group, fieldMap)).filter(function(item) {
        return !! item;
      });

      // The obj has only one property, its value is an array.
      // The key is equal to group.subType
      var key = Object.keys(obj)[0];
      var queries = {
        'queries': obj[key]
      };
      var queryObj = {};

      queryObj[key] = queries;

      return queryObj;
    }

    var fieldName = group.field;

    if (!group.field) return;

    switch (group.field['scalar-type']) {
      case 'string':
        // A query for a string field is translated 
        // to value-query or word-query or range-query.

        if (group.field['ref-type'] === 'path-reference') {
          // Convert path rule to range-query
          var dataType = 'xs:' + group.field['scalar-type'];
          obj['range-query'] = {
            'path-index': {
              'text': group.field['path-expression'],
              'namespaces': {}
            },
            'collation': group.field.collation,
            'type': dataType,
            'range-operator': 'EQ',
            'value': group.value
          };
        } else {
          // Convert element or attribute rule to value-query/word-query
          // Set the default subType for newly created query
          if (!group.subType) {
            group.subType = 'value-query';
          }

          var value = {
            'text': group.value
          };

          setConstraint(value, group.field);

          obj[group.subType] = value;
        }

        break;
      case 'int':
      case 'long':
      case 'decimal':
        // A query for a numeric field is translated 
        // to range-query.
        // The type is the type of the range index.

        // Set the default subType for newly created query
        if (!group.subType) {
          group.subType = 'EQ';
        }

        var dataType = 'xs:' + fieldData.type;

        var value = {
          'type': dataType,
          'range-operator': group.subType,
          'value': group.value
        };

        setConstraint(value, fieldName, fieldData);

        if (group.field['ref-type'] === 'path-reference') {
          value['path-index'] = {
            text: group.field['path-expression'],
            namespaces: {}
          };
        }

        obj['range-query'] = value;

        break;
      case 'boolean':
        // A query for a boolean field is translated 
        // to value-query.
        // group.value is 1 or 0

        // Set the default value for newly created query
        if (group.value === undefined)
          group.value = 1;

        var value = {
          'text': group.value ? true : false
        };

        if (fieldData.classification === 'json-property') {
          value.type = 'boolean';
        }

        setConstraint(value, fieldName, fieldData);

        obj['value-query'] = value;

        break;
      case 'date':
        // TO DO
        break;

      default:
        throw new Error('unexpected field type');
    }

    return obj;
  }

  function getConstraintName(query) {
    if (query['json-property']) {
      return query['json-property'];
    } else if (query.attribute) {
      return query.attribute.name;
    } else if (query.element) {
      return query.element.name;
    } else if (query.field) {
      return query.field.name;
    } else if (query['path-index']) {
      return query['path-index'].text; 
    }
  }

  // You must specify at least one element, json-property, 
  // or field to define the range constraint to apply to 
  // the query. These components are mutually exclusive.
  function setConstraint(value, field) {
    var claz = field['ref-type'];

    if (claz === 'json-property-reference') {
      value[claz] = field.localname;
    } else if (claz === 'element-reference' || claz === 'attribute-reference') {
      value[claz.split('-')[0]] = {
        name: field.localname,
        ns: field['namespace-uri']
      };
      if (claz === 'attribute-reference') {
        value.element = {
          name: field['parent-localname'],
          ns: field['parent-namespace-uri']
        };
      }
    } else if (claz === 'field') {
      value[claz] = {
        name: field.localname,
        collation: fieldData.collation
      };
    }
  }

  function getFilterTemplate(type) {
    var templates = {
      group: {
        type: 'group',
        subType: '',
        rules: []
      },
      value: {
        field: '',
        subType: '',
        value: ''
      },
      word: {
        field: '',
        subType: '',
        value: ''
      },
      range: {
        field: '',
        subType: '',
        operator: '',
        value: null
      }
    };

    return angular.copy(templates[type]);
  }

})();

/**
 * ml-dimension-builder
 *
 * Angular Module for building MarkLogic search dimensions
 */

(function(angular) {
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

})(window.angular);

(function(angular) {
  "use strict"; 

  angular.module("ml-dimension-builder").run(["$templateCache", function($templateCache) {
    $templateCache.put("ml-dimension-builder/BuilderDirective.html", 
      "<div class=\"dimension-builder\">" +
      "  <div class=\"filter-panels\">" +
      "    <div class=\"list-group form-inline\">" +
      "      <div data-ng-repeat=\"facet in facets\" data-dimension-builder-chooser=\"facet\" data-dimension-fields=\"data.fields\" data-on-remove=\"removeDimension($index)\" data-depth=\"0\"></div>" +
      "      <div class=\"list-group-item actions\">" +
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Dimension\" data-ng-click=\"addDimension()\">" +
      "          <i class=\"fa fa-plus\"> Add Dimension</i>" +
      "        </a>" +
      "     </div>" +
      "    </div>" +
      "  </div>" +
      "</div>");

    $templateCache.put("ml-dimension-builder/ChooserDirective.html", 
      "<div class=\"list-group-item dimension-builder-chooser\">" +
      "  <div data-dimension-builder-rule=\"item\" data-dimension-fields=\"dimensionFields\" data-on-remove=\"onRemove()\"></div>" +
      "</div>");

    $templateCache.put("ml-dimension-builder/RuleDirective.html", 
      "<div class=\"dimension-builder-rule\">" +
      "  <select class=\"form-control\" data-ng-model=\"rule.field\" data-ng-options=\"key as key for (key, value) in dimensionFields\"></select>" +
      "  <span data-dimension-type=\"getType()\" data-rule=\"rule\" data-guide=\"dimensionFields[rule.field]\"></span>" +
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" +
      "    <i class=\"fa fa-minus\"></i>" +
      "  </a>" +
      "</div>");

    // String type
    $templateCache.put("ml-dimension-builder/types/String.html", 
      "<span class=\"string-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Text\">" + 
      "      <option value=\"count\">count</option>" + 
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" +
      "      <option value=\"atomic\">atomic</option>" +
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "</span>");

    // Int type
    $templateCache.put("ml-dimension-builder/types/Int.html", 
      "<span class=\"integer-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" +  
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Long type
    $templateCache.put("ml-dimension-builder/types/Long.html", 
      "<span class=\"integer-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" +
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Decimal type
    $templateCache.put("ml-dimension-builder/types/Decimal.html", 
      "<span class=\"decimal-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" + 
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Boolean type
    $templateCache.put("ml-dimension-builder/types/Boolean.html", 
      "<span class=\"boolean-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "</span>");

    // Date type
    $templateCache.put("ml-dimension-builder/types/Date.html", 
      "<span class=\"date-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Generic\">" +
      "      <option value=\"groupby\">group by</option>" +
      "      <option value=\"atomic\">Standard</option>" +
      "    </optgroup>" +
      "  </select>" +
      "</span>");
  }]);
})(window.angular);

/**
 * ml-sq-builder
 *
 * Angular Module for building MarkLogic Structured Query
 */

(function(angular) {
  "use strict"; 

  angular.module("ml-sq-builder").run(["$templateCache", function($templateCache) {
    $templateCache.put("ml-sq-builder/BuilderDirective.html",
      "<div class=\"sq-builder\">" + 
      "  <div class=\"form-inline\">" +
      "    <p>If <select class=\"form-control\" data-ng-model=\"data.operation\">" + 
      "        <option value=\"and-query\">All</option>" + 
      "        <option value=\"or-query\">Any</option>" + 
      "      </select> of these conditions are met</p>" + 
      "  </div>" +
      "  <div class=\"filter-panels\">" + 
      "    <div class=\"list-group form-inline\">" + 
      "      <div data-ng-repeat=\"filter in filters\" data-sq-builder-chooser=\"filter\" data-sq-fields=\"data.fields\" data-sq-parameters=\"data.parameters\" data-on-remove=\"removeChild($index)\" data-depth=\"0\"></div>" + 
      "      <div class=\"list-group-item actions\">" +
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Rule\" data-ng-click=\"addRule()\">" + 
      "          <i class=\"fa fa-plus\"> Add Rule</i>" + 
      "        </a>" + 
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Group\" data-ng-click=\"addGroup()\">" + 
      "          <i class=\"fa fa-list\"> Add Group</i>" + 
      "        </a>" + 
      "      </div>" + 
      "    </div>" + 
      "  </div>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/ChooserDirective.html",
      "<div class=\"list-group-item sq-builder-chooser\" data-ng-class=\"getGroupClassName()\">" + 
      "  <div data-ng-if=\"item.type === \'group\'\" data-sq-builder-group=\"item\" data-depth=\"{{ depth }}\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-on-remove=\"onRemove()\"></div>" + 
      "  <div data-ng-if=\"item.type !== \'group\'\" data-sq-builder-rule=\"item\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-on-remove=\"onRemove()\"></div>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/GroupDirective.html",
      "<div class=\"sq-builder-group\">" +
      "  <h5>If" + 
      "    <select data-ng-model=\"group.subType\" class=\"form-control\">" + 
      "      <option value=\"and-query\">All</option>" + 
      "      <option value=\"or-query\">Any</option>" + 
      "    </select>" + 
      "    of these conditions are met" + 
      "  </h5>" + 
      "  <div data-ng-repeat=\"rule in group.rules\" data-sq-builder-chooser=\"rule\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-depth=\"{{ +depth + 1 }}\" data-on-remove=\"removeChild($index)\"></div>" + 
      "  <div class=\"list-group-item actions\" data-ng-class=\"getGroupClassName()\">" + 
      "    <a class=\"btn btn-xs btn-primary\" title=\"Add Sub-Rule\" data-ng-click=\"addRule()\">" + 
      "      <i class=\"fa fa-plus\"> Add Rule</i>" + 
      "    </a>" + 
      "    <a class=\"btn btn-xs btn-primary\" title=\"Add Sub-Group\" data-ng-click=\"addGroup()\">" + 
      "      <i class=\"fa fa-list\"> Add Sub-Group</i>" + 
      "    </a>" + 
      "  </div>" + 
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" + 
      "    <i class=\"fa fa-minus\"></i>" + 
      "  </a>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/RuleDirective.html",
      "<div class=\"sq-builder-rule\">" + 
      "  <select class=\"form-control\" data-ng-model=\"rule.field\" data-ng-options=\"key as key for (key, value) in sqFields\"></select>" + 
      "  <span data-sq-type=\"getType()\" data-rule=\"rule\" data-guide=\"sqFields[rule.field]\" data-parameters=\"sqParameters\"></span>" + 
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" + 
      "    <i class=\"fa fa-minus\"></i>" + 
      "  </a>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/types/String.html",
      "<span class=\"string-rule\">" +
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Text\">" + 
      "      <option value=\"word-query\">Contains</option>" + 
      "      <option value=\"value-query\">Equals</option>" +  
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Int.html",
      "<span class=\"integer-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Integer\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Long.html",
      "<span class=\"integer-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Integer\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Decimal.html",
      "<span class=\"decimal-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Decimal\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Boolean.html",
      "<span class=\"boolean-rule\">Equals" +  
      "  <select data-ng-model=\"rule.value\" class=\"form-control\" data-ng-options=\"booleans.indexOf(choice) as choice for choice in booleansOrder\"></select>" +
      "</span>");

    $templateCache.put("ml-sq-builder/types/Date.html",
      "<span class=\"date-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" + 
      "    <optgroup label=\"Date\">" + 
      "    </optgroup>" + 
      "  </select>" + 
      "</span>");
  }]);
})(window.angular);

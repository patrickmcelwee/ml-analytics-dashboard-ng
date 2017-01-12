(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-dimension-builder/BuilderDirective.html',
    '<div class="dimension-builder row ml-analytics-gutter-10"><div class="col-md-6"><div class="panel panel-default panel-sm"><div class="panel-heading"><span class="panel-title">Dimensions</span></div><ul class="list-unstyled panel-body"><li uib-dropdown="" ng-repeat="field in data.fields | filter:isColumnField"><a uib-dropdown-toggle=""><span tooltip-placement="right" uib-tooltip="Index type: {{field[\'ref-type\']}}; Namespace: {{field.ns}}"><span ng-switch="highLevelType(field[\'scalar-type\'])"><i class="fa fa-font" ng-switch-when="string"></i></span> {{shortName(field)}}</span></a><ul class="dropdown-menu"><li><a ng-click="addColumn(field)">Add Group By Column</a></li><li ng-repeat="fn in availableFns(field) | orderBy:\'toString()\'"><a ng-click="addCompute(field, fn)">Add {{fn}}</a></li></ul></li></ul></div></div><div class="col-md-6"><div class="panel panel-default panel-sm"><div class="panel-heading"><span class="panel-title">Measures</span></div><ul class="list-unstyled panel-body"><li uib-dropdown="" ng-repeat="field in data.fields | filter:isComputeField"><a uib-dropdown-toggle=""><span tooltip-placement="right" uib-tooltip="Index type: {{field[\'ref-type\']}}; Namespace: {{field.ns}}"><span ng-switch="highLevelType(field[\'scalar-type\'])"><i class="icon ion-pound" ng-switch-when="numeric"></i></span> {{shortName(field)}}</span></a><ul class="dropdown-menu"><li ng-repeat="fn in availableFns(field) | orderBy:\'toString()\'"><a ng-click="addCompute(field, fn)">Add {{fn}}</a></li></ul></li></ul></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/BuilderDirective.html',
    '<div class="sq-builder"><div class="form-inline"><p>If<select class="input-sm form-control" data-ng-model="data.operation"><option value="and-query">All</option><option value="or-query">Any</option></select>of these conditions are met</p></div><div class="filter-panels"><div class="form-inline"><div data-ng-repeat="filter in filters" data-sq-builder-chooser="filter" data-sq-fields="data.fields" data-on-remove="removeChild($index)" data-depth="0"></div><div class="actions"><a class="btn btn-xs btn-primary" title="Add Rule" data-ng-click="addRule()"><i class="fa fa-plus"></i> Add Rule</a> <a class="btn btn-xs btn-primary" title="Add Group" data-ng-click="addGroup()"><i class="fa fa-list"></i> Add Group</a></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/ChooserDirective.html',
    '<div class="sq-builder-chooser" data-ng-class="getGroupClassName()"><div data-ng-if="item.type === \'group\'" data-sq-builder-group="item" data-depth="{{ depth }}" data-sq-fields="sqFields" data-on-remove="onRemove()"></div><div data-ng-if="item.type !== \'group\'" data-sq-builder-rule="item" data-sq-fields="sqFields" data-on-remove="onRemove()"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/GroupDirective.html',
    '<div class="sq-builder-group"><h5><select data-ng-model="group.subType" class="input-sm form-control"><option value="and-query">All</option><option value="or-query">Any</option></select>of these conditions are met</h5><div data-ng-repeat="rule in group.rules" data-sq-builder-chooser="rule" data-sq-fields="sqFields" data-depth="{{ +depth + 1 }}" data-on-remove="removeChild($index)"></div><div class="actions" data-ng-class="getGroupClassName()"><a class="btn btn-xs btn-primary" title="Add Sub-Rule" data-ng-click="addRule()"><i class="fa fa-plus">Add Rule</i></a> <a class="btn btn-xs btn-primary" title="Add Sub-Group" data-ng-click="addGroup()"><i class="fa fa-list">Add Sub-Group</i></a></div><a class="btn btn-xs btn-danger remover" data-ng-click="onRemove()"><i class="fa fa-minus"></i></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/RuleDirective.html',
    '<div class="sq-builder-rule"><select class="input-sm form-control" data-ng-model="rule.field" data-ng-options="shortName(field) for field in sqFields"></select><span data-sq-type="rule.field[\'scalar-type\']" data-rule="rule" data-guide="sqFields[rule.field]"></span> <a class="btn btn-xs btn-danger remover" data-ng-click="onRemove()"><i class="fa fa-minus"></i></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/dashboard-content.html',
    '<div><div class="btn-toolbar" ng-if="!options.hideToolbar"><div class="btn-group" ng-if="!options.widgetButtons"><span class="dropdown" on-toggle="toggled(open)"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Button dropdown <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li ng-repeat="widget in widgetDefs"><a href="#" ng-click="addWidgetInternal($event, widget);" class="dropdown-toggle"><span class="label label-primary">{{widget.name}}</span></a></li></ul></span></div><div class="btn-group" ng-if="options.widgetButtons"><button ng-repeat="widget in widgetDefs" ng-click="addWidgetInternal($event, widget);" type="button" class="btn btn-primary"><span ng-if="widget.name === \'Chart Builder\'">Add Chart</span> <span ng-if="widget.name !== \'Chart Builder\'">{{widget.name}}</span></button></div><button ng-if="options.storage && options.explicitSave" ng-click="options.saveDashboard()" class="btn btn-success" ng-disabled="!options.unsavedChangeCount">{{ !options.unsavedChangeCount ? "all saved" : "save changes (" + options.unsavedChangeCount + ")" }}</button></div><div ui-sortable="sortableOptions" ng-model="widgets" class="dashboard-widget-area"><div ng-repeat="widget in widgets" ng-style="widget.containerStyle" class="widget-container" widget=""><div class="widget panel panel-default"><div class="widget-header panel-heading"><h4><span class="widget-title" ng-dblclick="editTitle(widget)" ng-hide="widget.editingTitle">{{widget.title}}</span><form action="" class="widget-title" ng-show="widget.editingTitle" ng-submit="saveTitleEdit(widget)"><input type="text" ng-model="widget.title" class="form-control"></form><span class="label label-primary" ng-if="!options.hideWidgetName">{{widget.name}}</span> <span ng-click="removeWidget(widget);" class="glyphicon glyphicon-remove" ng-if="!options.hideWidgetClose"></span> <span ng-click="openWidgetSettings(widget);" class="glyphicon glyphicon-cog" ng-if="!options.hideWidgetSettings"></span> <span ng-click="widget.contentStyle.display = widget.contentStyle.display === \'none\' ? \'block\' : \'none\'" class="glyphicon" ng-class="{\'glyphicon-plus\': widget.contentStyle.display === \'none\', \'glyphicon-minus\': widget.contentStyle.display !== \'none\' }"></span></h4></div><div class="panel-body widget-content" ng-style="widget.contentStyle"></div><div class="widget-ew-resizer" ng-mousedown="grabResizer($event)"></div><div ng-if="widget.enableVerticalResize" class="widget-s-resizer" ng-mousedown="grabSouthResizer($event)"></div></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/dashboard.html',
    '<div id="ml-analytics-dashboard"><div class="col-md-12"><div class="container-fluid"><ml-analytics-dashboard-home></ml-analytics-dashboard-home></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/designer.html',
    '<div class="row" id="ml-analytics-designer"><div class="col-md-12"><a ng-click="returnHome()" class="text-muted"><< All Reports</a><h2 class="view-title">{{report.name}}</h2><p>{{report.description}}</p><div dashboard="reportDashboardOptions" template-url="/templates/dashboard-content.html"></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/editor.html',
    '<div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to edit report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><span class="view-title">Edit Report</span><p>The fields marked with asterisk <i class="fa fa-asterisk mandatory-field"></i> are mandatory.</p><form name="editReportForm" ng-submit="updateReport()" novalidate=""><div class="form-group"><label class="control-label">Name <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="name" class="form-control" ng-model="report.name" readonly=""></div><div class="form-group"><label class="control-label">Description</label> <input type="text" name="description" class="form-control" ng-model="report.description"></div><div class="form-group" ng-class="{ \'has-error\' : editReportForm.classification.$invalid && !editReportForm.classification.$pristine }"><label class="control-label">Classification <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="classification" class="form-control" ng-model="report.classification" required=""><p ng-show="editReportForm.classification.$invalid && !editReportForm.classification.$pristine" class="help-block">Classification is required.</p></div><div class="form-group"><label class="control-label">Privacy</label><div class="hcontainer"><ul class="hoptions"><li ng-class="{current:isActive(\'public\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'public\')" ng-model="report.privacy" name="privacy" value="public">Public</label></div></li><li ng-class="{current:isActive(\'private\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'private\')" ng-model="report.privacy" name="privacy" value="private">Private</label></div></li></ul><div class="hpanel"><div class="hcontent" ng-class="{show:isActive(\'public\')}"><p>A public report is available for anyone to view.</p></div><div class="hcontent" ng-class="{show:isActive(\'private\')}"><p>A private report is only available for its owner.</p></div></div></div></div><div class="btn-toolbar" role="toolbar" style="margin-top:10px"><div class="btn-group pull-right"><button type="submit" class="btn btn-primary" ng-disabled="editReportForm.$invalid"><span class="fa fa-check"></span> Submit</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/home.html',
    '<div class="row"><div class="col-md-12" ng-if="mode === \'home\'"><h2 class="view-title">Welcome to the Analytics Dashboard</h2><p>Analytics Dashboard is an online reporting and business intelligence service that helps you easily analyze your business data, and create insightful reports for informed decision-making. It allows you to easily create and share powerful reports in minutes from MarkLogic database.</p><p>MarkLogic\'s full-text search engine makes it an ideal platform to power advanced search applications. MarkLogic’s full-text search includes faceting, real-time alerting, type-ahead suggestions, snippeting, language support, and much more.</p></div><manage-ml-analytics-dashboard></manage-ml-analytics-dashboard></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/manage.html',
    '<div><div class="col-md-12" ng-if="mode === \'home\'"><div ng-if="currentUser" class="btn-toolbar" style="margin-left:10px;margin-top:10px"><div class="btn-group"><button class="btn btn-primary" ng-click="newReportForm()"><span class="fa fa-plus"></span> New Report</button></div></div><div class="well"><h4 class="menu-title">Manage Reports</h4><p ng-if="!currentUser" style="padding-left:8px;">Please log in to view reports.</p><div class="alert alert-warning" ng-show="showLoading">Loading Reports...</div><form ng-if="currentUser" name="filterForm" class="filter-form" novalidate=""><input type="text" class="form-control" ng-model="search.name" placeholder="Filter reports"></form><div class="report-palette"><div class="report-container"><div class="report-container-inner"><div class="report-item" ng-repeat="report in reports | filter : search | orderBy:\'name\'" ng-click="gotoDesigner(report.uri)"><i class="fa fa-th"></i><span>{{report.name}}</span><div class="toolbar"><a class="btn btn-link" ng-click="showReportEditor(report); $event.stopPropagation();"><i class="fa fa-edit"></i></a><br><a class="btn btn-link" ng-click="deleteReport(report); $event.stopPropagation();"><i class="fa fa-trash-o"></i></a></div></div></div></div></div></div></div><ml-analytics-new-report ng-if="mode === \'new\'"></ml-analytics-new-report><ml-analytics-design ng-if="mode === \'design\'"></ml-analytics-design><ml-analytics-report-editor ng-if="mode === \'edit\'"></ml-analytics-report-editor></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/new-report.html',
    '<div><h1>Create New Report</h1><div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to create new report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><p>A report primarily consists of widgets. This view will create a blank report. You can then add widgets into the report using the Report Dashboard.</p><p>The fields marked with asterisk <i class="fa fa-asterisk mandatory-field"></i> are mandatory.</p><form name="newReportForm" ng-submit="createReport()" novalidate=""><div class="form-group" ng-class="{ \'has-error\' : newReportForm.name.$invalid && !newReportForm.name.$pristine }"><label class="control-label">Name <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="name" class="form-control" ng-model="report.name" required=""><p ng-show="newReportForm.name.$invalid && !newReportForm.name.$pristine" class="help-block">Name is required.</p></div><div class="form-group"><label class="control-label">Description</label> <input type="text" name="description" class="form-control" ng-model="report.description"></div><div class="form-group" ng-class="{ \'has-error\' : newReportForm.classification.$invalid && !newReportForm.classification.$pristine }"><label class="control-label">Classification <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="classification" class="form-control" ng-model="report.classification" required=""><p ng-show="newReportForm.classification.$invalid && !newReportForm.classification.$pristine" class="help-block">Classification is required.</p></div><div class="form-group"><label class="control-label">Privacy</label><div class="hcontainer"><ul class="hoptions"><li ng-class="{current:isActive(\'public\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'public\')" ng-model="report.privacy" name="privacy" value="public">Public</label></div></li><li ng-class="{current:isActive(\'private\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'private\')" ng-model="report.privacy" name="privacy" value="private">Private</label></div></li></ul><div class="hpanel"><div class="hcontent" ng-class="{show:isActive(\'public\')}"><p>A public report is available for anyone to view.</p></div><div class="hcontent" ng-class="{show:isActive(\'private\')}"><p>A private report is only available for its owner.</p></div></div></div></div><div class="btn-toolbar" role="toolbar" style="margin-top:10px"><div class="btn-group pull-right"><button type="submit" class="btn btn-primary" ng-disabled="newReportForm.$invalid"><span class="fa fa-check"></span> Submit</button></div></div></form><p>{{error_message}}</p></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/Boolean.html',
    '<span class="boolean-rule"><select data-ng-model="rule.value" class="input-sm form-control" data-ng-options="booleans.indexOf(choice) as choice for choice in booleansOrder"></select></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/Date.html',
    '<span class="date-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Date"></optgroup></select></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/Decimal.html',
    '<span class="decimal-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Decimal"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/Int.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Integer"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/Long.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Integer"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/String.html',
    '<span class="string-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Text"><option value="word-query">Contains</option><option value="value-query">Equals</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/indexes/path-namespace.html',
    '<div class="form-group" ng-class="{ \'has-error\' : indexForm.prefix.$invalid && !indexForm.prefix.$pristine }"><label class="col-sm-4 control-label">prefix <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="prefix" class="form-control" ng-model="current_index.prefix" required=""><p ng-show="indexForm.prefix.$invalid && !indexForm.prefix.$pristine" class="help-block">prefix is required.</p></div></div><div class="form-group" ng-class="{ \'has-error\' : indexForm.namespaceUri.$invalid && !indexForm.namespaceUri.$pristine }"><label class="col-sm-4 control-label">namespace uri <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="namespaceUri" class="form-control" ng-model="current_index[\'namespace-uri\']" required=""><p ng-show="indexForm.namespaceUri.$invalid && !indexForm.namespaceUri.$pristine" class="help-block">namespace uri is required.</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/indexes/range-element-attribute-index.html',
    '<div class="form-group"><label class="col-sm-4 control-label">parent namespace uri</label><div class="col-sm-8"><input type="text" name="parentNamespaceUri" class="form-control" ng-model="current_index[\'parent-namespace-uri\']"></div></div><div class="form-group" ng-class="{ \'has-error\' : indexForm.parentLocalname.$invalid && !indexForm.parentLocalname.$pristine }"><label class="col-sm-4 control-label">parent localname <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="parentLocalname" class="form-control" ng-model="current_index[\'parent-localname\']" required=""><p ng-show="indexForm.parentLocalname.$invalid && !indexForm.parentLocalname.$pristine" class="help-block">parent localname uri is required.</p></div></div><div class="form-group"><label class="col-sm-4 control-label">namespace uri</label><div class="col-sm-8"><input type="text" name="namespaceUri" class="form-control" ng-model="current_index[\'namespace-uri\']"></div></div><div class="form-group" ng-class="{ \'has-error\' : indexForm.localname.$invalid && !indexForm.localname.$pristine }"><label class="col-sm-4 control-label">localname <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="localname" class="form-control" ng-model="current_index[\'localname\']" required=""><p ng-show="indexForm.localname.$invalid && !indexForm.localname.$pristine" class="help-block">localname uri is required.</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/indexes/range-element-index.html',
    '<div class="form-group"><label class="col-sm-4 control-label">namespace uri</label><div class="col-sm-8"><input type="text" name="namespaceUri" class="form-control" ng-model="current_index[\'namespace-uri\']"></div></div><div class="form-group" ng-class="{ \'has-error\' : indexForm.localname.$invalid && !indexForm.localname.$pristine }"><label class="col-sm-4 control-label">localname <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="localname" class="form-control" ng-model="current_index[\'localname\']" required=""><p ng-show="indexForm.localname.$invalid && !indexForm.localname.$pristine" class="help-block">localname uri is required.</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/indexes/range-field-index.html',
    '<div class="form-group" ng-class="{ \'has-error\' : indexForm.fieldname.$invalid && !indexForm.fieldname.$pristine }"><label class="col-sm-4 control-label">fieldname <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="fieldname" class="form-control" ng-model="current_index[\'field-name\']" required=""><p ng-show="indexForm.fieldname.$invalid && !indexForm.fieldname.$pristine" class="help-block">field name uri is required.</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/indexes/range-path-index.html',
    '<div class="form-group" ng-class="{ \'has-error\' : indexForm.pathExpression.$invalid && !indexForm.pathExpression.$pristine }"><label class="col-sm-4 control-label">path expression <i class="fa fa-asterisk mandatory-field"></i></label><div class="col-sm-8"><input type="text" name="pathExpression" class="form-control" ng-model="current_index[\'path-expression\']" required=""><p ng-show="indexForm.pathExpression.$invalid && !indexForm.pathExpression.$pristine" class="help-block">path expression uri is required.</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/ml-report/chart-and-grid-results.html',
    '<div class="ml-analytics-results" ng-if="shouldShowChart"><highchart config="highchartConfig"></highchart><button class="btn btn-default" ng-click="isGridCollapsed = false" ng-show="isGridCollapsed">Show results grid</button> <button class="btn btn-default" ng-click="isGridCollapsed = true" ng-show="!isGridCollapsed">Hide results grid</button><div uib-collapse="isGridCollapsed"><ml-results-grid results-object="model.results" query-error="model.queryError"></ml-results-grid></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/ml-report/chart-builder.html',
    '<div><div ng-if="widget.mode === \'Design\'" class="design-mode"><div class="row ml-analytics-gutter-10"><div class="col-lg-9 col-md-7"><form name="designForm" class="form-inline ml-analytics-design-form well well-sm" novalidate=""><div class="form-group"><label class="control-label">Database</label><select class="input-sm form-control" ng-options="database for database in data.databases" ng-model="data.targetDatabase" ng-change="getDbConfig()"></select></div><div class="form-group well well-sm"><div class="form-group"><label class="control-label">Limited By</label><select class="input-sm form-control" ng-model="data.groupingStrategy" ng-change="getDbConfig()"><option>collection</option><option value="root">root element name</option></select><span ng-show="model.loadingConfig">&nbsp;<i class="fa fa-spinner fa-spin"></i></span></div><div class="form-group"><label class="control-label">Name</label><select class="input-sm form-control" ng-model="data.directory" ng-change="initializeQuery()" required=""><option value="">Choose...</option><option ng-repeat="dir in data.directories" value="{{dir}}">{{dir}}</option></select></div></div></form></div><div class="col-lg-3 col-md-5"><div class="pull-right"><a ng-click="widget.mode = \'View\'"><i class="fa fa-eye" title="View this chart"></i> View</a></div><div class="ml-analytics-design-form"><div class="form-group"><button class="btn btn-success" ng-click="save(); execute()" ng-disabled="designForm.$invalid"><span class="fa fa-check"></span> Save and Run</button> <span ng-show="model.loadingResults">&nbsp;<i class="fa fa-spinner fa-spin"></i></span></div></div></div></div><div class="row" style="margin-top:10px" ng-if="model.configError"><div class="col-md-12"><div class="alert alert-danger">{{model.configError}}</div></div></div><div class="row ml-analytics-gutter-10 ml-analytics-fading" ng-if="data.directory"><div class="col-md-4"><div dimension-builder="data"></div><div><div class="panel panel-default panel-sm"><div class="panel-heading"><span class="panel-title">Document Query Filters</span></div><div class="panel-body" sq-builder="data"></div></div></div><div><a ng-if="groupByConfigIsHidden" data-ng-click="showGroupByConfig()" class="btn btn-xs btn-primary"><i class="fa fa-eye"></i> Show Generated Group-by Query</a> <a ng-if="!groupByConfigIsHidden" ng-click="hideGroupByConfig()" class="btn btn-xs btn-primary" title="Hide Generated Dimensions"><span class="fa-stack fa-stack-xs"><i class="fa fa-eye fa-stack-1x"></i> <i class="fa fa-ban fa-stack-1x text-danger"></i></span> Hide Generated Group-by Query</a><div uib-collapse="groupByConfigIsHidden"><pre ng-bind="renderGroupByConfig()"></pre></div></div></div><div class="col-md-8"><div class="ml-analytics-columns-and-rows"><div class="ml-analytics-columns panel panel-default panel-horizontal panel-sm"><div class="panel-heading"><span class="panel-title"><i class="fa fa-list fa-rotate-90"></i> Columns</span></div><div class="panel-body"><div class="btn-group" ng-repeat="column in data.serializedQuery.columns"><button type="button" class="btn btn-xs btn-info">{{shortName(column)}}</button> <button type="button" class="btn btn-xs btn-info" ng-click="dataManager.removeColumn($index)"><i class="fa fa-remove"></i></button></div></div></div><div class="ml-analytics-rows panel panel-default panel-horizontal panel-sm"><div class="panel-heading"><span class="panel-title"><i class="fa fa-list"></i> Rows</span></div><div class="panel-body"><div class="btn-group" ng-repeat="compute in data.serializedQuery.computes"><button type="button" class="btn btn-xs btn-success">{{compute.fn}}({{shortName(compute.ref)}})</button> <button type="button" class="btn btn-xs btn-success" ng-click="dataManager.removeCompute($index)"><i class="fa fa-remove"></i></button></div></div></div></div><div ng-include="\'/templates/ml-report/chart-and-grid-results.html\'"></div></div></div></div><div ng-if="widget.mode === \'View\'" class="view-mode"><div class="pull-right"><a ng-click="widget.mode = \'Design\'"><i class="fa fa-cog" title="Design this chart"></i> Design</a></div><ml-analytics-view-chart></ml-analytics-view-chart></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/ml-report/ml-analytics-view-chart.html',
    '<div><form name="viewForm" class="form-inline" style="margin-bottom:10px;margin-bottom:10px"><div class="form-group"><label class="control-label">Search:</label> <input type="text" name="name" class="form-control" ng-model="data.serializedQuery.query.query.qtext"></div><button class="btn btn-primary" ng-click="execute()"><span class="fa fa-eye"></span> Filter Results with Search</button> <span ng-show="model.loadingResults">&nbsp;<i class="fa fa-spinner fa-spin"></i></span></form><div ng-include="\'/templates/ml-report/chart-and-grid-results.html\'"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/ml-report/ml-results-grid.html',
    '<div class="table-responsive" ng-if="resultsObject.results"><div ng-if="queryError" class="alert alert-danger">{{ queryError }}</div><div><uib-pagination class="pull-left" ng-model="gridPage" max-size="10" boundary-links="true" total-items="resultsObject.results.length" items-per-page="pageLength"></uib-pagination><div class="pull-right"><span class="metrics"><em>{{ resultsObject.results.length }} results in {{ resultsObject.metrics[\'total-time\'] }}</em></span> | <span>Results per page:</span><select ng-model="pageLength"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></div></div><table class="table table-bordered table-striped table-condensed"><thead><tr><th ng-repeat="header in resultsObject.headers track by $index"><a href="#" ng-click="setSortColumn($index)">{{header}} <span ng-show="sortColumn == $index && !sortReverse" class="fa fa-caret-down"></span> <span ng-show="sortColumn == $index && sortReverse" class="fa fa-caret-up"></span></a></th></tr></thead><tbody><tr ng-repeat="result in resultsObject.results | orderBy:sorter:sortReverse | limitTo:pageLength:(pageLength*(gridPage - 1))"><td ng-repeat="val in result track by $index"><span>{{ val }}</span></td></tr></tbody></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/widgets/qb-settings.html',
    '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button><h3>Settings Dialog for <small>{{widget.title}}</small></h3></div><div class="modal-body"><form name="form" novalidate="" class="form-horizontal"><div class="form-group"><label for="widgetTitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control" name="widgetTitle" ng-model="result.title"></div></div><div class="form-group"><label class="col-sm-3 control-label">Page Length</label><div class="col-sm-9"><input type="number" class="form-control" name="pageLength" ng-model="result.dataModelOptions.pageLength"></div></div><div class="form-group"><label class="col-sm-3 control-label">Chart Type</label><div class="col-sm-9"><select class="form-control" ng-model="result.dataModelOptions.chart"><option>column</option><option>pie</option></select></div></div><div ng-if="widget.partialSettingTemplateUrl" ng-include="widget.partialSettingTemplateUrl"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button> <button type="button" class="btn btn-primary" ng-click="ok()">OK</button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-dimension-builder/BuilderDirective.html',
    '<div class="mlad-dimension-builder row ml-analytics-gutter-10"><div class="col-md-6"><div class="panel panel-default mlad-panel-sm"><div class="panel-heading"><span class="panel-title">Dimensions</span></div><ul class="list-unstyled panel-body ml-analytics-dimensions"><li uib-dropdown="" class="ml-analytics-dimension" ng-repeat="field in report.dataSource.fields | filter:isColumnField"><a uib-dropdown-toggle=""><span class="ml-analytics-field-name"><span ng-switch="indexService.highLevelType(field)"><i class="fa fa-font" ng-switch-when="string"></i> <i class="fa fa-calendar" ng-switch-when="discreteDate"></i></span> {{field.alias}}</span></a><ul class="dropdown-menu"><li><a ng-click="addColumn(field)">Add Group By Column</a></li><li ng-repeat="fn in availableFns(field) | orderBy:\'toString()\'"><a ng-click="addCompute(field, fn)">Add {{fn}}</a></li></ul><a class="mlad-dimension-info pull-right" popover-placement="right-top" popover-trigger="outsideClick" uib-popover-template="\'/ml-dimension-builder/dimension-popover.html\'"><i class="pull-right fa fa-info-circle"></i></a></li></ul></div></div><div class="col-md-6"><div class="panel panel-default mlad-panel-sm"><div class="panel-heading"><span class="panel-title">Measures</span></div><ul class="list-unstyled panel-body ml-analytics-measures"><li uib-dropdown="" class="ml-analytics-measure"><a uib-dropdown-toggle=""><span class="ml-analytics-field-name"><i class="icon ion-pound"></i> {{report.frequencyAlias}}</span></a><ul class="dropdown-menu"><li><a ng-click="addCompute(report.dataSource.fields[0], \'frequency\')">Add {{report.frequencyAlias}}</a></li></ul><a class="pull-right" popover-placement="right-top" popover-trigger="outsideClick" uib-popover-template="\'/ml-dimension-builder/frequency-popover.html\'"><i class="pull-right fa fa-info-circle"></i></a></li><li uib-dropdown="" class="ml-analytics-measure" ng-repeat="field in report.dataSource.fields | filter:isComputeField"><a uib-dropdown-toggle=""><span class="ml-analytics-field-name"><span ng-switch="indexService.highLevelType(field)"><i class="icon ion-pound" ng-switch-when="numeric"></i></span> {{field.alias}}</span></a><ul class="dropdown-menu"><li ng-repeat="fn in availableFns(field) | orderBy:\'toString()\'"><a ng-click="addCompute(field, fn)">Add {{fn}}</a></li></ul><a class="pull-right" popover-placement="right-top" popover-trigger="outsideClick" uib-popover-template="\'/ml-dimension-builder/dimension-popover.html\'"><i class="pull-right fa fa-info-circle"></i></a></li></ul></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-dimension-builder/dimension-popover.html',
    '<div class="panel panel-default mlad-panel-sm"><div class="panel-heading"><span>Range Index Details</span></div><ul class="list-unstyled panel-body"><li><b>alias:</b> <input type="text" ng-model="field.alias" ng-change="recordAlias(field)"></li><li ng-repeat="(key, value) in field.ref"><b>{{key}}:</b> {{value}}</li></ul></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-dimension-builder/frequency-popover.html',
    '<div class="panel panel-default mlad-panel-sm"><div class="panel-heading"><span>Frequency Calculation</span></div><ul class="list-unstyled panel-body"><p>This special measure calculates the frequency of each unique combination of dimension values. See the <a href="http://docs.marklogic.com/cts.frequency">MarkLogic documentation on the cts.frequency function</a> for more information.</p><p><b>alias:</b> <input type="text" ng-model="report.frequencyAlias"></p></ul></div>');
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
    '<div class="sq-builder"><div class="form-inline"><p>If<select class="input-sm form-control" data-ng-model="data.operation"><option value="and-query">All</option><option value="or-query">Any</option></select>of these conditions are met</p></div><div class="filter-panels"><div class="form-inline"><div data-ng-repeat="filter in filters" data-sq-builder-chooser="filter" data-sq-fields="report.dataSource.fields" data-on-remove="removeChild($index)" data-depth="0"></div><div class="mlad-actions"><a class="btn btn-xs btn-primary" title="Add Rule" data-ng-click="addRule()"><i class="fa fa-plus"></i> Add Rule</a> <a class="btn btn-xs btn-primary" title="Add Group" data-ng-click="addGroup()"><i class="fa fa-list"></i> Add Group</a></div></div></div></div>');
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
    '<div class="mlad-sq-builder-chooser" data-ng-class="getGroupClassName()"><div data-ng-if="item.type === \'group\'" data-sq-builder-group="item" data-depth="{{ depth }}" data-sq-fields="sqFields" data-on-remove="onRemove()"></div><div data-ng-if="item.type !== \'group\'" data-sq-builder-rule="item" data-sq-fields="sqFields" data-on-remove="onRemove()"></div></div>');
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
    '<div class="mlad-sq-builder-group"><h5><select data-ng-model="group.subType" class="input-sm form-control"><option value="and-query">All</option><option value="or-query">Any</option></select>of these conditions are met</h5><div data-ng-repeat="rule in group.rules" data-sq-builder-chooser="rule" data-sq-fields="sqFields" data-depth="{{ +depth + 1 }}" data-on-remove="removeChild($index)"></div><div class="mlad-actions" data-ng-class="getGroupClassName()"><a class="btn btn-xs btn-primary" title="Add Sub-Rule" data-ng-click="addRule()"><i class="fa fa-plus">Add Rule</i></a> <a class="btn btn-xs btn-primary" title="Add Sub-Group" data-ng-click="addGroup()"><i class="fa fa-list">Add Sub-Group</i></a></div><a class="btn btn-xs btn-danger remover" data-ng-click="onRemove()"><i class="fa fa-minus"></i></a></div>');
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
    '<div class="sq-builder-rule"><select class="input-sm form-control" data-ng-model="rule.field" data-ng-options="field.alias for field in sqFields | filter:isQueryableIndex"></select><span data-sq-type="rule.field.ref[\'scalar-type\']" data-rule="rule"></span> <a class="btn btn-xs btn-danger remover" data-ng-click="onRemove()"><i class="fa fa-minus"></i></a></div>');
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
    '<div><div class="btn-toolbar" ng-if="!options.hideToolbar"><div class="btn-group" ng-if="!options.widgetButtons"><span class="dropdown" on-toggle="toggled(open)"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Button dropdown <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li ng-repeat="widget in widgetDefs"><a href="#" ng-click="addWidgetInternal($event, widget);" class="dropdown-toggle"><span class="label label-primary">{{widget.name}}</span></a></li></ul></span></div><div class="btn-group" ng-if="options.widgetButtons"><button ng-repeat="widget in widgetDefs" ng-click="addWidgetInternal($event, widget);" type="button" class="btn btn-primary"><span ng-if="widget.name === \'Chart Builder\'">Add Chart</span> <span ng-if="widget.name !== \'Chart Builder\'">{{widget.name}}</span></button></div><button ng-if="options.storage && options.explicitSave" ng-click="options.saveDashboard()" class="btn btn-success" ng-disabled="!options.unsavedChangeCount">{{ !options.unsavedChangeCount ? "all saved" : "save changes (" + options.unsavedChangeCount + ")" }}</button></div><div ui-sortable="sortableOptions" ng-model="widgets" class="dashboard-widget-area"><div ng-repeat="widget in widgets" ng-style="widget.containerStyle" class="widget-container" widget=""><div class="widget panel panel-default"><div class="widget-header panel-heading"><h4><span class="widget-title" ng-dblclick="editTitle(widget)" ng-hide="widget.editingTitle">{{widget.dataModelOptions.data.title}}</span><form action="" class="widget-title" ng-show="widget.editingTitle" ng-submit="saveTitleEdit(widget)"><input type="text" ng-model="widget.dataModelOptions.data.title" class="form-control"></form><span class="label label-primary" ng-if="!options.hideWidgetName">{{widget.name}}</span> <span ng-click="removeWidget(widget);" class="glyphicon glyphicon-remove" ng-if="!options.hideWidgetClose"></span> <span ng-click="widget.contentStyle.display = widget.contentStyle.display === \'none\' ? \'block\' : \'none\'" class="glyphicon" ng-class="{\'glyphicon-plus\': widget.contentStyle.display === \'none\', \'glyphicon-minus\': widget.contentStyle.display !== \'none\' }"></span></h4></div><div class="panel-body widget-content" ng-style="widget.contentStyle"></div><div class="widget-ew-resizer" ng-mousedown="grabResizer($event)"></div><div ng-if="widget.enableVerticalResize" class="widget-s-resizer" ng-mousedown="grabSouthResizer($event)"></div></div></div></div></div>');
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
    '<div class="row" id="ml-analytics-designer"><div class="col-md-12"><a ng-click="returnHome()" class="text-muted"><< All Reports</a><div class="pull-right" uib-dropdown=""><a uib-dropdown-toggle=""><i class="fa fa-bars"></i></a><ul class="dropdown-menu"><li><a ng-click="manager.exportConfig()">Download Report Config</a></li></ul></div><h2 class="view-title">{{report.name}}</h2><p>{{report.description}}</p><ml-analytics-data-source></ml-analytics-data-source><div class="row" style="margin-top:10px" ng-if="reportModel.configError"><div class="col-md-12"><div class="alert alert-danger">{{reportModel.configError}}</div></div></div><div dashboard="reportDashboardOptions" template-url="/templates/dashboard-content.html"></div></div></div>');
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
    '<div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to edit report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><span class="view-title">Edit Report</span><p>The fields marked with asterisk <i class="fa fa-asterisk mlad-mandatory-field"></i> are mandatory.</p><form name="editReportForm" ng-submit="updateReport()" novalidate=""><div class="form-group"><label class="control-label">Name <i class="fa fa-asterisk mlad-mandatory-field"></i></label> <input type="text" name="name" class="form-control" ng-model="report.name" readonly=""></div><div class="form-group"><label class="control-label">Description</label> <input type="text" name="description" class="form-control" ng-model="report.description"></div><div class="btn-toolbar" role="toolbar" style="margin-top:10px"><div class="btn-group pull-right"><button type="submit" class="btn btn-primary" ng-disabled="editReportForm.$invalid"><span class="fa fa-check"></span> Submit</button></div></div></form></div></div>');
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
    '<div><div class="col-md-12" ng-if="mode === \'home\'"><div ng-if="currentUser" class="btn-toolbar" style="margin-left:10px;margin-top:10px"><div class="btn-group"><button class="btn btn-primary" ng-click="newReportForm()"><span class="fa fa-plus"></span> New Report</button></div></div><div class="well"><h4 class="menu-title">Manage Reports</h4><p ng-if="!currentUser" style="padding-left:8px;">Please log in to view reports.</p><div class="alert alert-warning" ng-show="showLoading">Loading Reports...</div><form ng-if="currentUser" name="filterForm" class="mlad-filter-form" novalidate=""><input type="text" class="form-control" ng-model="search.name" placeholder="Filter reports"></form><div class="mlad-report-palette"><div class="mlad-report-container"><div class="mlad-report-container-inner"><div class="mlad-report-item" ng-repeat="report in reports | filter : search | orderBy:\'name\'" ng-click="gotoDesigner(report.uri)"><i class="fa fa-th"></i><span>{{report.name}}</span><div class="toolbar"><a class="btn btn-link" ng-click="showReportEditor(report); $event.stopPropagation();"><i class="fa fa-edit"></i></a><br><a class="btn btn-link" ng-click="deleteReport(report); $event.stopPropagation();"><i class="fa fa-trash-o"></i></a></div></div></div></div></div></div></div><ml-analytics-new-report ng-if="mode === \'new\'"></ml-analytics-new-report><ml-analytics-design ng-if="mode === \'design\'"></ml-analytics-design><ml-analytics-report-editor ng-if="mode === \'edit\'"></ml-analytics-report-editor></div>');
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
    '<div><h1>Create New Report</h1><div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to create a new MarkLogic analytics report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><form name="newReportForm" ng-submit="createReport()" novalidate=""><div class="form-group" ng-class="{ \'has-error\' : newReportForm.name.$invalid && !newReportForm.name.$pristine }"><label class="control-label">Name <i class="fa fa-asterisk mlad-mandatory-field"></i></label> <input type="text" name="name" class="form-control" ng-model="report.name" required=""><p ng-show="newReportForm.name.$invalid && !newReportForm.name.$pristine" class="help-block">Name is required.</p></div><div class="form-group"><label class="control-label">Description</label> <input type="text" name="description" class="form-control" ng-model="report.description"></div><div class="btn-toolbar" role="toolbar" style="margin-top:10px"><div class="btn-group pull-right"><button type="submit" class="btn btn-primary" ng-disabled="newReportForm.$invalid"><span class="fa fa-check"></span> Submit</button></div></div></form><p>{{error_message}}</p></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-analytics-dashboard/chart/chart.html',
    '<div class="ml-analytics-results" ng-if="shouldShowChart || shouldShowGrid"><h3 ng-if="shouldShowTitle" class="text-center">{{analyticsConfig.title}}</h3><highchart ng-if="shouldShowChart" config="highchartConfig"></highchart><div ng-if="shouldShowGrid"><button class="btn btn-default" ng-click="isGridCollapsed = false" ng-show="isGridCollapsed && showGridCollapseButton">Show results grid</button> <button class="btn btn-default" ng-click="isGridCollapsed = true" ng-show="!isGridCollapsed && showGridCollapseButton">Hide results grid</button><div uib-collapse="isGridCollapsed"><ml-results-grid results-object="queryState.results" query-error="queryState.queryError"></ml-results-grid></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-analytics-dashboard/report/chart-type-selector.html',
    '<div class="ml-analytics-chart-types"><button class="btn btn-default ml-analytics-bar-chart-type" ng-class="{active: data.chartType === \'column\'}" ng-click="data.chartType = \'column\'"><i class="fa fa-3 fa-bar-chart"></i></button> <button class="btn btn-default ml-analytics-pie-chart-type" ng-class="{active: data.chartType === \'pie\'}" ng-click="data.chartType = \'pie\'"><i class="fa fa-3 fa-pie-chart"></i></button> <button class="btn btn-default ml-analytics-table-chart-type" ng-class="{active: data.chartType === \'table\'}" ng-click="data.chartType = \'table\'"><i class="fa fa-3 fa-table"></i></button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-analytics-dashboard/report/embed-code.html',
    '<div class="ml-analytics-embed-code"><p>You can embed this chart as-is elsewhere on this site, in an Angular view, with this code:</p><pre>&lt;ml-analytics-embed report-uri=&quot;\'{{report.uri}}\'&quot; chart-id=&quot;\'{{chartMetadata.chartId}}\'&quot;&gt;&lt;/ml-analytics-embed&gt;</pre><p>The embedded chart can also respond dynamically to searches if you pass it the searchContext:</p><pre>&lt;ml-analytics-embed report-uri=&quot;\'{{report.uri}}\'&quot; chart-id=&quot;\'{{chartMetadata.chartId}}\'&quot; ml-search=&quot;ctrl.mlSearch&quot;&gt;&lt;/ml-analytics-embed&gt;</pre><form class="form-horizontal"><div class="form-group form-group-sm"><label class="col-sm-4" for="ml-analytics-chart-id-input">Chart ID:</label><div class="col-sm-1"><input type="text" ng-model="chartMetadata.chartId"></div></div></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-analytics-dashboard/source/source.html',
    '<div class="row ml-analytics-gutter-10"><div class="col-lg-9 col-md-7"><form name="designForm" class="form-inline ml-analytics-design-form well well-sm" novalidate=""><div class="form-group"><label class="control-label">Database</label><select class="input-sm form-control" ng-options="database for database in discovery.databases" ng-model="source.targetDatabase" ng-change="getDbConfig()"></select></div><div class="form-group well well-sm"><div class="form-group"><label class="control-label">Limited By</label><select class="input-sm form-control" ng-model="source.groupingStrategy" ng-change="getDbConfig()"><option>collection</option><option value="root">root element name</option></select><span ng-show="bookkeeping.loadingConfig">&nbsp;<i class="fa fa-spinner fa-spin"></i></span></div><div class="form-group"><label class="control-label">Name</label><select class="input-sm form-control" ng-model="source.directory" ng-change="initializeQuery()" required=""><option value="">Choose...</option><option ng-repeat="dir in discovery.directories" value="{{dir}}">{{dir}}</option></select></div></div></form></div></div>');
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
  $templateCache.put('/ml-sq-builder/types/GDay.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Gregorian Day"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/GMonth.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Gregorian Month"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/GMonthYear.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Gregorian Month Year"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ml-sq-builder/types/GYear.html',
    '<span class="integer-rule"><select data-ng-model="rule.subType" class="input-sm form-control"><optgroup label="Gregorian Year"><option value="EQ">=</option><option value="NE">!=</option><option value="GT">&gt;</option><option value="GE">&ge;</option><option value="LT">&lt;</option><option value="LE">&le;</option></optgroup></select><input data-ng-if="inputNeeded()" class="input-sm form-control" data-ng-model="rule.value" type="text"></span>');
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
  $templateCache.put('/templates/ml-report/chart-builder.html',
    '<div><div ng-if="widget.mode === \'Design\'" class="design-mode"><div class="row ml-analytics-gutter-10"><div class="pull-right"><a ng-click="widget.mode = \'View\'"><i class="fa fa-eye" title="View this chart"></i> View</a></div><div class="col-lg-3 col-md-5"><div class="ml-analytics-design-form"><button class="btn btn-success" ng-click="save()" ng-disabled="designForm.$invalid"><span class="fa fa-check"></span> Save</button> <button class="btn btn-danger" ng-click="revert()" ng-disabled="designForm.$invalid"><span class="fa fa-times"></span> Revert</button> <span ng-show="model.loadingResults">&nbsp;<i class="fa fa-spinner fa-spin"></i></span></div></div><div class="col-lg-8 col-md-6"><div class="panel panel-default mlad-panel-horizontal mlad-panel-sm"><div class="panel-body"><form class="form-inline"><div class="form-group" ng-init="resultsLimit = getResultsLimit()"><label for="mlad-results-limit">Results Limit:</label> <input id="mlad-results-limit" type="number" ng-model="resultsLimit" style="width: 50px;" ng-readonly="!widget.editingResultsLimit"> <a ng-click="widget.editingResultsLimit = true" ng-if="!widget.editingResultsLimit"><i class="fa fa-edit"></i></a> <a ng-click="widget.editingResultsLimit = false; setResultsLimit(resultsLimit)" ng-if="widget.editingResultsLimit"><i class="fa fa-check"></i></a></div><div class="form-group"><div class="radio-inline" ng-init="orderOption = getResultsOrderOption()">Order Results by: <label><input type="radio" value="item" ng-model="orderOption" ng-change="setResultsOrderOption(orderOption)"> Item Value</label> <label><input type="radio" value="frequency" ng-model="orderOption" ng-change="setResultsOrderOption(orderOption)"> Frequency</label></div></div><div class="form-group"><div class="radio-inline" ng-init="orderDirectionOption = getResultsOrderDirectionOption()"><label><input type="radio" value="ascending" ng-model="orderDirectionOption" ng-change="setResultsOrderDirectionOption(orderDirectionOption)"> Ascending</label> <label><input type="radio" value="descending" ng-model="orderDirectionOption" ng-change="setResultsOrderDirectionOption(orderDirectionOption)"> Descending</label></div></div></form></div></div></div></div><div class="row ml-analytics-gutter-10 ml-analytics-fading" ng-if="report.dataSource.directory"><div class="col-md-4"><dimension-builder></dimension-builder><div><div class="panel panel-default mlad-panel-sm"><div class="panel-heading"><span class="panel-title">Document Query Filters</span></div><div class="panel-body" sq-builder=""></div></div></div><div><a ng-if="groupByConfigIsHidden" data-ng-click="showGroupByConfig()" class="btn btn-xs btn-primary"><i class="fa fa-eye"></i> Show Generated Group-by Query</a> <a ng-if="!groupByConfigIsHidden" ng-click="hideGroupByConfig()" class="btn btn-xs btn-primary" title="Hide Generated Dimensions"><span class="fa-stack fa-stack-xs"><i class="fa fa-eye fa-stack-1x"></i> <i class="fa fa-ban fa-stack-1x text-danger"></i></span> Hide Generated Group-by Query</a><div uib-collapse="groupByConfigIsHidden"><pre ng-bind="renderGroupByConfig()"></pre></div></div></div><div class="col-md-8"><div class="ml-analytics-columns-and-rows"><div class="ml-analytics-columns panel panel-default mlad-panel-horizontal mlad-panel-sm"><div class="panel-heading"><span class="panel-title"><i class="fa fa-list fa-rotate-90"></i> Columns</span></div><div class="panel-body"><div class="btn-group ml-analytics-column" ng-repeat="column in data.serializedQuery.columns"><button type="button" class="btn btn-xs btn-info">{{column.alias}}</button> <button type="button" class="btn btn-xs btn-info" ng-click="dataManager.removeColumn($index)"><i class="fa fa-remove"></i></button></div></div></div><div class="ml-analytics-rows panel panel-default mlad-panel-horizontal mlad-panel-sm"><div class="panel-heading"><span class="panel-title"><i class="fa fa-list"></i> Rows</span></div><div class="panel-body"><div class="btn-group ml-analytics-row" ng-repeat="compute in data.serializedQuery.computes"><button type="button" class="btn btn-xs btn-success">{{compute.alias}}</button> <button type="button" class="btn btn-xs btn-success remove-row" ng-click="dataManager.removeCompute($index)"><i class="fa fa-remove"></i></button></div></div></div></div><div class="pull-right"><button uib-popover-template="\'/ml-analytics-dashboard/report/chart-type-selector.html\'" popover-placement="left" popover-trigger="outsideClick" class="ml-analytics-chart-type-selector btn btn-default btn-sm"><i class="fa fa-bar-chart"></i> Choose Chart Type</button> <button uib-popover-template="\'/ml-analytics-dashboard/report/embed-code.html\'" popover-placement="bottom-right" popover-trigger="outsideClick" class="ml-analytics-show-embed-code btn btn-primary btn-sm">Embed Code <i class="fa fa-caret-down"></i></button></div><ml-analytics-chart analytics-config="data"></ml-analytics-chart></div></div></div><div ng-if="widget.mode === \'View\'" class="view-mode"><div class="pull-right"><a ng-click="widget.mode = \'Design\'"><i class="fa fa-cog" title="Design this chart"></i> Design</a></div><ml-analytics-chart analytics-config="data"></ml-analytics-chart></div></div>');
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
    '<div class="table-responsive" ng-if="resultsObject.results"><div ng-if="queryError" class="alert alert-danger">{{ queryError }}</div><table class="table table-bordered table-striped table-condensed"><thead><tr><th ng-repeat="header in resultsObject.headers track by $index"><a href="#" ng-click="setSortColumn($index)">{{header}} <span ng-show="sortColumn == $index && !sortReverse" class="fa fa-caret-down"></span> <span ng-show="sortColumn == $index && sortReverse" class="fa fa-caret-up"></span></a></th></tr></thead><tbody><tr ng-repeat="result in resultsObject.results | orderBy:sorter:sortReverse | limitTo:pageLength:(pageLength*(gridPage - 1))"><td ng-repeat="val in result track by $index"><span>{{ val }}</span></td></tr></tbody></table><div><uib-pagination class="pull-left" ng-model="gridPage" max-size="10" boundary-links="true" total-items="resultsObject.results.length" items-per-page="pageLength"></uib-pagination><div class="pull-right"><span class="metrics"><em>{{ resultsObject.results.length }} results in {{ resultsObject.metrics[\'total-time\'] }}</em></span> | <span>Results per page:</span><select ng-model="pageLength"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/dashboard.html',
    '<div id="analytics-dashboard"><div class="col-md-3"><span class="menu-title">Manage Reports</span><p ng-if="!currentUser" style="padding-left:8px;">Please log in to view reports.</p><div class="alert alert-warning" ng-show="showLoading">Loading Reports...</div><form ng-if="currentUser" name="filterForm" class="filter-form" novalidate=""><input type="text" class="form-control" ng-model="search.name" placeholder="Filter reports"></form><div class="report-palette"><div class="report-container"><div class="report-container-inner"><div class="report-item" ng-repeat="report in reports | filter : search"><i class="fa fa-th"></i><span>{{report.name}}</span><div class="toolbar"><a class="btn btn-link" data-ng-click="gotoDesigner(report.uri)"><i class="fa fa-dashboard"></i></a> <a class="btn btn-link" data-ng-click="showReportEditor(report)"><i class="fa fa-edit"></i></a> <a class="btn btn-link" data-ng-click="showReportRemover(report)"><i class="fa fa-trash-o"></i></a></div></div></div></div></div><div ng-if="currentUser" class="btn-toolbar" style="margin-left:10px;margin-top:10px"><div class="btn-group"><button class="btn btn-primary" ng-click="createReport()"><span class="fa fa-check"></span> New Report</button></div></div></div><div class="col-md-9"><div class="container-fluid workspace-view"><ui-view></ui-view></div></div></div>');
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
    '<div class="row"><div class="col-md-12"><span class="view-title">{{report.name}}</span><p>{{report.description}}</p><div dashboard="reportDashboardOptions"></div></div></div>');
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
    '<div class="row"><div class="col-md-12"><span class="view-title">Welcome to Analytics Dashboard</span><p>Analytics Dashboard is an online reporting and business intelligence service that helps you easily analyze your business data, and create insightful reports for informed decision-making. It allows you to easily create and share powerful reports in minutes from MarkLogic database.</p><p><b>Sample Monthly Budget 2015 vs. 2014</b></p><p><canvas id="budget-canvas" style="height:300px;max-width:100%;width:auto;"></canvas></p><p>MarkLogic\'s full-text search engine makes it an ideal platform to power advanced search applications. MarkLogic’s full-text search includes faceting, real-time alerting, type-ahead suggestions, snippeting, language support, and much more.</p></div></div>');
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
    '<h1>Create New Report</h1><div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to create new report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><p>A report primarily consists of widgets. This view will create a blank report. You can then add widgets into the report using the Report Dashboard.</p><p>The fields marked with asterisk <i class="fa fa-asterisk mandatory-field"></i> are mandatory.</p><form name="newReportForm" ng-submit="createReport()" novalidate=""><div class="form-group" ng-class="{ \'has-error\' : newReportForm.name.$invalid && !newReportForm.name.$pristine }"><label class="control-label">Name <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="name" class="form-control" ng-model="report.name" required=""><p ng-show="newReportForm.name.$invalid && !newReportForm.name.$pristine" class="help-block">Name is required.</p></div><div class="form-group"><label class="control-label">Description</label> <input type="text" name="description" class="form-control" ng-model="report.description"></div><div class="form-group" ng-class="{ \'has-error\' : newReportForm.classification.$invalid && !newReportForm.classification.$pristine }"><label class="control-label">Classification <i class="fa fa-asterisk mandatory-field"></i></label> <input type="text" name="classification" class="form-control" ng-model="report.classification" required=""><p ng-show="newReportForm.classification.$invalid && !newReportForm.classification.$pristine" class="help-block">Classification is required.</p></div><div class="form-group"><label class="control-label">Privacy</label><div class="hcontainer"><ul class="hoptions"><li ng-class="{current:isActive(\'public\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'public\')" ng-model="report.privacy" name="privacy" value="public">Public</label></div></li><li ng-class="{current:isActive(\'private\')}"><div class="radio"><label><input type="radio" data-ng-click="setOption(\'private\')" ng-model="report.privacy" name="privacy" value="private">Private</label></div></li></ul><div class="hpanel"><div class="hcontent" ng-class="{show:isActive(\'public\')}"><p>A public report is available for anyone to view.</p></div><div class="hcontent" ng-class="{show:isActive(\'private\')}"><p>A private report is only available for its owner.</p></div></div></div></div><div class="btn-toolbar" role="toolbar" style="margin-top:10px"><div class="btn-group pull-right"><button type="submit" class="btn btn-primary" ng-disabled="newReportForm.$invalid"><span class="fa fa-check"></span> Submit</button></div></div></form><p>{{error_message}}</p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ml.analyticsDashboard');
} catch (e) {
  module = angular.module('ml.analyticsDashboard', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/templates/remover.html',
    '<div class="row" ng-if="!currentUser"><div class="col-md-12">Please log in to remove report.</div></div><div class="row" ng-if="currentUser"><div class="col-md-12"><span class="view-title">Delete Report</span><p>This action will delete the report. Are you sure you want to continue?</p><button type="button" class="btn btn-default" data-ng-click="cancel()"><span class="fa fa-close"></span> Cancel</button> <button type="button" class="btn btn-primary" data-ng-click="deleteReport()"><span class="fa fa-check"></span> OK</button></div></div>');
}]);
})();

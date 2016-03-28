(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', ['ui.router'])
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('analytics-dashboard', {
        url: '/analytics-dashboard',
        template: '<ml-analytics-dashboard></ml-analytics-dashboard>'
      })
      .state('analytics-dashboard.new-report', {
        url: '/new-report',
        templateUrl: 'templates/new-report.html',
        controller: 'NewReportCtrl'
      })
      .state('analytics-dashboard.home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('analytics-dashboard.designer', {
        url: '/designer{uri:path}',
        templateUrl: 'templates/designer.html',
        controller: 'ReportDesignerCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      })
      .state('analytics-dashboard.remover', {
        url: '/remover{uri:path}',
        templateUrl: 'templates/remover.html',
        controller: 'ReportRemoverCtrl'
      })
      .state('analytics-dashboard.editor', {
        url: '/editor{uri:path}',
        templateUrl: 'templates/editor.html',
        controller: 'ReportEditorCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      });
  }

}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDashboard', mlAnalyticsDashboard);

  function mlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/dashboard.html',
      controller: 'SidebarCtrl'
    };
  }
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportDesignerCtrl', ['$scope', '$stateParams', '$interval', 'ReportData', 'ReportService', 'WidgetDefinitions',
    function($scope, $stateParams, $interval, ReportData, ReportService, WidgetDefinitions) {

    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;

        $scope.report.widgets = value.widgets;
        $scope.saveWidgets();
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    $scope.report = {};
    $scope.report.uri = decodeURIComponent($stateParams.uri);
    angular.extend($scope.report, ReportData.data);

    var defaultWidgets = null;
    if ($scope.report.widgets) {
      defaultWidgets = _.map($scope.report.widgets, function(widget) {
        return {
          name: widget.name,
          title: widget.title,
          attrs: widget.attrs,
          style: widget.size,
          dataModelOptions: widget.dataModelOptions
        };
      });
    } else {
      defaultWidgets = [];
    }

    $scope.reportDashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: WidgetDefinitions,
      defaultWidgets: defaultWidgets,
      hideToolbar: false,
      hideWidgetName: true,
      explicitSave: false,
      stringifyStorage: false,
      storage: storage,
      storageId: $scope.report.uri
    };

    ReportService.setDashboardOptions($scope.reportDashboardOptions);

    $scope.percentage = 5;
    $interval(function () {
      $scope.percentage = ($scope.percentage + 10) % 100;
    }, 1000);

    // external controls
    $scope.addWidget = function(directive) {
      $scope.dashboardOptions.addWidget({
        name: directive
      });
    };

    $scope.$on('widgetAdded', function(event, widget) {
      event.stopPropagation();
    });

    $scope.saveWidgets = function() {
      MarkLogic.Util.showLoader();
      ReportService.updateReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportEditorCtrl', ['$scope', '$stateParams', '$state', 'ReportData', 'ReportService',
    function($scope, $stateParams, $state, ReportData, ReportService) {

    $scope.report = {};
    $scope.report.uri = decodeURIComponent($stateParams.uri);
    angular.extend($scope.report, ReportData.data);

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.updateReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.updateReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();

        //$scope.updateTableRow();
        $state.go('root.analytics-dashboard.home');
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('HomeCtrl', ['$scope', '$http', 
    function($scope, $http) {

    $scope.createChart = function() {
      var barData = { 
        labels : ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: '2014 budget #',
            fillColor: '#382765',
            data: [456,479,324,569,702,60]
          },
          {
            label: '2015 budget #',
            fillColor: '#7BC225',
            strokeColor : "#48A497",
            data: [364,504,605,400,345,320]
          }
        ]
      };

      var context = document.getElementById('budget-canvas').getContext('2d');
      var budgetChart = new Chart(context).Bar(barData);
    };

    $scope.createChart();

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl', ['$scope', '$location', '$rootScope', 'userService', 'ReportService',
    function($scope, $location, $rootScope, userService, ReportService) {

    $scope.currentUser = null;
    $scope.report = {};
    $scope.report.privacy = 'public';

    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
    });

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.createReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.createReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();
        var uri = response.replace(/(.*\?uri=)/, '');
        $scope.report.uri = uri;

        $rootScope.$broadcast('ReportCreated', $scope.report);
        $location.path('/analytics-dashboard/designer' + uri);
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportRemoverCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'ReportService',
    function($rootScope, $scope, $stateParams, $state, ReportService) {

    $scope.report.uri = decodeURIComponent($stateParams.uri);

    $scope.deleteReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.deleteReport($scope.report.uri).then(function(response) {
        MarkLogic.Util.hideLoader();
        $rootScope.$broadcast('ReportDeleted', $scope.report.uri);
        $state.go('root.analytics-dashboard.home');
      }, function(response) {
        alert(response);
      });
    };

    $scope.cancel = function() {
      $state.go('root.analytics-dashboard.home');
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('SidebarCtrl', ['$rootScope', '$scope', '$location', '$state', 'userService', 'ReportService', 'WidgetDefinitions',
    function($rootScope, $scope, $location, $state, userService, ReportService, WidgetDefinitions) {

    setupWizard();

    $scope.currentUser = null;
    $scope.search = {};
    $scope.showLoading = false;
    $scope.widgetDefs = WidgetDefinitions;
    $scope.reports = [];

    // The report selected for update or delete.
    $scope.report = {};

    var editReportDialogId = '#edit-report-dialog';
    var deleteReportDialogId = '#delete-report-dialog';

    // Retrieve reports if the user logs in
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
      $scope.getReports();
    });

    $scope.getReports = function() {
      $scope.showLoading = true;
      ReportService.getReports().then(function(response) {
        var contentType = response.headers('content-type');
        var page = MarkLogic.Util.parseMultiPart(response.data, contentType);
        $scope.reports = page.results;
        $scope.showLoading = false;
      }, function() {
        $scope.showLoading = false;
      });
    };

    $scope.addWidget = function(widgetDef) {
      ReportService.getDashboardOptions($scope.reportDashboardOptions).addWidget({
        name: widgetDef.name
      });
    };

    $scope.gotoDesigner = function(uri) {
      $location.path('/analytics-dashboard/designer' + uri);
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/analytics-dashboard/editor' + report.uri);
    };

    $scope.showReportRemover = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/analytics-dashboard/remover' + report.uri);
    };

    $scope.createReport = function() {
      $location.path('/analytics-dashboard/new-report');
    };

    $scope.setReport = function(report) {
      angular.extend($scope.report, report);
    };

    $scope.updateTableRow = function() {
      for (var i = 0; i < $scope.reports.length; i++) {
        var report = $scope.reports[i];
        if (report.uri === $scope.report.uri) {
          report.name = $scope.report.name;
          report.description = $scope.report.description;
          break;
        }
      }
    };

    $scope.$on('ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

    $scope.$on('ReportDeleted', function(event, reportUri) {
      for (var i = 0; i < $scope.reports.length; i++) {
        if (reportUri === $scope.reports[i].uri) {
          // The first parameter is the index, the second 
          // parameter is the number of elements to remove.
          $scope.reports.splice(i, 1);
          break;
        }
      }
    });

    var currentPath = $location.path();
    if (currentPath === '/analytics-dashboard' || currentPath === '/analytics-dashboard/')
      $state.go('root.analytics-dashboard.home');
  }]);
}());

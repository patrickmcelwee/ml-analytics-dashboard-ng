(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', [
    'highcharts-ng',
    'ml.analyticsDashboard.report',
    'ml.common',
    'ngAnimate',
    'ui.dashboard'
  ]);

}());

(function() {
  'use strict';

  angular.module('ml-dimension-builder', []);

}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard.report',
    [
      'ml-dimension-builder',
      'ml-sq-builder'
    ]); 
})();

(function() {
  'use strict';

  angular.module('ml-sq-builder', [
    'RecursionHelper',
  ]);

})();


(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .factory('mlAnalyticsIndexService', indexServiceFactory);

  function indexServiceFactory() {
    function highLevelType(index) {
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
     
    function shortName(index) {
      return index.localname || index['path-expression'];
    }

    return {
      highLevelType: highLevelType,
      shortName: shortName
    };
  }
})();

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .factory('SmartGridDataModel', ['WidgetDataModel', '$http',
      function(WidgetDataModel, $http) {
        function SmartGridDataModel() {
        }

        SmartGridDataModel.prototype = Object.create(WidgetDataModel.prototype);

        SmartGridDataModel.prototype.init = function() {
          WidgetDataModel.prototype.init.call(this);
          this.load();
        };

        SmartGridDataModel.prototype.load = function() {
          //console.log(this);
        };

        return SmartGridDataModel;
      }
    ]);

})();

(function() {
  'use strict';

  // keeps all of the groups colored correctly
  angular.module('ml-sq-builder')
    .factory('groupClassHelper', function groupClassHelper() {

      return function(level) {
        var levels = [
          'list-group-item-info',
          'list-group-item-success',
          'list-group-item-warning',
          'list-group-item-danger',
        ];

        return levels[level % levels.length];
      };
    });

})();


(function() {
  'use strict';

  // Convert filters into queries, and vice versa
  angular.module('ml-sq-builder')
    .factory('sqBuilderService', sqBuilderService);

  sqBuilderService.$inject = ['mlAnalyticsIndexService'];

  function sqBuilderService(indexService) {

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

    function findField(fields, query) {
      return _.find(fields, function(field) {
        return indexService.shortName(field) === getConstraintName(query);
      });
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

    function parseQueryGroup(fields, group) {
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
          obj.rules = group[key].queries.map(parseQueryGroup.bind(group, fields));
          obj.subType = key;
          break;
        case 'value-query':
        case 'word-query':
          obj.subType = key;
          obj.field = findField(fields, query);
          if (obj.field['scalar-type'] === 'boolean') {
            // group.text is true or false
            obj.value = query.text ? 1 : 0;
          } else {
            obj.value = query.text;
          }

          break;
        case 'range-query':
            obj.field = findField(fields, query);
            obj.value = query.value;
          if (query['path-index']) {
            obj.subType = 'value-query';
          } else {
            obj.subType = query['range-operator'];
            obj.operator = obj.subType;
          }
          break;
        default:
          throw new Error('unexpected query');
      }

      return obj;
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

    function parseFilterGroup(fields, group) {
      var obj = {};

      if (group.type === 'group') {
        obj[group.subType] = group.rules.map(parseFilterGroup.bind(group, fields)).filter(function(item) {
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

          var dataType = 'xs:' + group.field['scalar-type'];

          var value = {
            'type': dataType,
            'range-operator': group.subType,
            'value': group.value
          };

          setConstraint(value, group.field);

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

          setConstraint(value, group.field);

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

    function toFilters(query, fields) {
      var filters = query.map(parseQueryGroup.bind(query, fields));
      return filters;
    }

    function toQuery(filters, fields) {
      var query = filters.map(parseFilterGroup.bind(filters, fields)).filter(function(item) {
        return !! item;
      });
      return query;
    }

    return {
      toFilters: toFilters,
      toQuery: toQuery,
    };
  }

})();

(function() {
  'use strict';

  // Report Service
  angular.module('ml.analyticsDashboard').service('ReportService', ['$http', 'MLRest', function($http, mlRest) {
    var dashboardOptions = null;
    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    this.getStorage = function() {
      return storage;
    };

    this.setDashboardOptions = function(options) {
      dashboardOptions = options;
    };

    this.getDashboardOptions = function() {
      return dashboardOptions;
    };

    this.loadWidgets = function(widgets) {
      dashboardOptions.loadWidgets(widgets);
    };

    this.getReports = function() {
      var search = {
        'search': {
          'options': {
            'search-option': ['unfiltered'],
            'extract-document-data': {
              'extract-path': ['/name']
            }
          },
          'query': {
            'queries': [{
              'collection-query': {
                'uri': ['ml-analytics-dashboard-reports']
              }
            }]
          }
        }
      };

      return mlRest.search({
               'pageLength': 20,
               'format': 'json'
              }, search);
    };

    this.getReport = function(uri) {
      return mlRest.getDocument(uri, {format: 'json'});
    };

    this.createReport = function(report) {
      return mlRest.updateDocument(report, {
         collection: ['ml-analytics-dashboard-reports'],
         uri: report.uri
       });
    };

    this.deleteReport = function(uri) {
      return mlRest.deleteDocument(uri);
    };

    this.updateReport = function(data) {
      return mlRest.updateDocument(data, {uri: data.uri});
    };

    this.get = function(url) {
      return $http.get(url);
    };

    this.post = function(url, data) {
      return $http.post(url, data);
    };

    this.put = function(url, data) {
      return $http.put(url, data);
    };

    this.delete = function(url) {
      return $http.delete(url);
    };
  }]);

  angular.module('ml.analyticsDashboard').factory('WidgetDefinitions', ['SmartGridDataModel',  
    function(SmartGridDataModel) {
    return [
      {
        name: 'Chart Builder',
        directive: 'ml-smart-grid',
        title: 'Chart Builder',
        icon: 'fa fa-th',
        dataAttrName: 'grid',
        dataModelType: SmartGridDataModel,
        dataModelOptions: {
          database: '',
          groupingStrategy: '',
          directory: '',
          columns: [],
          computes: [],
          query: {},
          chart: 'column',
          pageLength: 10
        },
        style: {
          width: '100%'
        },
        settingsModalOptions: {
          templateUrl: '/templates/widgets/qb-settings.html',
          //controller: 'QueryBuilderWidgetSettingsCtrl',
          backdrop: false
        },
        onSettingsClose: function(result, widget) {
          //jQuery.extend(true, widget, result);
          widget.title = result.title;
          widget.dataModelOptions.pageLength = result.dataModelOptions.pageLength;
          widget.dataModelOptions.chart = result.dataModelOptions.chart;
        },
        onSettingsDismiss: function(reason, scope) {
          // Do nothing here, since the user pressed cancel
        }
      }
    ];
  }]);
}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDashboard', mlAnalyticsDashboard);

  function mlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/dashboard.html',
      controller: 'DashboardCtrl'
    };
  }
}());

(function() {
  'use strict';

  angular.module('ml-dimension-builder')
    .directive('dimensionBuilder', ['mlAnalyticsIndexService',
    function DB(indexService) {
      return {
        scope: {
          data: '=dimensionBuilder',
        },

        templateUrl: '/ml-dimension-builder/BuilderDirective.html',

        link: function(scope) {

          // generated by https://gist.github.com/joemfb/b682504c7c19cd6fae11
          var aggregates = {"by-type":{"float":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"unsignedInt":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"int":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"dateTime":["max","min","count"],"gYear":["max","min","count"],"gMonth":["max","min","count"],"yearMonthDuration":["max","sum","min","count","avg"],"decimal":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"anyURI":["count"],"dayTimeDuration":["max","sum","min","count","avg"],"date":["max","min","count"],"double":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"string":["count"],"gYearMonth":["max","min","count"],"time":["max","min","count"],"point":["max","min","count"],"unsignedLong":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"long":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"gDay":["max","min","count"]},"info":{"variance-population":{"reference-arity":1},"correlation":{"reference-arity":2},"avg":{"reference-arity":1},"count":{"reference-arity":1},"min":{"reference-arity":1},"sum":{"reference-arity":1},"median":{"reference-arity":1},"stddev-population":{"reference-arity":1},"covariance":{"reference-arity":2},"stddev":{"reference-arity":1},"covariance-population":{"reference-arity":2},"max":{"reference-arity":1},"variance":{"reference-arity":1}}};

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

          scope.shortName = indexService.shortName;

          scope.addColumn = function(field) {
            scope.data.serializedQuery.columns.push(field);
          };

          scope.availableFns = function(field) {
            return aggregates['by-type'][ field['scalar-type'] ].filter(function(fn) {
              //TODO: support arity=2
              return aggregates.info[ fn ]['reference-arity'] === 1;
            });
          };

          scope.addCompute = function(field, operation) {
            scope.data.serializedQuery.computes.push({
              fn: operation,
              ref: field
            });
          };

        }
      };
    }
  ]);
})();

(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlAnalyticsViewChart', mlAnalyticsViewChart);

  function mlAnalyticsViewChart() {
    return {
      restrict: 'E',
      templateUrl: '/templates/ml-report/ml-analytics-view-chart.html',
      controller: 'mlAnalyticsViewChartCtrl'
    };
  }
}());

(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlResultsGrid', mlResultsGrid);

  function mlResultsGrid() {
    return {
      restrict: 'E',
      templateUrl: '/templates/ml-report/ml-results-grid.html',
      scope: {
        resultsObject: '=',
        queryError: '='
      },
      controller: 'mlResultsGridCtrl'
    };
  }
}());

(function () {

  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .directive('mlSmartGrid', mlSmartGrid);

  function mlSmartGrid() {
    return {
      restrict: 'A',
      replace: false,
      templateUrl: '/templates/ml-report/chart-builder.html',
      controller:  'mlSmartGridCtrl',

      link: function($scope, element, attrs) {
        $scope.element = element;

        $scope.$watch('widget.mode', function(mode) {
          $scope.data.needsUpdate = true;
        });
      }
    };
  }
}());

(function() {
  'use strict';
  // Recursively decide whether to show a group or rule

  angular.module('ml-sq-builder').directive('sqBuilderChooser', [
    'RecursionHelper',
    'groupClassHelper',

    function sqBuilderChooser(RH, groupClassHelper) {
      return {
        scope: {
          sqFields: '=',
          item: '=sqBuilderChooser',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/ChooserDirective.html',

        compile: function (element) {
          return RH.compile(element, function(scope, el, attrs) {
            var depth = scope.depth = (+ attrs.depth),
                item = scope.item;

            scope.getGroupClassName = function() {
              var level = depth;
              if (item.type === 'group') level++;

              return groupClassHelper(level);
            };
          });
        }
      };
    }
  ]);
})();

(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilderGroup', [
    'RecursionHelper',
    'groupClassHelper',

    function sqBuilderGroup(RH, groupClassHelper) {
      return {
        scope: {
          sqFields: '=',
          group: '=sqBuilderGroup',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/GroupDirective.html',

        compile: function(element) {
          return RH.compile(element, function(scope, el, attrs) {
            var depth = scope.depth = (+ attrs.depth);
            var group = scope.group;

            scope.addRule = function() {
              group.rules.push({});
            };
            scope.addGroup = function() {
              group.rules.push({
                type: 'group',
                subType: 'and-query',
                rules: []
              });
            };

            scope.removeChild = function(idx) {
              group.rules.splice(idx, 1);
            };

            scope.getGroupClassName = function() {
              return groupClassHelper(depth + 1);
            };
          });
        }
      };
    }
  ]);
})();

(function() {
  'use strict';

  angular
    .module('ml-sq-builder')
    .directive('sqBuilderRule', ['mlAnalyticsIndexService',
    function sqBuilderRule(indexService) {
      return {
        scope: {
          sqFields: '=',
          rule: '=sqBuilderRule',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/RuleDirective.html',

        link: function(scope) {
          scope.shortName = indexService.shortName;
          
          scope.isQueryableIndex = function(field) {
            return _.includes(
              ['string', 'numeric'],
              indexService.highLevelType(field)
            );
          };
        }
      };
    }
  ]);
})();

(function() {
  'use strict';

  angular.module('ml-sq-builder').directive('sqBuilder', [
    'sqBuilderService',

    function EB(sqBuilderService) {
      return {
        scope: {
          data: '=sqBuilder',
        },

        templateUrl: '/ml-sq-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.filters = [];

          /**
           * Removes either group or rule
           */
          scope.removeChild = function(idx) {
            scope.filters.splice(idx, 1);
          };

          /**
           * Adds a single rule
           */
          scope.addRule = function() {
            scope.filters.push({});
          };

          /**
           * Adds a group of rules
           */
          scope.addGroup = function() {
            scope.filters.push({
              type: 'group',
              subType: 'and-query',
              rules: []
            });
          };

          scope.$watch('data.needsUpdate', function(curr) {
            if (! curr) return; 
            scope.filters = sqBuilderService.toFilters(data.query, scope.data.fields);
            scope.data.needsUpdate = false;
          });

          scope.$watch('filters', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue))  {
              scope.data.query.length = 0;
              angular.extend(
                scope.data.query,
                sqBuilderService.toQuery(scope.filters, scope.data.fields)
              );
            }

          }, true);
        }
      };
    }
  ]);
})();

(function() {
  'use strict';

  // Determines which rule type should be displayed
  angular.module('ml-sq-builder').directive('sqType', [
    function() {
      return {
        scope: {
          type: '=sqType',
          rule: '=',
          guide: '='
        },

        template: '<ng-include src="getTemplateUrl()" />',

        link: function(scope) {
          scope.getTemplateUrl = function() {
            var type = scope.type;
            if (! type) return;

            type = type.charAt(0).toUpperCase() + type.slice(1);

            return '/ml-sq-builder/types/' + type + '.html';
          };

          // This is a weird hack to make sure these are numbers
          scope.booleans = [ 'False', 'True' ];
          scope.booleansOrder = [ 'True', 'False' ];

          scope.inputNeeded = function() {
            var needs = [
              'value-query',
              'word-query',
              'EQ',
              'NE',
              'GT',
              'GE',
              'LT',
              'LE'
            ];

            // A range query must either be backed by a 
            // range index or used in a filtered search 
            // operation.

            return ~needs.indexOf(scope.rule.subType);
          };
        },
      };
    }
  ]);
})();

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDesign', mlAnalyticsDesign);

  function mlAnalyticsDesign() {
    return {
      restrict: 'E',
      templateUrl: '/templates/designer.html',
      controller: 'ReportDesignerCtrl'
    };
  }
}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDashboardHome', mlAnalyticsDashboardHome);

  function mlAnalyticsDashboardHome() {
    return {
      restrict: 'E',
      templateUrl: '/templates/home.html'
    };
  }
}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('manageMlAnalyticsDashboard', manageMlAnalyticsDashboard);

  function manageMlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/manage.html',
      controller: 'ManageCtrl'
    };
  }
}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsReportEditor', mlAnalyticsReportEditor);

  function mlAnalyticsReportEditor() {
    return {
      restrict: 'E',
      templateUrl: '/templates/editor.html',
      controller: 'ReportEditorCtrl'
    };
  }
}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsNewReport', mlAnalyticsNewReport);

  function mlAnalyticsNewReport() {
    return {
      restrict: 'E',
      templateUrl: '/templates/new-report.html',
      controller: 'NewReportCtrl'
    };
  }
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = [];

  function HomeCtrl() {
  }
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['$scope', '$location'];

  function DashboardCtrl($scope, $location) {

    function establishMode() {
      if($location.search()['ml-analytics-mode']) {
        $scope.mode = $location.search()['ml-analytics-mode'];
      } else {
        $location.search('ml-analytics-mode', 'home');
      }
    }

    establishMode();
  }
}());

(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlAnalyticsViewChartCtrl', mlAnalyticsViewChartCtrl);

  function mlAnalyticsViewChartCtrl($scope) {
  }

})();

(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlResultsGridCtrl', mlResultsGridCtrl);

  mlResultsGridCtrl.$inject = ['$scope'];

  function mlResultsGridCtrl($scope) {
    $scope.pageLength = '10';
    $scope.sortColumn = 0;
    $scope.sortReverse = false;
    $scope.gridPage = 1;

    $scope.sorter = function(item) {
      return item[$scope.sortColumn];
    };

    $scope.setSortColumn = function(column) {
      if (column === $scope.sortColumn) {
        $scope.sortReverse = !$scope.sortReverse;
      } else {
        $scope.sortColumn = column;
      }
    };
  }

})();

(function () {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .controller('mlSmartGridCtrl', mlSmartGridCtrl);

  mlSmartGridCtrl.$inject = ['$scope', '$http', '$q', 'mlAnalyticsIndexService'];

  function mlSmartGridCtrl($scope, $http, $q, indexService) {
    $scope.widget.mode = 'Design';
    $scope.isGridCollapsed  = true;
    $scope.shouldShowChart = false;
    $scope.shouldShowGrid = false;

    $scope.model = {
      queryError: null,
      configError: null,
      results: null,
      loadingConfig: false,
      loadingResults: false
    };

    $scope.deferredAbort = null;

    $scope.initializeQuery = function() {
      $scope.data.metaConstraint = {};
      if ($scope.data.groupingStrategy === 'collection' && $scope.data.directory) {
        $scope.data.metaConstraint = {
          'collection-query': {
            'uri': [$scope.data.directory]
          }
        };
      }
      $scope.data.operation = 'and-query';
      $scope.data.rootQuery = {};
      $scope.data.rootQuery[$scope.data.operation] = {
        'queries': $scope.data.query
      };
      $scope.data.serializedQuery = {
        'result-type': 'group-by',
        columns: [],
        computes: [],
        options: ['headers=true'],
        query: {
          query: {
            queries: [$scope.data.metaConstraint, $scope.data.rootQuery],
            qtext: ''
          }
        }
      };
    };

    if ($scope.widget.dataModelOptions.data) {
      $scope.data = $scope.widget.dataModelOptions.data;
      // Wire up references between parts of the data structure
      // TODO? Eliminate these and just always use in-place?
      $scope.data.rootQuery[$scope.data.operation] = {
        'queries': $scope.data.query
      };
      $scope.data.serializedQuery.query.query.queries = [
        $scope.data.metaConstraint,
        $scope.data.rootQuery
      ];
    } else {
      $scope.data = {
        groupingStrategy: 'collection',
        query: [],
        needsUpdate: true,
        originalDocs: []
      };
      $scope.initializeQuery();
    }

    $scope.executor = {};

    $scope.clearResults = function() {
      $scope.model.results = null;
    };

    // TODO: move into column/row directive
    $scope.dataManager = {
      removeCompute: function(index) {
        $scope.data.serializedQuery.computes.splice(index, 1);
      },
      removeColumn: function(index) {
        $scope.data.serializedQuery.columns.splice(index, 1);
      }
    };

    // TODO: move into showQuery directive?
    $scope.renderGroupByConfig = function() {
      return angular.toJson($scope.data.serializedQuery, true);
    };
    $scope.showGroupByConfig = function() {
      $scope.groupByConfigIsHidden = false;
    };
    $scope.hideGroupByConfig = function() {
      $scope.groupByConfigIsHidden = true;
    };
    $scope.hideGroupByConfig();

    $scope.shortName = indexService.shortName;

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.data.groupingStrategy
      };

      $scope.model.loadingConfig = true;

      if ($scope.data.targetDatabase) {
        params['rs:database'] = $scope.data.targetDatabase;
      }

      $scope.clearResults();

      $http.get('/v1/resources/index-discovery', {
        params: params
      }).then(function(response) {
        $scope.model.loadingConfig = false;

        if (response.data.errorResponse) {
          $scope.model.configError = response.data.errorResponse.message;
          return;
        }

        $scope.data.targetDatabase = response.data['current-database'];
        $scope.data.databases = response.data.databases;

        if (!_.isEmpty(response.data.docs)) {
          $scope.model.configError = null;

          var docs = response.data.docs;
          $scope.data.originalDocs = docs;
          $scope.data.directories = Object.keys(docs);
          if (!_.includes($scope.data.directories, $scope.data.directory)) {
            $scope.data.directory = undefined;
            $scope.initializeQuery();
          }
          $scope.data.fields = docs[$scope.data.directory];

          if ($scope.data.fields) {
            $scope.setDocument();
          }

        } else {
          $scope.model.configError = 'No documents with range indices in the database';
        }

        $scope.execute();
      }, function(response) {
        $scope.model.loadingConfig = false;
        $scope.model.configError = response.data;
      });
    };

    $scope.setDocument = function() {
      $scope.data.needsUpdate = true;
    };

    $scope.save = function() {
      $scope.widget.dataModelOptions.data = $scope.data;
      $scope.options.saveDashboard();
    };

    $scope.execute = function() {
      var columns, computes;
      if ($scope.data.serializedQuery) {
        columns  = $scope.data.serializedQuery.columns;
        computes = $scope.data.serializedQuery.computes;
      } else {
        columns  = [];
        computes = [];
      }

      if (columns.length + computes.length > 0) {
        $scope.model.loadingResults = true;
        $scope.executeComplexQuery(columns.length);
      }
    };

    $scope.executeComplexQuery = function(columnCount) {
      var params = {};

      $scope.model.loadingResults = true;
      $scope.clearResults();

      $scope.deferredAbort = $q.defer();
      $http({
        method: 'POST',
        url: '/v1/resources/group-by',
        params: params,
        data: $scope.data.serializedQuery,
        timeout: $scope.deferredAbort.promise
      }).then(function(response) {
        $scope.model.results = response.data;
        $scope.model.queryError = null;
        $scope.model.loadingResults = false;

        $scope.createComplexTable($scope.model.results.headers, $scope.model.results.results);
        $scope.createHighcharts(columnCount, $scope.model.results.headers, $scope.model.results.results);

      }, function(response) {
        $scope.model.loadingResults = false;

        if (response.status !== 0) {
          $scope.model.queryError = {
            title: response.statusText,
            description: response.data
          };
        }
      });
    };

    $scope.createComplexTable = function(headers, results) {
      $scope.cols = [];

      headers.forEach(function(header) {
        $scope.cols.push({
          field: header, 
          title: header, 
          sortable: header, 
          show: true
        });
      });

      var records = [];
      results.forEach(function(row) {
        var record = {};
        for (var i = 0; i < row.length; i++) {
          record[headers[i]] = row[i];
        }
        records.push(record);
      });

      var initialParams = {
        count: $scope.widget.dataModelOptions.pageLength, // count per page
        sorting: {}
      };
      initialParams.sorting[headers[0]] = 'desc';
    };

    $scope.createHighcharts = function(columnCount, headers, results) {
      var chartType = $scope.widget.dataModelOptions.chart;

      if (results[0] && results[0].length === columnCount) {
        $scope.shouldShowChart = false;
        $scope.shouldShowGrid = true;
        $scope.isGridCollapsed = false;
      } else {
        $scope.shouldShowChart = true;
        $scope.shouldShowGrid = true;
        $scope.isGridCollapsed = true;
      }

      if (chartType === 'column')
        $scope.createColumnHighcharts(columnCount, headers, results);
      else
        $scope.createPieHighcharts(columnCount, headers, results);
    };

    // Create a column chart
    $scope.createColumnHighcharts = function(columnCount, headers, results) {
      var categories = [];
      var series = [];

      // columnCount is number of groupby fields.
      // Skip all groupby fields.
      for (var i = columnCount; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < columnCount; i++) {
          groups.push(row[i]);
        }
        categories.push(groups.join(','));

        for (i = columnCount; i < row.length; i++) {
          series[i-columnCount].data.push(row[i]);
        }
      });

      $scope.highchartConfig = {
        options: {
          chart: {
            type: 'column'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        series: series
      };
    };

    // Create a pie chart
    $scope.createPieHighcharts = function(columnCount, headers, results) {
      var colors = Highcharts.getOptions().colors;
      var measures = [];
      var series = [];

      // columnCount is number of groupby fields.
      // Skip all groupby fields.
      for (var i = columnCount; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
        measures.push(headers[i]);
      }

      var rings = series.length;
      if (rings > 1) {
        var percent = Math.floor(100/rings);
        var ring = 0;

        // The innermost ring
        series[ring].size = percent + '%';
        /*series[ring].dataLabels = {
          distance: -30
        };*/

        for (ring = 1; ring < rings; ring++) {
          series[ring].innerSize = percent*ring + '%';
          series[ring].size = percent*(ring+1) + '%';
          /*series[ring].dataLabels = {
            distance: (0-percent*ring)
          };*/
        }
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < columnCount; i++) {
          groups.push(row[i]);
        }
        var category = groups.join(',');

        for (i = columnCount; i < row.length; i++) {
          series[i-columnCount].data.push({
            name: category,
            color: colors[i-columnCount],
            y: row[i]
          });
        }
      });

      var title = 'Measures: ' + measures;

      $scope.highchartConfig = {
        options: {
          chart: {
            type: 'pie'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            pie: {
              showInLegend: true,
              shadow: false,
              center: ['50%', '50%'],
              dataLabels: {
                enabled: true,
                useHTML: false,
                format: '<b>{point.name} {series.name}</b>: {point.percentage:.1f}%',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: title
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        series: series
      };
    };

    $scope.$watch('data.directory', function() {
      $scope.data.fields = $scope.data.originalDocs[$scope.data.directory];
    });

    $scope.$watch('data.operation', function(newOperation, oldOperation) {
      if (newOperation !== oldOperation) {
        delete $scope.data.rootQuery[oldOperation];
        $scope.data.rootQuery[newOperation] = {
          'queries': $scope.data.query
        };
      }
    });

    // Kick off
    $scope.getDbConfig();
  }
})();

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportDesignerCtrl', ['$scope', '$location', 'ReportService', 'WidgetDefinitions',
    function($scope, $location, ReportService, WidgetDefinitions) {
     
    $scope.report = {};
    $scope.report.uri = $location.search()['ml-analytics-uri'];

    var defaultWidgets;
    createDefaultWidgets();

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

    ReportService.getReport($scope.report.uri)
      .then(function(resp) {
        angular.extend($scope.report, resp.data);
        initWithData();
    });


    function initWithData() {
      createDefaultWidgets();
      ReportService.loadWidgets(defaultWidgets);
    }

    function createDefaultWidgets() {
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
    }

    $scope.returnHome = function() {
      $location.search('ml-analytics-mode', 'home');
      $location.search('ml-analytics-uri', null);
    };

    $scope.$on('widgetAdded', function(event, widget) {
      event.stopPropagation();
    });

    $scope.saveWidgets = function() {
      ReportService.updateReport($scope.report);
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ManageCtrl', ManageCtrl);

  ManageCtrl.$inject = ['$scope', '$location', '$window', 'userService',
                        'ReportService', 'WidgetDefinitions'];

  function ManageCtrl($scope, $location, $window, userService,
                      ReportService, WidgetDefinitions) {

    $scope.currentUser = null;
    $scope.search = {};
    $scope.showLoading = false;
    $scope.widgetDefs = WidgetDefinitions;
    $scope.reports = [];

    function establishMode() {
      if($location.search()['ml-analytics-mode']) {
        $scope.mode = $location.search()['ml-analytics-mode'];
      } else {
        $location.search('ml-analytics-mode', 'home');
      }
    }

    establishMode();

    // The report selected for update or delete.
    $scope.report = {};

    $scope.addWidget = function(widgetDef) {
      ReportService.getDashboardOptions($scope.reportDashboardOptions).addWidget({
        name: widgetDef.name
      });
    };

    $scope.deleteReport = function(report) {
      if ($window.confirm(
        'This action will delete this report permanently. ' +
        'Are you sure you want to delete it?')) {
        ReportService.deleteReport(report.uri).then(function(response) {
          for (var i = 0; i < $scope.reports.length; i++) {
            if (report.uri === $scope.reports[i].uri) {
              // The first parameter is the index, the second 
              // parameter is the number of elements to remove.
              $scope.reports.splice(i, 1);
              break;
            }
          }
        }, function(response) {
          $window.alert(response);
        });
      }
    };

    $scope.newReportForm = function() {
      $location.search('ml-analytics-mode', 'new');
    };

    $scope.gotoDesigner = function(uri) {
      $location.search('ml-analytics-mode', 'design');
      $location.search('ml-analytics-uri', uri);
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.search('ml-analytics-mode', 'edit');
      $location.search('ml-analytics-uri', $scope.report.uri);
    };

    $scope.getReports = function() {
      $scope.showLoading = true;
      ReportService.getReports().then(function(response) {
        $scope.reports = response.data.results;
        _.each($scope.reports, function(report) {
          report.name = report.extracted.content[0].name;
        });
        $scope.showLoading = false;
      }, function() {
        $scope.showLoading = false;
      });
    };

    // Retrieve reports if the user logs in
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
      $scope.getReports();
    });

    $scope.$on('$locationChangeSuccess', function(latest, old) {
      establishMode();
    });

    $scope.$on('mlAnalyticsDashboard:ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

  }

}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl', ['$scope', '$location', '$rootScope', 'ReportService',
    function($scope, $location, $rootScope, ReportService) {

    $scope.report = {};

    $scope.createReport = function() {
      $scope.report.uri = '/ml-analytics-dashboard-reports/' +
        encodeURIComponent($scope.report.name) +
        '-' +
        Math.floor((Math.random() * 1000000) + 1) +
        '.json';
        
      ReportService.createReport($scope.report).then(function(response) {
        $rootScope.$broadcast('mlAnalyticsDashboard:ReportCreated', $scope.report);
        $location.search('ml-analytics-mode', 'design');
        $location.search('ml-analytics-uri', $scope.report.uri);
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard')
    .controller('ReportEditorCtrl', ['$scope', '$location', 'ReportService',
    function($scope, $location, ReportService) {

    $scope.report = {};
    $scope.report.uri = $location.search()['ml-analytics-uri'];
    ReportService.getReport($scope.report.uri).then(function(response) {
      angular.extend($scope.report, response.data);
    });

    $scope.updateReport = function() {
      ReportService.updateReport($scope.report).then(function(response) {
        $location.search('ml-analytics-mode', 'home');
      });
    };

  }]);
}());

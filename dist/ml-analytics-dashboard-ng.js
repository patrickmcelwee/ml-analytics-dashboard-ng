(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', [
    'highcharts-ng',
    'ml.analyticsDashboard.report',
    'ml.common',
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
    var fieldData = fieldMap[fieldName];

    if (! fieldName) return;

    switch (fieldData.type) {
      case 'string':
        // A query for a string field is translated 
        // to value-query or word-query or range-query.

        if (fieldData.classification === 'path-expression') {
          // Convert path rule to range-query
          var dataType = 'xs:' + fieldData.type;
          obj['range-query'] = {
            'path-index': {
              'text': fieldName,
              'namespaces': {}
            },
            'collation': fieldData.collation,
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

          setConstraint(value, fieldName, fieldData);

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

        if (fieldData.classification === 'path-expression') {
          value['path-index'] = {
            text: fieldName,
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
  function setConstraint(value, fieldName, fieldData) {
    var claz = fieldData.classification;

    if (claz === 'json-property') {
      value[claz] = fieldName;
    } else if (claz === 'element' || claz === 'attribute') {
      value[claz] = {
        name: fieldName,
        ns: fieldData.ns
      };
      if (claz === 'attribute') {
        value.element = {
          name: fieldData['parent-localname'],
          ns: fieldData['parent-namespace-uri']
        };
      }
    } else if (claz === 'field') {
      value[claz] = {
        name: fieldName,
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

(function() {
  'use strict';

  // Report Service
  angular.module('ml.analyticsDashboard').service('ReportService', ['$http', '$q', 'MLRest', function($http, $q, mlRest) {
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

  angular.module('ml-dimension-builder').directive('dimensionBuilder', [
    function DB() {
      return {
        scope: {
          data: '=dimensionBuilder',
        },

        templateUrl: '/ml-dimension-builder/BuilderDirective.html',

        link: function(scope) {

          // generated by https://gist.github.com/joemfb/b682504c7c19cd6fae11
          var aggregates = {"by-type":{"float":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"unsignedInt":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"int":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"dateTime":["max","min","count"],"gYear":["max","min","count"],"gMonth":["max","min","count"],"yearMonthDuration":["max","sum","min","count","avg"],"decimal":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"anyURI":["count"],"dayTimeDuration":["max","sum","min","count","avg"],"date":["max","min","count"],"double":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"string":["count"],"gYearMonth":["max","min","count"],"time":["max","min","count"],"point":["max","min","count"],"unsignedLong":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"long":["variance","max","covariance-population","stddev","covariance","stddev-population","median","sum","min","count","avg","correlation","variance-population"],"gDay":["max","min","count"]},"info":{"variance-population":{"reference-arity":1},"correlation":{"reference-arity":2},"avg":{"reference-arity":1},"count":{"reference-arity":1},"min":{"reference-arity":1},"sum":{"reference-arity":1},"median":{"reference-arity":1},"stddev-population":{"reference-arity":1},"covariance":{"reference-arity":2},"stddev":{"reference-arity":1},"covariance-population":{"reference-arity":2},"max":{"reference-arity":1},"variance":{"reference-arity":1}}};

          scope.highLevelType = function(type) {
            switch(type) {
              case 'int':
              case 'unsignedInt':
              case 'long':
              case 'unsignedLong':
              case 'float':
              case 'double':
              case 'decimal':
                return 'numeric';
              default:
                return type;
            }
          };

          scope.isColumnField = function(field) {
            return scope.highLevelType(field['scalar-type']) === 'string';
          };

          scope.isComputeField = function(field) {
            return scope.highLevelType(field['scalar-type']) === 'numeric';
          };

          scope.shortName = function(field) {
            return field.localname || field['path-expression'];
          };

          scope.addColumn = function(field) {
            scope.data.columns.push(field);
          };

          scope.availableFns = function(field) {
            return aggregates['by-type'][ field['scalar-type'] ].filter(function(fn) {
              //TODO: support arity=2
              return aggregates.info[ fn ]['reference-arity'] === 1;
            });
          };

          scope.addCompute = function(field, operation) {
            scope.data.computes.push({
              fn: operation,
              ref: field
            });
          };

          scope.renderGroupByConfig = function() {
            return JSON.stringify(
              {
                columns: scope.data.columns,
                computes: scope.data.computes
              },
              null,
              2
            );
          };

          scope.showGroupByConfig = function() {
            scope.groupByConfigIsHidden = false;
          };

          scope.hideGroupByConfig = function() {
            scope.groupByConfigIsHidden = true;
          };

          scope.hideGroupByConfig();

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

  angular.module('ml-sq-builder').directive('sqBuilderRule', [
    function sqBuilderRule() {
      return {
        scope: {
          sqFields: '=',
          rule: '=sqBuilderRule',
          onRemove: '&',
        },

        templateUrl: '/ml-sq-builder/RuleDirective.html',

        link: function(scope) {
          scope.getType = function() {
            var fields = scope.sqFields,
              field = scope.rule.field;

            if (! fields || ! field) return;

            return fields[field].type;
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

          if ( typeof scope.data.structuredQuery === 'undefined' ) {
            Object.defineProperty(scope.data, 'structuredQuery', {
              get: function() {
                var rootQuery = {};
                rootQuery[scope.data.operation] = {'queries': scope.data.query};
                return {
                  'query': {
                    "queries": [ rootQuery ]
                  }
                };
              }
            });
          }

          scope.renderStructuredQuery = function() {
            return JSON.stringify(scope.data.structuredQuery, null, 2);
          };

          scope.showStructuredQuery = function() {
            scope.structuredQueryIsHidden = false;
          };

          scope.hideStructuredQuery = function() {
            scope.structuredQueryIsHidden = true;
          };

          scope.hideStructuredQuery();

          scope.$watch('data.needsUpdate', function(curr) {
            if (! curr) return; 
            scope.filters = sqBuilderService.toFilters(data.query, scope.data.fields);
            scope.data.needsUpdate = false;
          });

          scope.$watch('filters', function(curr) {
            if (! curr) return;

            data.query = sqBuilderService.toQuery(scope.filters, scope.data.fields);
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

/*! 
 * jquery.event.drag - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x

;(function( $ ){

// add the jquery instance method
$.fn.drag = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drag") !== 0 ) 
		type = "drag"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drag special event 
drag = $special.drag = {
	
	// these are the default settings
	defaults: {
		which: 1, // mouse button pressed to start drag sequence
		distance: 0, // distance dragged before dragstart
		not: ':input', // selector to suppress dragging on target elements
		handle: null, // selector to match handle target elements
		relative: false, // true to use "position", false to use "offset"
		drop: true, // false to suppress drop events, true or selector to allow
		click: false // false to suppress click events after dragend (no proxy)
	},
	
	// the key name for stored drag data
	datakey: "dragdata",
	
	// prevent bubbling for better performance
	noBubble: true,
	
	// count bound related events
	add: function( obj ){ 
		// read the interaction data
		var data = $.data( this, drag.datakey ),
		// read any passed options 
		opts = obj.data || {};
		// count another realted event
		data.related += 1;
		// extend data options bound with this event
		// don't iterate "opts" in case it is a node 
		$.each( drag.defaults, function( key, def ){
			if ( opts[ key ] !== undefined )
				data[ key ] = opts[ key ];
		});
	},
	
	// forget unbound related events
	remove: function(){
		$.data( this, drag.datakey ).related -= 1;
	},
	
	// configure interaction, capture settings
	setup: function(){
		// check for related events
		if ( $.data( this, drag.datakey ) ) 
			return;
		// initialize the drag data with copied defaults
		var data = $.extend({ related:0 }, drag.defaults );
		// store the interaction data
		$.data( this, drag.datakey, data );
		// bind the mousedown event, which starts drag interactions
		$event.add( this, "touchstart mousedown", drag.init, data );
		// prevent image dragging in IE...
		if ( this.attachEvent ) 
			this.attachEvent("ondragstart", drag.dontstart ); 
	},
	
	// destroy configured interaction
	teardown: function(){
		var data = $.data( this, drag.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		$.removeData( this, drag.datakey );
		// remove the mousedown event
		$event.remove( this, "touchstart mousedown", drag.init );
		// enable text selection
		drag.textselect( true ); 
		// un-prevent image dragging in IE...
		if ( this.detachEvent ) 
			this.detachEvent("ondragstart", drag.dontstart ); 
	},
		
	// initialize the interaction
	init: function( event ){ 
		// sorry, only one touch at a time
		if ( drag.touched ) 
			return;
		// the drag/drop interaction data
		var dd = event.data, results;
		// check the which directive
		if ( event.which != 0 && dd.which > 0 && event.which != dd.which ) 
			return; 
		// check for suppressed selector
		if ( $( event.target ).is( dd.not ) ) 
			return;
		// check for handle selector
		if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) 
			return;

		drag.touched = event.type == 'touchstart' ? this : null;
		dd.propagates = 1;
		dd.mousedown = this;
		dd.interactions = [ drag.interaction( this, dd ) ];
		dd.target = event.target;
		dd.pageX = event.pageX;
		dd.pageY = event.pageY;
		dd.dragging = null;
		// handle draginit event... 
		results = drag.hijack( event, "draginit", dd );
		// early cancel
		if ( !dd.propagates )
			return;
		// flatten the result set
		results = drag.flatten( results );
		// insert new interaction elements
		if ( results && results.length ){
			dd.interactions = [];
			$.each( results, function(){
				dd.interactions.push( drag.interaction( this, dd ) );
			});
		}
		// remember how many interactions are propagating
		dd.propagates = dd.interactions.length;
		// locate and init the drop targets
		if ( dd.drop !== false && $special.drop ) 
			$special.drop.handler( event, dd );
		// disable text selection
		drag.textselect( false ); 
		// bind additional events...
		if ( drag.touched )
			$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
		else 
			$event.add( document, "mousemove mouseup", drag.handler, dd );
		// helps prevent text selection or scrolling
		if ( !drag.touched || dd.live )
			return false;
	},	
	
	// returns an interaction object
	interaction: function( elem, dd ){
		var offset = $( elem )[ dd.relative ? "position" : "offset" ]() || { top:0, left:0 };
		return {
			drag: elem, 
			callback: new drag.callback(), 
			droppable: [],
			offset: offset
		};
	},
	
	// handle drag-releatd DOM events
	handler: function( event ){ 
		// read the data before hijacking anything
		var dd = event.data;	
		// handle various events
		switch ( event.type ){
			// mousemove, check distance, start dragging
			case !dd.dragging && 'touchmove': 
				event.preventDefault();
			case !dd.dragging && 'mousemove':
				//  drag tolerance, x² + y² = distance²
				if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
					break; // distance tolerance not reached
				event.target = dd.target; // force target from "mousedown" event (fix distance issue)
				drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
				if ( dd.propagates ) // "dragstart" not rejected
					dd.dragging = true; // activate interaction
			// mousemove, dragging
			case 'touchmove':
				event.preventDefault();
			case 'mousemove':
				if ( dd.dragging ){
					// trigger "drag"		
					drag.hijack( event, "drag", dd );
					if ( dd.propagates ){
						// manage drop events
						if ( dd.drop !== false && $special.drop )
							$special.drop.handler( event, dd ); // "dropstart", "dropend"							
						break; // "drag" not rejected, stop		
					}
					event.type = "mouseup"; // helps "drop" handler behave
				}
			// mouseup, stop dragging
			case 'touchend': 
			case 'mouseup': 
			default:
				if ( drag.touched )
					$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
				else 
					$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events	
				if ( dd.dragging ){
					if ( dd.drop !== false && $special.drop )
						$special.drop.handler( event, dd ); // "drop"
					drag.hijack( event, "dragend", dd ); // trigger "dragend"	
				}
				drag.textselect( true ); // enable text selection
				// if suppressing click events...
				if ( dd.click === false && dd.dragging )
					$.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
				dd.dragging = drag.touched = false; // deactivate element	
				break;
		}
	},
		
	// re-use event object for custom events
	hijack: function( event, type, dd, x, elem ){
		// not configured
		if ( !dd ) 
			return;
		// remember the original event and type
		var orig = { event:event.originalEvent, type:event.type },
		// is the event drag related or drog related?
		mode = type.indexOf("drop") ? "drag" : "drop",
		// iteration vars
		result, i = x || 0, ia, $elems, callback,
		len = !isNaN( x ) ? x : dd.interactions.length;
		// modify the event type
		event.type = type;
		// remove the original event
		event.originalEvent = null;
		// initialize the results
		dd.results = [];
		// handle each interacted element
		do if ( ia = dd.interactions[ i ] ){
			// validate the interaction
			if ( type !== "dragend" && ia.cancelled )
				continue;
			// set the dragdrop properties on the event object
			callback = drag.properties( event, dd, ia );
			// prepare for more results
			ia.results = [];
			// handle each element
			$( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
				// identify drag or drop targets individually
				callback.target = subject;
				// force propagtion of the custom event
				event.isPropagationStopped = function(){ return false; };
				// handle the event	
				result = subject ? $event.dispatch.call( subject, event, callback ) : null;
				// stop the drag interaction for this element
				if ( result === false ){
					if ( mode == "drag" ){
						ia.cancelled = true;
						dd.propagates -= 1;
					}
					if ( type == "drop" ){
						ia[ mode ][p] = null;
					}
				}
				// assign any dropinit elements
				else if ( type == "dropinit" )
					ia.droppable.push( drag.element( result ) || subject );
				// accept a returned proxy element 
				if ( type == "dragstart" )
					ia.proxy = $( drag.element( result ) || ia.drag )[0];
				// remember this result	
				ia.results.push( result );
				// forget the event result, for recycling
				delete event.result;
				// break on cancelled handler
				if ( type !== "dropinit" )
					return result;
			});	
			// flatten the results	
			dd.results[ i ] = drag.flatten( ia.results );	
			// accept a set of valid drop targets
			if ( type == "dropinit" )
				ia.droppable = drag.flatten( ia.droppable );
			// locate drop targets
			if ( type == "dragstart" && !ia.cancelled )
				callback.update(); 
		}
		while ( ++i < len )
		// restore the original event & type
		event.type = orig.type;
		event.originalEvent = orig.event;
		// return all handler results
		return drag.flatten( dd.results );
	},
		
	// extend the callback object with drag/drop properties...
	properties: function( event, dd, ia ){		
		var obj = ia.callback;
		// elements
		obj.drag = ia.drag;
		obj.proxy = ia.proxy || ia.drag;
		// starting mouse position
		obj.startX = dd.pageX;
		obj.startY = dd.pageY;
		// current distance dragged
		obj.deltaX = event.pageX - dd.pageX;
		obj.deltaY = event.pageY - dd.pageY;
		// original element position
		obj.originalX = ia.offset.left;
		obj.originalY = ia.offset.top;
		// adjusted element position
		obj.offsetX = obj.originalX + obj.deltaX; 
		obj.offsetY = obj.originalY + obj.deltaY;
		// assign the drop targets information
		obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
		obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
		return obj;	
	},
	
	// determine is the argument is an element or jquery instance
	element: function( arg ){
		if ( arg && ( arg.jquery || arg.nodeType == 1 ) )
			return arg;
	},
	
	// flatten nested jquery objects and arrays into a single dimension array
	flatten: function( arr ){
		return $.map( arr, function( member ){
			return member && member.jquery ? $.makeArray( member ) : 
				member && member.length ? drag.flatten( member ) : member;
		});
	},
	
	// toggles text selection attributes ON (true) or OFF (false)
	textselect: function( bool ){ 
		$( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart )
			.css("MozUserSelect", bool ? "" : "none" );
		// .attr("unselectable", bool ? "off" : "on" )
		document.unselectable = bool ? "off" : "on"; 
	},
	
	// suppress "selectstart" and "ondragstart" events
	dontstart: function(){ 
		return false; 
	},
	
	// a callback instance contructor
	callback: function(){}
	
};

// callback methods
drag.callback.prototype = {
	update: function(){
		if ( $special.drop && this.available.length )
			$.each( this.available, function( i ){
				$special.drop.locate( this, i );
			});
	}
};

// patch $.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
	if ( $.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
		$.removeData( this, "suppress."+ event.type );
		return;
	}
	return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
	props: "clientX clientY pageX pageY screenX screenY".split( " " ),
	filter: function( event, orig ) {
		if ( orig ){
			var touched = ( orig.touches && orig.touches[0] )
				|| ( orig.changedTouches && orig.changedTouches[0] )
				|| null; 
			// iOS webkit: touchstart, touchmove, touchend
			if ( touched ) 
				$.each( touchHooks.props, function( i, prop ){
					event[ prop ] = touched[ prop ];
				});
		}
		return event;
	}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

})( jQuery );
/*! 
 * jquery.event.drag.live - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2010-06-07
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x, event.drag 2.2

;(function( $ ){
	
// local refs (increase compression)
var $event = $.event,
// ref the special event config
drag = $event.special.drag,
// old drag event add method
origadd = drag.add,
// old drag event teradown method
origteardown = drag.teardown;

// allow events to bubble for delegation
drag.noBubble = false;

// the namespace for internal live events
drag.livekey = "livedrag";

// new drop event add method
drag.add = function( obj ){ 
	// call the old method
	origadd.apply( this, arguments );
	// read the data
	var data = $.data( this, drag.datakey );
	// bind the live "draginit" delegator
	if ( !data.live && obj.selector ){
		data.live = true;
		$event.add( this, "draginit."+ drag.livekey, drag.delegate );
	}
};

// new drop event teardown method
drag.teardown = function(){ 
	// call the old method
	origteardown.apply( this, arguments );
	// read the data
	var data = $.data( this, drag.datakey ) || {};
	// bind the live "draginit" delegator
	if ( data.live ){
		// remove the "live" delegation
		$event.remove( this, "draginit."+ drag.livekey, drag.delegate );
		data.live = false;
	}
};

// identify potential delegate elements
drag.delegate = function( event ){
	// local refs
	var elems = [], target, 
	// element event structure
	events = $.data( this, "events" ) || {};
	// query live events
	$.each( events || [], function( key, arr ){
		// no event type matches
		if ( key.indexOf("drag") !== 0 )
			return;
		$.each( arr || [], function( i, obj ){
			// locate the element to delegate
			target = $( event.target ).closest( obj.selector, event.currentTarget )[0];
			// no element found
			if ( !target ) 
				return;
			// add an event handler
			$event.add( target, obj.origType+'.'+drag.livekey, obj.origHandler || obj.handler, obj.data );
			// remember new elements
			if ( $.inArray( target, elems ) < 0 )
				elems.push( target );		
		});
	});
	// if there are no elements, break
	if ( !elems.length ) 
		return false;
	// return the matched results, and clenup when complete		
	return $( elems ).bind("dragend."+ drag.livekey, function(){
		$event.remove( this, "."+ drag.livekey ); // cleanup delegation
	});
};
	
})( jQuery );
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

  mlSmartGridCtrl.$inject = ['$scope', '$http', '$q'];

  function mlSmartGridCtrl($scope, $http, $q) {
    // Set the initial mode for this widget to View.
    $scope.widget.mode = 'View';
    $scope.isGridCollapsed  = true;
    $scope.shouldShowChart = false;

    $scope.model = {
      queryConfig: null,
      queryError: null,
      config: null,
      configError: null,
      results: null,
      includeFrequency: false,
      loadingConfig: false,
      loadingResults: false,
      groupingStrategy: 'collection',
      showBuilder: false
    };

    if ($scope.widget.dataModelOptions.groupingStrategy) {
      $scope.model.groupingStrategy = $scope.widget.dataModelOptions.groupingStrategy;
    }

    $scope.deferredAbort = null;

    $scope.data = {};
    $scope.data.operation = 'and-query';
    $scope.data.query = [];
    $scope.data.needsUpdate = true;
    $scope.data.directory = $scope.widget.dataModelOptions.directory;
    $scope.data.columns = [];
    $scope.data.computes = [];

    $scope.executor = {};

    $scope.clearResults = function() {
      $scope.model.results = null;
    };

    $scope.shortName = function(field) {
      return field.localname || field['path-expression'];
    };

    $scope.getDbConfig = function() {
      var params = {
        'rs:strategy': $scope.model.groupingStrategy
      };

      $scope.model.showBuilder = false;
      $scope.model.loadingConfig = true;

      if ($scope.model.config) {
        params['rs:database'] = $scope.model.config['current-database'];
      } else if ($scope.widget.dataModelOptions.database) {
        params['rs:database'] = $scope.widget.dataModelOptions.database;
      }

      $scope.clearResults();
      $scope.model.includeFrequency = false;
      // $scope.model.config = null;
      $scope.model.queryConfig = {
        'result-type': 'group-by',
        rows: [],
        columns: [],
        computes: [],
        options: ['headers=true'],
        query: {query: {}}
      };

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
          $scope.data.fields = angular.copy(docs[$scope.data.directory]);
;
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
      if ($scope.data.directory) {
        $scope.data.operation = 'and-query';
        $scope.data.query = [];

        if ($scope.data.directory === $scope.widget.dataModelOptions.directory) {
          if ($scope.widget.dataModelOptions.query && 
              $scope.widget.dataModelOptions.query.query &&
              $scope.widget.dataModelOptions.query.query.queries) {
            var query = $scope.widget.dataModelOptions.query.query.queries[0];
            var operation = Object.keys(query)[0];
            $scope.data.operation = operation;
            $scope.data.query = query[operation].queries;
          } else {
            $scope.data.operation = 'and-query';
            $scope.data.query = [];
          }

          if ($scope.widget.dataModelOptions.columns) {
            angular.copy($scope.widget.dataModelOptions.columns, $scope.data.columns);
          } else {
            $scope.data.columns = [];
          }
          if ($scope.widget.dataModelOptions.computes) {
            angular.copy($scope.widget.dataModelOptions.computes, $scope.data.computes);
          } else {
            $scope.data.computes = [];
          }
        } else {
          $scope.data.operation = 'and-query';
          $scope.data.query = [];
          $scope.data.columns = [];
          $scope.data.computes = [];
        }

        $scope.data.needsUpdate = true;

        $scope.model.showBuilder = true;
      } else {
        $scope.model.showBuilder = false;
      }
    };

    $scope.save = function() {
      $scope.widget.dataModelOptions.database = $scope.data.targetDatabase;
      $scope.widget.dataModelOptions.groupingStrategy = $scope.model.groupingStrategy;
      $scope.widget.dataModelOptions.directory = $scope.data.directory;

      $scope.widget.dataModelOptions.query = {};

      angular.copy($scope.data.structuredQuery, $scope.widget.dataModelOptions.query);
      $scope.widget.dataModelOptions.columns = $scope.data.columns;
      $scope.widget.dataModelOptions.computes = $scope.data.computes;

      $scope.options.saveDashboard();
    };

    $scope.execute = function() {
      var columns = $scope.widget.dataModelOptions.columns;
      // Number of groupby fields.
      var count = columns.length;

      // If there is no column, we will do simple 
      // search, otherwise we will do aggregate computations.
      $scope.model.loadingResults = true;
      if (count)
        $scope.executeComplexQuery(count);
      else
        $scope.executeSimpleQuery(1);
    };

    $scope.executeComplexQuery = function(count) {
      var queries = $scope.widget.dataModelOptions.query.query.queries;
      if (queries.length === 1) {
        // The first element has only one key.
        var firstElement = queries[0];
        var key = Object.keys(firstElement)[0];

        // The group-by will fail if an or-query is empty, so we
        // convert an empty query at the root level.
        if (firstElement[key].queries.length === 0)
          queries = [];
      }

      var query = {
        'queries': queries
      };

      if ($scope.widget.mode === 'View' && $scope.executor.qtext) {
        query.qtext = $scope.executor.qtext;
      } else {
        query.qtext = '';
      }

      var params = {};
      var queryConfig = angular.copy($scope.model.queryConfig);

      if ($scope.model.config) {
        params['rs:database'] = $scope.model.config['current-database'];
      }

      if ($scope.model.includeFrequency) {
        queryConfig.computes.push({fn: 'frequency'});
      }

      queryConfig.query.query = query;

      queryConfig.columns = $scope.widget.dataModelOptions.columns;
      queryConfig.computes = $scope.widget.dataModelOptions.computes;

      $scope.model.loadingResults = true;
      $scope.clearResults();

      $scope.deferredAbort = $q.defer();
      $http({
        method: 'POST',
        url: '/v1/resources/group-by',
        params: params,
        data: queryConfig,
        timeout: $scope.deferredAbort.promise
      }).then(function(response) {
        $scope.model.results = response.data;
        $scope.model.queryError = null;
        $scope.model.loadingResults = false;

        $scope.createComplexTable($scope.model.results.headers, $scope.model.results.results);
        $scope.createHighcharts(count, $scope.model.results.headers, $scope.model.results.results);

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

    $scope.executeSimpleQuery = function(start) {
      $scope.model.loadingResults = false;
    };

    $scope.createHighcharts = function(count, headers, results) {
      var chartType = $scope.widget.dataModelOptions.chart;

      if (results[0].length === count) {
        $scope.shouldShowChart = false;
        $scope.isGridCollapsed = false;
      } else {
        $scope.shouldShowChart = true;
        $scope.isGridCollapsed = true;
      }

      if (chartType === 'column')
        $scope.createColumnHighcharts(count, headers, results);
      else
        $scope.createPieHighcharts(count, headers, results);
    };

    // Create a column chart
    $scope.createColumnHighcharts = function(count, headers, results) {
      var categories = [];
      var series = [];

      // count is number of groupby fields.
      // Skip all groupby fields.
      for (var i = count; i < headers.length; i++) {
        series.push({
          name: headers[i],
          data: []
        });
      }

      results.forEach(function(row) {
        var groups = [];
        for (var i = 0; i < count; i++) {
          groups.push(row[i]);
        }
        categories.push(groups.join(','));

        for (i = count; i < row.length; i++) {
          series[i-count].data.push(row[i]);
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
    $scope.createPieHighcharts = function(count, headers, results) {
      var colors = Highcharts.getOptions().colors;
      var measures = [];
      var series = [];

      // count is number of groupby fields.
      // Skip all groupby fields.
      for (var i = count; i < headers.length; i++) {
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
        for (var i = 0; i < count; i++) {
          groups.push(row[i]);
        }
        var category = groups.join(',');

        for (i = count; i < row.length; i++) {
          series[i-count].data.push({
            name: category,
            color: colors[i-count],
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
    $scope.report.privacy = 'public';

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

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

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.updateReport = function() {
      ReportService.updateReport($scope.report).then(function(response) {
        $location.search('ml-analytics-mode', 'home');
      });
    };

  }]);
}());

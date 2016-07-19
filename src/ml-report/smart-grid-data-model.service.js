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

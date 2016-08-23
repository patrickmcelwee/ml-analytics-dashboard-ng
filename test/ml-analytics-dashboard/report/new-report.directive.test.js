describe('ml-analytics-new-report directive', function () {
  var $compile,
      $rootScope;

  // Mock out the controller, which results in a completely isolated
  // directive test - no integration with controller tested, except
  // controller name
  beforeEach(function () {
    module('ml.analyticsDashboard', function($controllerProvider) {
      $controllerProvider.register('NewReportCtrl', function() {});
    });
  });

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('replaces <ml-analytics-new-report> with the new-report form', function() {
    var element = $compile('<ml-analytics-new-report></ml-analytics-new-report>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('Create New Report');
  });
});

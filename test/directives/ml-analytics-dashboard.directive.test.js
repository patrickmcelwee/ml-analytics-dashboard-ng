describe('ml-analytics-dashboard directive', function () {
  var $compile,
      $rootScope;

  // Mock out the controller, which results in a completely isolated
  // directive test - no integration with controller tested, except
  // controller name
  beforeEach(function () {
    module('ml.analyticsDashboard', function($controllerProvider) {
      $controllerProvider.register('SidebarCtrl', function() {});
    });
  });

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('replaces <ml-analytics-dashboard> with the dashboard', function() {
    var element = $compile('<ml-analytics-dashboard></ml-analytics-dashboard>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('id="ml-analytics-dashboard"');
  });
});

describe('ml-analytics-dashboard-home directive', function () {
  var $compile,
      $rootScope;

  beforeEach(function () {
    module('ml.analyticsDashboard', function($controllerProvider) {
    });
  });

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('replaces <ml-analytics-dashboard-home> with the home screen', function() {
    var element = $compile('<ml-analytics-dashboard-home></ml-analytics-dashboard-home>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('Welcome');
  });
});

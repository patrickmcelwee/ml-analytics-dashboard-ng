describe('ml-analytics-dashboard-home directive', function () {
  var $compile, $rootScope, scope;

  beforeEach(function () {
    module('ml.analyticsDashboard', function($controllerProvider) {
    });
  });

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    scope = _$rootScope_.$new();
  }));

  xit('replaces <ml-analytics-dashboard-home> with the home screen', function() {
    scope.mode = 'home'; // should I test here that controller sets this by default?
    var element = $compile('<ml-analytics-dashboard-home></ml-analytics-dashboard-home>')(scope);
    scope.$digest();
    expect(element.html()).toContain('Welcome');
  });

  xit('removes <ml-analytics-dashboard-home> when mode != home', function() {
    scope.mode = 'not-home'; // should I test here that controller sets this by default?
    var element = $compile('<ml-analytics-dashboard-home></ml-analytics-dashboard-home>')(scope);
    scope.$digest();
    expect(element.html()).not.toContain('Welcome');
  });
});

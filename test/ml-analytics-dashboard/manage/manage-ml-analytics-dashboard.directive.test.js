describe('manage-ml-analytics-dashboard directive', function () {
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

  it('replaces <manage-ml-analytics-dashboard> with the manager when mode is home', function() {
    var scope = $rootScope.$new();
    scope.mode = 'home';
    var element = $compile('<manage-ml-analytics-dashboard></manage-ml-analytics-dashboard>')(scope);
    scope.$digest();
    expect(element.html()).toContain('Manage Reports');
  });
});

describe('ml-analytics-design directive', function () {
  var $compile, $rootScope, $controller, reportService;

  // Mock out the controller, which results in a completely isolated
  // directive test - no integration with controller tested, except
  // controller name
  beforeEach(function () {
    module('ml.analyticsDashboard', function($provide) {
      // reportService = {};
      // $provide.value('ReportService', reportService);
    });
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _ReportService_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    reportService = _ReportService_;
  }));

  it('replaces <ml-analytics-new-report> with the new-report form', function() {
    var mockPromise = $q.defer();
    mockPromise.resolve({data: ''});
    spyOn(reportService, 'getReport').and.returnValue(mockPromise.promise);
    var element = $compile('<ml-analytics-design></ml-analytics-design>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('id="ml-analytics-designer"');
  });
});

describe('Protractor Demo App', function() {
  var env = require('./environment.js');
  var rand = Math.floor(Math.random() * 1000);
  var reportName = 'automated-test-' + rand;

  var chartWidgets = element.all(by.repeater('widget in widgets'));

  function expectSelection(element, value) {
    expect(element.$('option:checked').getText()).toEqual(value);
  }

  beforeAll(function() {
    browser.get(env.baseUrl + '/ml-analytics-dashboard');
    element(by.partialButtonText('New Report')).click();
    element(by.model('report.name')).sendKeys(reportName);
    element(by.model('report.classification')).sendKeys('automated-test');
    element(by.partialButtonText('Submit')).click();
  });

  afterAll(function() {
    browser.get(env.baseUrl + '/ml-analytics-dashboard');
    var trash = element(by.cssContainingText('span', reportName))
      .element(by.xpath('..'))
      .element(by.css('[ng-click="deleteReport(report); $event.stopPropagation();"]'))
      .click();
    browser.switchTo().alert().accept();
  });

  it('should create a blank report', function() {
    expect( element(by.css('.view-title')).getText() ).toContain(reportName);
  });

  it('should create a new chart with no results', function() {
    expect(chartWidgets.count()).toEqual(0);
    element(by.buttonText('Add Chart')).click();
    expect(chartWidgets.count()).toEqual(1);

    expect(element(by.css('.ml-analytics-results')).isPresent()).toBe(false);
  });

  it('defaults to current database and collection strategy', function() {
    expectSelection(
      element(by.model('data.targetDatabase')),
      'developing-analytics-dashboard-content'
    );
    expectSelection(element(by.model('data.groupingStrategy')), 'collection');
  });

  it('forces data source to be selected', function() {
    var directoryInput = element(by.model('data.directory'));
    var dimensionBuilder = element(by.css('.dimension-builder'));
    expect( directoryInput.getAttribute('class') ).toContain('ng-invalid');
    expect( dimensionBuilder.isPresent() ).toBe(false);

    directoryInput.sendKeys('data');
    expectSelection(directoryInput, 'data');
    expect( directoryInput.getAttribute('class') ).not.toContain('ng-invalid');
    expect( dimensionBuilder.isPresent() ).toBe(true);
  });

});

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

  afterAll(function(){
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

  it('should create a new chart', function() {
    expect(chartWidgets.count()).toEqual(0);
    element(by.buttonText('Add Chart')).click();
    expect(chartWidgets.count()).toEqual(1);
  });

  it('forces data source to be selected', function() {
    element(by.linkText('Design')).click();
    expectSelection(
      element(by.model('data.targetDatabase')),
      'developing-analytics-dashboard-content'
    );
    expectSelection(element(by.model('data.groupingStrategy')), 'collection');
    expect(
      element(by.model('data.directory')).getAttribute('class')
    ).toContain('ng-invalid');
  });

});

describe('Protractor Demo App', function() {
  var env = require('./environment.js');
  var rand = Math.floor(Math.random() * 1000);
  var reportName = 'automated-test-' + rand;

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

  it('should create a new report', function() {
    expect( element(by.css('.view-title')).getText() ).toContain(reportName);
  });

});

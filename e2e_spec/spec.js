describe('Protractor Demo App', function() {
  var env = require('./environment.js');
  var rand = Math.floor(Math.random() * 1000);
  var reportName = 'automated-test-' + rand;

  var chartWidgets = element.all(by.repeater('widget in widgets'));
  var rows = element.all(by.css('.ml-analytics-row'));
  var columns = element.all(by.css('.ml-analytics-column'));
  var xAxisLabels = element.all(by.css('.highcharts-xaxis-labels text'))

  var groupingStrategySelector = element(by.model('data.groupingStrategy'));
  var directorySelector = element(by.model('data.directory'));

  // expectations
  function expectSelection(element, value) {
    expect(element.$('option:checked').getText()).toEqual(value);
  }

  function stripAll(textPromise) {
    return textPromise.then(function(text) {
      return text.replace(/\s+/g, '');
    });
  }

  function expectGeneratedQuery() {
    // we return an expectation, but also do clean-up work,
    // hiding the opened generatedQuery
    element(by.linkText('Show Generated Group-by Query')).click();
    var generatedQuery = element(by.binding('renderGroupByConfig()')).getText();
    element(by.linkText('Hide Generated Group-by Query')).click();
    return expect(stripAll(generatedQuery));
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
    expectSelection(groupingStrategySelector, 'collection');
  });

  it('forces data source to be selected', function() {
    var dimensionBuilder = element(by.css('.dimension-builder'));
    expect( directorySelector.getAttribute('class') ).toContain('ng-invalid');
    expect( dimensionBuilder.isPresent() ).toBe(false);

    directorySelector.sendKeys('data');
    expectSelection(directorySelector, 'data');
    expect( directorySelector.getAttribute('class') ).not.toContain('ng-invalid');
    expect( dimensionBuilder.isPresent() ).toBe(true);
  });

  it('allows selection of compute row and creates chart', function() {
    expect(element(by.css('.highcharts-container')).isPresent()).toBe(false);
    var firstMeasure = element.all(by.css('.ml-analytics-measure')).first();
    firstMeasure.element(by.css('a')).click();
    firstMeasure.element(by.linkText('Add count')).click();
    expect(rows.count()).toBe(1);
    element(by.buttonText('Save and Run')).click();
    expect(element(by.css('.highcharts-container')).isPresent()).toBe(true);
  });

  it('allows selection of group-by column and adds to xaxis', function() {
    var eyeColorDimension = element(by.css('.ml-analytics-dimensions'))
      .element(by.partialLinkText('eyeColor'));
    eyeColorDimension.click();
    eyeColorDimension
      .element(by.xpath('..'))
      .element(by.partialLinkText('Add Group By'))
      .click();
    expect(columns.count()).toBe(1);
    element(by.buttonText('Save and Run')).click();
    expect(xAxisLabels.count()).toEqual(7);
    expect(xAxisLabels.getText()).toContain('amethyst');
  });

  it('includes query for collection-scoped data source', function() {
    expectGeneratedQuery().toContain('collection-query');
  });

  it('allows creation of a query filter', function() {
    element(by.linkText('Add Rule')).click();
    element(by.model('rule.field')).sendKeys('eyeColor');
    element(by.model('rule.subType')).sendKeys('Equals');
    element(by.model('rule.value')).sendKeys('amethyst');

    element(by.buttonText('Save and Run')).click();

    expectGeneratedQuery().toContain('"value-query":{"text":"amethyst","element":{"name":"eyeColor","ns":""}}');
    expect(xAxisLabels.count()).toEqual(1);
    expect(xAxisLabels.getText()).toContain('amethyst');
    expect(xAxisLabels.getText()).not.toContain('blue');
  });

  xit('can refresh the page and recover a saved query', function() {
  });

  it('resets when the data-source-strategy is changed', function() {
    groupingStrategySelector.sendKeys('root');
    expect(columns.count()).toBe(0);
    expect(rows.count()).toBe(0);
    expect( directorySelector.getAttribute('class') ).toContain('ng-invalid');

    directorySelector.sendKeys('patient-summary');

    expect( directorySelector.getAttribute('class') ).not.toContain('ng-invalid');
    expectGeneratedQuery().not.toContain('collection-query');
  });

  xit('includes root-name query for root-scoped data source', function() {
    showQueryButton.click();
    // This is potentially quite difficult, because we
    //   are attempting to turn a structured query into a cts:query in the
    //   group-by library. I'm not sure you can just pass options through the
    //   workaround we are currently using there. It needs testing });
    //   In particular: look at grpj:cts-query-parser
  });

});

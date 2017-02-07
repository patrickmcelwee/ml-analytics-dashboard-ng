describe('Protractor Demo App', function() {
  var env = require('./environment.js');
  var rand = Math.floor(Math.random() * 1000);
  var reportName = 'automated-test-' + rand;

  var chartWidgets = element.all(by.repeater('widget in widgets'));
  var rows = element.all(by.css('.ml-analytics-row'));
  var columns = element.all(by.css('.ml-analytics-column'));
  var xAxisLabels = element.all(by.css('.highcharts-xaxis-labels text'));

  var groupingStrategySelector = element(by.model('source.groupingStrategy'));
  var directorySelector = element(by.model('source.directory'));
  var chartContainer = element(by.css('.highcharts-container'));

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

  it('defaults to current database and collection strategy', function() {
    expectSelection(
      element(by.model('source.targetDatabase')),
      'developing-analytics-dashboard-content'
    );
    expectSelection(groupingStrategySelector, 'collection');
  });

  it('forces data source to be selected', function() {
    expect( directorySelector.getAttribute('class') ).toContain('ng-invalid');
    directorySelector.sendKeys('data');
    expectSelection(directorySelector, 'data');
    expect( directorySelector.getAttribute('class') ).not.toContain('ng-invalid');
  });

  it('should create a new chart with no results', function() {
    expect(chartWidgets.count()).toEqual(0);
    element(by.buttonText('Add Chart')).click();
    expect(chartWidgets.count()).toEqual(1);

    expect(element(by.css('.ml-analytics-results')).isPresent()).toBe(false);
    var dimensionBuilder = element(by.css('.dimension-builder'));
    expect( dimensionBuilder.isPresent() ).toBe(true);
    expectGeneratedQuery().toContain('collection-query');
  });

  it('allows selection of compute row and creates chart', function() {
    expect(chartContainer.isPresent()).toBe(false);
    var firstMeasure = element.all(by.css('.ml-analytics-measure')).first();
    firstMeasure.element(by.css('a')).click();
    firstMeasure.element(by.linkText('Add count')).click();
    expect(rows.count()).toBe(1);
    expect(chartContainer.isPresent()).toBe(true);
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
    expect(xAxisLabels.count()).toEqual(7);
    expect(xAxisLabels.getText()).toContain('amethyst');
  });

  it('allows user to change to a pie chart and back', function() {
    function chooseChartType(chartType) {
      var typesSelection = element(by.css('.ml-analytics-chart-types'));
      typesSelection.isPresent().then(function(typesAreDisplayed) {
        if (!typesAreDisplayed) {
          element(by.buttonText('Choose Chart Type')).click();
        }
        typesSelection.
          element(by.css('.ml-analytics-' + chartType + '-chart-type')).
          click();
      });
    }

    chooseChartType('pie');
    expect(xAxisLabels.count()).toEqual(0);
    expect(chartContainer.isPresent()).toBe(true);

    chooseChartType('bar');
    expect(xAxisLabels.count()).toBeGreaterThan(0);
  });

  it('allows creation of a query filter', function() {
    element(by.linkText('Add Rule')).click();
    element(by.model('rule.field')).sendKeys('eyeColor');
    element(by.model('rule.subType')).sendKeys('Equals');
    element(by.model('rule.value')).sendKeys('blue');
    expectGeneratedQuery().toContain('"value-query":{"text":"blue","element":{"name":"eyeColor","ns":""}}');

    expect(xAxisLabels.count()).toEqual(1);
    expect(xAxisLabels.getText()).toContain('blue');
    expect(xAxisLabels.getText()).not.toContain('amethyst');
  });

  it('can open a saved report', function() {
    element(by.buttonText('Save')).click();

    browser.get(env.baseUrl + '/ml-analytics-dashboard');
    element(by.cssContainingText('.report-item', reportName)).click();
    expect(columns.count()).toBe(1);
    expect(rows.count()).toBe(1);
  });

  xit('can revert to the saved state', function() {
  });

  it('allows removal of compute and shows grid for groupBy-only', function() {
    rows.first().element(by.css('.remove-row')).click();

    expect(rows.count()).toBe(0);

    expect(chartContainer.isPresent()).toBe(false);
    expect(element(by.css('ml-results-grid')).isDisplayed()).toBe(true);

    // Readd row and ensure that grid collapses down again
    var firstMeasure = element.all(by.css('.ml-analytics-measure')).first();
    firstMeasure.element(by.css('a')).click();
    firstMeasure.element(by.linkText('Add count')).click();

    expect(chartContainer.isPresent()).toBe(true);
    expect(element(by.css('ml-results-grid')).isDisplayed()).toBe(false);
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

});

var env = require('./environment.js');

exports.config = {
  framework: 'jasmine',
  seleniumAddress: env.seleniumAddress,
  specs: ['spec.js'],
  onPrepare: function() {
    var disableNgAnimate = function() {
      angular.module('disableNgAnimate', []).
        run(['$animate', function($animate) {
          $animate.enabled(false);
          Highcharts.setOptions({ plotOptions: {
              series: {
                  animation: false
              }
            }
          });
        }]);
    };
    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    browser.get(env.baseUrl + '/login');
    browser.driver.manage().window().maximize();
    element(by.model('ctrl.username')).sendKeys(env.user);
    element(by.model('ctrl.password')).sendKeys(env.password);
    element(by.buttonText('Sign in')).click();
    return browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return url === 'http://localhost:3000/';
      });
    }, 10000);
  }
};

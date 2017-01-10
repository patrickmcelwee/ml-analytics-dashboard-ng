var env = require('./environment.js');

exports.config = {
  framework: 'jasmine',
  seleniumAddress: env.seleniumAddress,
  specs: ['spec.js'],
  onPrepare: function() {
    browser.get(env.baseUrl + '/login');
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

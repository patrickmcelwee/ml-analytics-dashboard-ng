module.exports = {
  seleniumAddress: (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),
  baseUrl: 'http://localhost:3000',
  user: 'admin',
  password: 'admin'
};

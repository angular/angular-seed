basePath = '../';

frameworks = ["ng-scenario"];

files = [
  'test/e2e/**/*.js'
];

autoWatch = false;

browsers = ['Chrome'];

singleRun = true;

proxies = {
  '/': 'http://localhost:8000/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};

urlRoot = '/__testacular/';

plugins = [
    'karma-ng-scenario',
    'karma-chrome-launcher'
];

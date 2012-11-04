basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/angular/angular.js',
  'test/lib/angular/angular-mocks.js',
  'test/unit/mocks/modules.js',
  'app/js/app.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};

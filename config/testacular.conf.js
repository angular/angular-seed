basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = false;

browsers = ['Chrome'];


preprocessors = {
    '**/js/Column.js': 'coverage',
    '**/js/Table.js': 'coverage',
    '**/js/Utilities.js': 'coverage'
};

reporters = ['junit','progress','coverage'];


junitReporter = {
    outputFile: 'test_out/unit.xml',
    suite: 'unit'
};

coverageReporter = {
    type : 'html',
    dir : 'test_out/'
};




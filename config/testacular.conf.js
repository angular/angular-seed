basePath = '../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    'smart-table-module/lib/angular/angular.js',
    'test/lib/angular/angular-mocks.js',
    'smart-table-module/js/*.js',
    'test/unit/*.js'
];

autoWatch = false;

browsers = ['Chrome'];


preprocessors = {
    'smart-table-module/js/Column.js': 'coverage',
    'smart-table-module/js/Table.js': 'coverage',
    'smart-table-module/js/Utilities.js': 'coverage',
    'smart-table-module/js/Filters.js': 'coverage',
    'smart-table-module/js/Directives.js': 'coverage'
};

reporters = ['junit', 'progress', 'coverage'];


junitReporter = {
    outputFile: 'test_out/unit.xml',
    suite: 'unit'
};

coverageReporter = {
    type: 'html',
    dir: 'test_out/'
};




var gulp = require('gulp')
  , mainBowerFiles = require('main-bower-files')
  , inject = require('gulp-inject')
  , source = require('vinyl-source-stream')
  , debug = require('gulp-debug')
  , series = require('stream-series')
  , karma = require('karma')
  , protractor = require('gulp-angular-protractor')
  , less = require('gulp-less')
  , path = require('path')
  , jsonfile = require('jsonfile')
  , jshint = require('gulp-jshint')
  ;

var production = process.env.NODE_ENV === 'production';
var package = jsonfile.readFileSync('./package.json');
var bowerrc = jsonfile.readFileSync('./.bowerrc');

console.log(package.name);
console.log(bowerrc);

gulp.task("protractor", function () {

  gulp.src(['./app/tests/*.js'])
    .pipe(protractor({
      'configFile': 'test/protractor.conf.js',
      'autoStartStopServer': true,
      'debug': true
    }))
    .on('error', function (e) {
      throw e;
    })
});

gulp.task('karma', function (done) {
  karma.server.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, function (code) {
    process.exit(code);
  });
});

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({paths: [path.join(__dirname, 'less', 'includes')]}))
    .pipe(gulp.dest('./app/css'));
});

function extracted2() {
  var lessRegEx = /^.+(?:(?!mock).)*$/;
  var asdf = mainBowerFiles({
    filter: function (e) {
      return e.indexOf('mock') === -1;
    }
    , debugging: true
    , overrides: {}
  });

  return asdf;
}


gulp.task("inject", function () {
  var asdf = extracted2();
  var bowerFiles = gulp.src(asdf, {read: false});

  var appFilesGlobs = ['./app/js/**/*.js'
    , './app/features/**/*.js'
    , './app/css/*.css'
    , '!**/*_test.js'
  ];

  var appFiles = gulp.src(appFilesGlobs, {read: false});

  return gulp.src('./app/index.html')
    .pipe(inject(series(bowerFiles, appFiles), {relative: true}))
    .pipe(gulp.dest('./app'));
});


gulp.task('assemble',
  //['less', 'inject'],
  function () {
    gulp.src(['./app/index.html'
      , './app/images/**'
      , './app/css/**'
      , './app/js/**'
      , './app/partials/**'
      , './app/features/**/*.js'
      , '!./app/features/**/*_test.js'
      , './app/features/**/*.html'
    ], {base: './app'})
      .pipe(gulp.dest('./dist'));

    gulp.src(extracted2(), {base: './app'})
      .pipe(gulp.dest('./dist'));
  });


gulp.task('lint', function () {
  gulp.src(['./app/js/**/*.js', './app/features/**/*.js'])
    .pipe(debug())
    .pipe(jshint())
    // You can look into pretty reporters as well, but that's another story
    .pipe(jshint.reporter('default'))
    //.pipe(jshint.reporter('fail'))
  ;
});

gulp.task('default', [
    'assemble'
  ]
);

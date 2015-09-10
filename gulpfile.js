var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var CombinedStream = require('combined-stream');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var rev_rep = require('gulp-rev-replace');
var watch = require('gulp-watch');
var lib_files = require('bower-files')({
  overrides: {
    bootstrap: {
      main: './dist/css/bootstrap.min.css'
    }
  }
});

var paths = {
  our_scripts: ['app/**/*.js', '!app/bower_components/**/*', '!app/tests/**/*.js', '!app/**/*test.js', '!e2e-tests/**/*.js'],
  our_css: ['app/css/*.css'],
  our_html: ['app/**/*', '!app/bower_components/**/*', '!app/**/*.js', '!app/**/*.css'],
  lib_extra: [],
  lib_exclude: ['!**/bootstrap.js']
}
var build_path = "dist";
var minify = false;

gulp.task('javascript', function() {
  var lib_js = gulp.src(lib_files.ext('js').match(paths.lib_exclude).files);
  var ours_js = gulp.src(paths.our_scripts);
  var lib_extra_js = gulp.src(paths.lib_extra);

  var js = CombinedStream.create()
  .append(lib_js)
  .append(lib_extra_js)
  .append(ours_js)
  .pipe(concat("myapp.js"));

  if (minify) {
      js = js.pipe(uglify().on('error', console.log))
  }

  js = js.pipe(rev())
  .pipe(gulp.dest(build_path + '/js'))
  .pipe(rev.manifest({merge: true, path: 'manifest.json'}))
  .pipe(gulp.dest('./'));

  return js;
});

gulp.task('css', function(){
  var lib_css = gulp.src(lib_files.ext('css').files);
  var ours_css = gulp.src(paths.our_css);

  var css = CombinedStream.create()
    .append(lib_css)
    .append(ours_css)
    .pipe(concat("myapp.css"));

  if (minify) {
    css = css.pipe(minifyCss());
  }

  css = css.pipe(rev())
    .pipe(gulp.dest(build_path + '/css'))
    .pipe(rev.manifest({merge: true, path: 'manifest.json'}))
    .pipe(gulp.dest('./'));

  return css;
});

gulp.task('assets', function() {
  var tff = gulp.src(lib_files.ext('ttf').files);

  var woff = gulp.src(lib_files.ext('woff').files);

  return CombinedStream.create()
    .append(tff)
    .append(woff)
    .pipe(gulp.dest(build_path + '/fonts'));
});

gulp.task('html', ['javascript', 'css'], function() {
  return gulp.src(paths.our_html)
    .pipe(rev_rep({
      manifest: gulp.src('manifest.json')
    }))
    .pipe(gulp.dest(build_path));
});

gulp.task('default', ['javascript', 'css', 'assets', 'html']);

gulp.task('debug', function(){
  minify = false;
  gulp.start('default');
  watch(paths.our_scripts, function(){gulp.start('html')});
  watch(paths.our_css, function(){gulp.start('html')});
  watch(paths.our_html, function(){gulp.start('html')});
});

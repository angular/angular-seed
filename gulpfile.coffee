app     = 'app/'
e2e     = 'e2e-tests/'
karma   = 'karma/'
coffees = '**/*.coffee'
gulp    = require 'gulp'
coffee  = require 'gulp-coffee'

require 'colors'
log = (error) ->
  console.log [
    "BUILD FAILED: #{error.name ? ''}".red.underline
    '\u0007' # beep
    "#{error.code ? ''}"
    "#{error.message ? error}"
    "in #{error.filename ? ''}"
    "gulp plugin: #{error.plugin ? ''}"
  ].join '\n'
  this.end()

compile = (srcDir) ->
  gulp.src(srcDir + coffees)
    .pipe(coffee bare: true)
    .on('error', log)
    .pipe gulp.dest srcDir

gulp.task 'coffee-app', ->
  compile app

gulp.task 'coffee-e2e', ->
  compile e2e

gulp.task 'coffee-karma', ->
  compile karma

gulp.task 'coffee', ['coffee-app', 'coffee-e2e', 'coffee-karma']

gulp.task 'watch', ['coffee'], ->
  gulp.watch coffees, ['coffee']

gulp.task 'default', ['watch']

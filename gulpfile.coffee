gulp    = require 'gulp'
plumber = require 'gulp-plumber'
coffee  = require 'gulp-coffee'

app     = 'app/'
e2e     = 'e2e-tests/'
karma   = 'karma/'
coffees = '**/*.coffee'

compile = (srcDir) ->
  gulp.src srcDir + coffees
    .pipe plumber()
    .pipe coffee bare: true
      .on 'error', -> console?.log error
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
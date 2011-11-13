#!/usr/bin/env watchr

# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: ./scripts/watchr.rb
# note: make sure that you have jstd server running (server.sh) and a browser
# captured. this script must be run from the application root directory.

log_file = File.expand_path(File.dirname(__FILE__) + '/../logs/jstd.log')

`touch #{log_file}`

puts "String watchr... log file: #{log_file}"

watch( '(app/js|test/unit)' )  do
  `echo "\n\ntest run started @ \`date\`" >> #{log_file}`
  testResults = `scripts/test.sh`
  `echo "#{testResults}" >> #{log_file}`

  if !(`which notify-send` == "") and testResults.index("Tests failed.")
    `notify-send --urgency critical --icon dialog-warning "Test Failure!" "#{testResults}"`
    abort(testResults)
  end
end


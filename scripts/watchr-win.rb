#!/usr/bin/env watchr

# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr 
# run: watchr scripts/watchr-win.rb (important to run this one folder up form scripts or watch can't figure path)
# note: make sure that you have jstd server running (test-server.bat) and a browser captured

log_file_path = File.expand_path(File.dirname(__FILE__) + '/../logs/jstd.log')
watch( '(app/js|test/unit).*\.js' ) { 
	open(log_file_path, 'a') { |log_file|
		log_file.puts "\n\nTest run started @ #{Time.new.localtime}"
		log_file.puts `scripts/test.bat`
	}
}
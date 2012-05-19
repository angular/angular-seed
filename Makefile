# The system generated date in YYYY-MM-DD format
DATE = $(shell date "+%Y-%m-%d")

# The command to replace the @DATE in the files with the actual date
SED_DATE = sed "s/@DATE/${DATE}/"

# The version according to the source file
VER = $(shell cat version.txt)

# The command to replace the @VERSION in the files with the actual version
SED_VER = sed "s/@VERSION/${VER}/"

# The name of the App to create
APP_NAME = "myApp"

# The command to replace the @APP_NAME in the files with the actual App Name
SED_APP_NAME = sed "s/@APP_NAME/${APP_NAME}/"

# The output folder for the finished files
OUTPUT = build/output
OUTPUT_CSS = ${APP_NAME}/css
OUTPUT_JS = ${APP_NAME}/js

# The filenames
LIBJS = ${OUTPUT_JS}/lib.min.js
JS = ${OUTPUT_JS}/${APP_NAME}.min.js
LIBCSS = ${OUTPUT_CSS}/lib.min.css
CSS = ${OUTPUT_CSS}/${APP_NAME}.min.css

# The files to include when compiling the Library JS files
LIBJSFILES =        app/lib/angular/angular.min.js

# The files to include when compiling the JS files
JSFILES =           app/js/app.js \
                    app/js/controllers.js \
                    app/js/directives.js \
                    app/js/filters.js \
                    app/js/services.js

# The files to include when compiling the Library CSS files
LIBCSSFILES =       app/css/bootstrap.min.css

# The files to include when compiling the CSS files
CSSFILES =          app/css/app.css

# By default, this is what get executed when make is called without any arguments.
all: init libjs js libcss css html notify

# Create the output directory. This is in a separate step so its not dependent on other targets
init:
	# Building App in "${OUTPUT}" folder
	@@rm -rf ${OUTPUT}
	@@mkdir -p ${OUTPUT}/${APP_NAME}
	@@cp -R app/* ${OUTPUT}/${APP_NAME}
	@@rm -rf ${OUTPUT}/${OUTPUT_JS}
	@@mkdir ${OUTPUT}/${OUTPUT_JS}
	@@rm -rf ${OUTPUT}/${OUTPUT_CSS}
	@@mkdir ${OUTPUT}/${OUTPUT_CSS}
	@@rm -rf ${OUTPUT}/${APP_NAME}/lib
	@@rm ${OUTPUT}/${APP_NAME}/index.html ${OUTPUT}/${APP_NAME}/index-async.html

# Build the minified Library JS file
libjs: init
	# Build Library JavaScript file
	@@cat ${LIBJSFILES} > ${OUTPUT}/${LIBJS}

# Build the minified App JS file
js: init
	# Build App JavaScript file
	@@cat ${JSFILES} > ${OUTPUT}/${JS}.tmp

	@@cat build/app.prefix | ${SED_DATE} | ${SED_APP_NAME} | ${SED_VER} > ${OUTPUT}/${JS}
	@@java -jar build/closure-compiler/compiler.jar \
          --compilation_level SIMPLE_OPTIMIZATIONS \
          --language_in ECMASCRIPT5_STRICT \
          --js ${OUTPUT}/${JS}.tmp \
          --js_output_file ${OUTPUT}/${JS}.tmp2
	@@cat ${OUTPUT}/${JS}.tmp2 >> ${OUTPUT}/${JS}
	
	@@rm -f ${OUTPUT}/${JS}.tmp
	@@rm -f ${OUTPUT}/${JS}.tmp2

# Build the minified Library CSS file
libcss: init
	# Build Library CSS file
	@@cat ${LIBCSSFILES} > ${OUTPUT}/${LIBCSS}

# Build the minified App CSS file
css: init
	# Build App CSS file
	@@cat ${CSSFILES} > ${OUTPUT}/${CSS}.tmp

	@@cat build/app.prefix | ${SED_DATE} | ${SED_APP_NAME} | ${SED_VER} > ${OUTPUT}/${CSS}
	@@java -jar build/yui-compressor/yui-compressor.jar \
	      --type css \
	      ${OUTPUT}/${CSS}.tmp >> ${OUTPUT}/${CSS}

	@@rm -f ${OUTPUT}/${CSS}.tmp

# Copy html files
html: init
	# Build HTML files
	@@cat ${OUTPUT}/${APP_NAME}/index-production.html | ${SED_APP_NAME} > ${OUTPUT}/${APP_NAME}/index.html
	@@rm ${OUTPUT}/${APP_NAME}/index-production.html
	@@cat ${OUTPUT}/${APP_NAME}/index-async-production.html | ${SED_APP_NAME} > ${OUTPUT}/${APP_NAME}/index-async.html
	@@rm ${OUTPUT}/${APP_NAME}/index-async-production.html

# Let the user know the files were built and where they are
notify:
	@@echo "The files have been built and are in " $$(pwd)/${OUTPUT}

# Zip the App into one convenient zip package
zip: all
	@@zip -rq ${OUTPUT}/${APP_NAME}-${VER}.zip ${OUTPUT}/${APP_NAME}/
	@@echo "Zip file created in " $$(pwd)/${OUTPUT}/${APP_NAME}-${VER}.zip

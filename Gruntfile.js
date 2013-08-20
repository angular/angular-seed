module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'app/js/*.js', 'test/e2e/*.js', 'test/unit/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    "jquery": true,
                    "describe": false,
                    "beforeEach": false,
                    "module": false,
                    "it": false,
                    "inject": false,
                    "expect": false,
                    "browser": false,
                    "element": false,
                    "angular": false
                }
            }
        },
        karma: {
            options: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: 'dots'
            },
            e2e: {
                configFile: 'config/karma-e2e.conf.js'
            },
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        watch: {
            files: ['gruntfile.js', 'app/js/*.js', 'test/**/*.js'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('test', ['jshint', 'karma:unit', 'connect', 'karma:e2e']);
    grunt.registerTask('default', ['jshint', 'karma:unit', 'connect', 'karma:e2e']);

};
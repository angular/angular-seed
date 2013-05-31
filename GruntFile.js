module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: {
            js: ['smart-table-module/js/*.js'],
            html: ['smart-table-module/partials/*.html']
        },
        concat: {
            options: {
            },
            dist: {
                src: ['<%= src.js %>'],
                dest: './<%= pkg.name %>.debug.js'
            }
        },
        html2js: {
            options: {
                base: 'smart-table-module',
                module: 'smartTable.templates'
            },
            smartTable: {
                src: [ '<%= src.html %>' ],
                dest: 'smart-table-module/js/Template.js'
            }
        },
        clean: {
            test: ['test_out']
        },
        copy: {
            refApp: {
                src: ['<%= pkg.name %>.debug.js'],
                dest: 'example-app/js/'
            }
        },
        uglify: {
            main: {
                src: ['<%= pkg.name %>.debug.js'],
                dest: '<%= pkg.name %>.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.registerTask('refApp', ['html2js:smartTable', 'concat', 'copy:refApp']);
    grunt.registerTask('build', ['html2js:smartTable', 'concat', 'uglify']);
};
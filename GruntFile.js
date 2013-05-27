module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                src: ['./smart-table-module/js/Table.js', './smart-table-module/js/Column.js', './smart-table-module/js/Utilities.js', './smart-table-module/js/filters.js', './smart-table-module/js/directives.js', './smart-table-module/js/ui-bootstrap-custom-tpls-0.4.0-SNAPSHOT.js'],
                dest: './<%= pkg.name %>.debug.js'
            }
        },
        clean: {
            test: ['test_out']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
};
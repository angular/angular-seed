module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                src: ['./app/js/Column.js', './app/js/directives.js', './app/js/filters.js', './app/js/Table.js', './app/js/Utilities.js'],
                dest: './<%= pkg.name %>.js'
            }
        },
        clean: {
            test: ['test_out']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('doc', ['yuidoc']);
};
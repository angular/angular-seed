module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                src: ['./app/js/*.js'],
                dest: './<%= pkg.name %>.js'
            }
        },
        clean: {
            test: ['test_out']
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: './app/js/Table.js',
                    outdir: 'doc'
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.registerTask('doc', ['yuidoc']);
};
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist"],

        copy: {
            main: {
                expand: true,
                cwd: 'app/',
                src: '**',
                dest: 'dist/'
            }
        },

        useminPrepare: {
            html: 'app/index.html'
        },

        usemin: {
            html: ['dist/index.html']
        },

        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/js',
                        src: '*.js',
                        dest: '.tmp/concat/js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
        'copy', 'useminPrepare', 'concat', 'ngmin', 'uglify', 'cssmin', 'usemin'
    ]);
};


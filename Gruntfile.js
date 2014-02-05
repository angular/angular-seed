module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      lib: {
        src: ['app/lib/**/*.js'],
        dest: 'app/dist/lib.js'
      },
      app: {
        src: ['app/js/**/*.js'],
        dest: 'app/dist/app.js'
      }
    },
    ngmin: {
      app: {
        src: ['<%= concat.app.dest %>'],
        dest: 'app/dist/app.ngmin.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      lib: {
        options: {
          sourceMap: 'app/dist/lib.js.map',
          sourceMappingURL: 'dist/lib.js.map',
          sourceMapPrefix: 1
        },
        files: {
          'app/dist/lib.min.js': ['<%= concat.lib.dest %>']
        }
      },
      app: {
        options: {
          sourceMap: 'app/dist/app.js.map',
          sourceMappingURL: 'dist/app.js.map',
          sourceMapPrefix: 1
        },
        files: {
          'app/dist/app.min.js': ['<%= ngmin.app.dest %>']
        }
      }
    }
  });

  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.registerTask('default', ['concat', 'ngmin', 'uglify']);

};

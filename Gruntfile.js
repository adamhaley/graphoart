'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      dev: {
        options: {
          paths: ["css"]
        },
        files: {
          "css/main.css": "css/main.less"
        }
      }
    },
    watch: {
      files: ['css/*.less'],
      tasks: ['less']
    }
  });
  grunt.registerTask('default',['less','watch']);

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
}


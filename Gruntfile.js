module.exports = function(grunt) {
	grunt.initConfig({

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/scripts/scripts.js', 'js/scripts/slider.js', 'js/scripts/carousel.js'],
        dest: 'js/splat.js',
      },
    },

    uglify: {
      my_target: {
        files: {
          'js/splat.min.js': ['js/splat.js']
        }
      }
    },

  	less: {
      development: {
        options: {
          compress: true
        },
        files: {
          "css/common.css": "less/common.less" // destination file and source file
        }
      }
    },

    watch: {
      styles: {
        files: ['less/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }

	})
	
	grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['less', 'watch']);
}
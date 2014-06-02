/* jshint node: true */

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [ 'src/**/*.js' ]
        },
        concat: {
            source: {
                files: [{
                    dest: 'dist/bitset.js',
                    src: [
                        'src/bitset.js'
                    ]
                }]
            }
        },
        umd: {
            all: {
                src: 'dist/bitset.js',
                objectToExport: 'BitSet',
                globalAlias: 'BitSet'
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: [ 'BitSet' ]
                },
                compress: true,
                beautify: false,
                sourceMap: true
            },
            source: {
                files: [{
                    src: [ 'dist/bitset.js' ],
                    dest: 'dist/bitset.min.js'
                }]
            }
        },
        clean: {
            javascript: {
                src: [ 'dist/bitset.js', 'dist/bitset.min.{js,map}' ]
            }
        },
        mochaTest: {
            all: {
                src: [ 'test/**/*.js' ],
                options: {
                    ignoreLeaks: false,
                    ui: 'bdd',
                    reporter: 'dot',
                    require: [
                        'should'
                    ],
                    timeout: 1000
                }
            }
        }
    });

    grunt.registerTask('build', [ 'jshint:all', 'concat:source', 'umd:all', 'uglify:source' ]);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['build']);
};

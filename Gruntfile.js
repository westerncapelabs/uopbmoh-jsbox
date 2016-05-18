module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        paths: {
            src: {
                app: {
                    smsapp: 'src/smsapp.js',
                    ussdapp: 'src/ussdapp.js',
                    fbmessengerapp: 'src/fbmessengerapp.js'
                },
                smsapp: [
                    'src/index.js',
                    'src/utils.js',
                    '<%= paths.src.app.smsapp %>',
                    'src/init.js'
                ],
                ussdapp: [
                    'src/index.js',
                    'src/utils.js',
                    'src/utils_project.js',
                    '<%= paths.src.app.ussdapp %>',
                    'src/init.js'
                ],
                fbmessengerapp: [
                    'src/index.js',
                    'src/utils.js',
                    'src/utils_project.js',
                    '<%= paths.src.app.fbmessengerapp %>',
                    'src/init.js'
                ],
                all: [
                    'src/**/*.js'
                ]
            },
            dest: {
                smsapp: 'go-app-sms.js',
                ussdapp: 'go-app-ussdapp.js',
                fbmessengerapp: 'go-app-fbmessengerapp.js'
            },
            test: {
                smsapp: [
                    'test/setup.js',
                    'src/utils.js',
                    '<%= paths.src.app.smsapp %>',
                    'test/smsapp.test.js'
                ],
                ussdapp: [
                    'test/setup.js',
                    'src/utils.js',
                    'src/utils_project.js',
                    '<%= paths.src.app.ussdapp %>',
                    'test/ussdapp.test.js'
                ],
                fbmessengerapp: [
                    'test/setup.js',
                    'src/utils.js',
                    'src/utils_project.js',
                    '<%= paths.src.app.fbmessengerapp %>',
                    'test/fbmessengerapp.test.js'
                ]
            }
        },

        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: [
                'Gruntfile.js',
                '<%= paths.src.all %>'
            ]
        },

        watch: {
            src: {
                files: [
                    '<%= paths.src.all %>'
                ],
                tasks: ['default'],
                options: {
                    atBegin: true
                }
            }
        },

        concat: {
            options: {
                banner: [
                    '// WARNING: This is a generated file.',
                    '//          If you edit it you will be sad.',
                    '//          Edit src/app.js instead.',
                    '\n' // Newline between banner and content.
                ].join('\n')
            },
            smsapp: {
                src: ['<%= paths.src.smsapp %>'],
                dest: '<%= paths.dest.smsapp %>'
            },
            ussdapp: {
                src: ['<%= paths.src.ussdapp %>'],
                dest: '<%= paths.dest.ussdapp %>'
            },
            fbmessengerapp: {
                src: ['<%= paths.src.fbmessengerapp %>'],
                dest: '<%= paths.dest.fbmessengerapp %>'
            }

        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            test_smsapp: {
                src: ['<%= paths.test.smsapp %>']
            },
            test_ussdapp: {
                src: ['<%= paths.test.ussdapp %>']
            },
            test_fbmessengerapp: {
                src: ['<%= paths.test.fbmessengerapp %>']
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'build',
        'mochaTest'
    ]);

    grunt.registerTask('build', [
        'concat',
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};

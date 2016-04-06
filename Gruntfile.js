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
                    ussd_registration: 'src/ussd_registration.js'
                },
                smsapp: [
                    'src/index.js',
                    'src/utils.js',
                    '<%= paths.src.app.smsapp %>',
                    'src/init.js'
                ],
                ussd_registration: [
                    'src/index.js',
                    'src/utils.js',
                    //'src/utils_project.js',
                    '<%= paths.src.app.ussd_registration %>',
                    'src/init.js'
                ],
                all: [
                    'src/**/*.js'
                ]
            },
            dest: {
                smsapp: 'go-app-sms.js',
                ussd_registration: 'go-app-ussd_registration.js'
            },
            test: {
                smsapp: [
                    'test/setup.js',
                    'src/utils.js',
                    '<%= paths.src.app.smsapp %>',
                    'test/smsapp.test.js'
                ],
                ussd_registration: [
                    'test/setup.js',
                    'src/utils.js',
                    //'src/utils_project.js',
                    '<%= paths.src.app.ussd_registration %>',
                    'test/ussd_registration.test.js'
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
            ussd_registration: {
                src: ['<%= paths.src.ussd_registration %>'],
                dest: '<%= paths.dest.ussd_registration %>'
            }

        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            test_smsapp: {
                src: ['<%= paths.test.smsapp %>']
            },
            test_ussd_registration: {
                src: ['<%= paths.test.ussd_registration %>']
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

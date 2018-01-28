module.exports = function (grunt) {
    let proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost',
                    open: {
                        target: 'http://localhost:8000/public'
                    },
                    middleware: function (connect, options, defaultMiddleware) {
                        return [proxySnippet].concat(defaultMiddleware);
                    }
                },
                proxies: [{
                    context: '/api/v1/',
                    host: 'localhost',
                    port: 1337,
                    changeOrigin: true
                }]
            },
        },
        sass: {
            dist: {
                options: {
                },
                files: {
                    'public/css/styles.css': 'styles.scss'
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 1 version']})
                ]
            },
            dist: {
                files: {
                    "public/css/styles.css": "public/css/styles.css"
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            dist: {
                files: {
                    "puplic/css/styles.css": "public/css/styles.css"
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['public/index.html']
            },
            sass: {
                options: {
                    // Monitor Sass files for changes and compile them, but don't reload the browser.
                    livereload: true
                },
                files: ['*.scss'],
                tasks: ['sass', 'postcss']
            }
        }
    });

    // Actually running things.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    // Default task(s).
    grunt.registerTask('default', ['sass', "postcss", 'configureProxies:server', 'connect:server', 'watch']);

};
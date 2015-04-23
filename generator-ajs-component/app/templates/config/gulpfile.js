/**
 * Created by montaque22 on 4/12/15.
 */
// Load plugins
var $ = require('gulp-load-plugins')(),
    gulp = $.param(require('gulp'), process.argv),
    browserSync = require('browser-sync'),
    bower = require('main-bower-files'),
    wiredep = require('wiredep').stream,
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    reload = browserSync.reload;

var templates = {
    directives:'.templates/directives.js',
    styles:'.templates/style.scss',
    views:'.templates/view.html',
    controller:'.templates/controller.js'
}
var appPaths = {
    directives:'public/scripts/directives/',
    controller:'public/scripts/controllers/',
    vendor:'public/scripts/vendor/',
    images:'public/assets/images',
    prod:'./dist',
    app:'./public'

}

// livereload = require('gulp-livereload'),
// lr = require('tiny-lr'),
// server = lr();


/*
    OPTIMIZE CLIENT FILES:
        - MINIMIZE & CONCAT JS FILES
        - MINIMIZE & CONCAT CSS FILES
        - MINIMIZE HTML
 */
gulp.task('html', ['styles'], function() {

    var assets = $.useref.assets({
        searchPath:appPaths.app
    });

    return gulp.src(appPaths.app+'/*.html')
        .pipe($.plumber())
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({
            conditionals: true,
            loose: true
        })))
        .pipe(gulp.dest(appPaths.prod))
});



/*
    COMPILE SCSS FILES
 */
gulp.task('styles', function() {
    return gulp.src('public/styles/scss/main.scss')
        .pipe($.plumber())
        .pipe($.compass({
            style: 'expanded',
            sass:'./public/styles/scss',
            css:'./public/styles/',
            require: ['sass-globbing']
        }))
        .pipe(reload({
            stream: true
        }))
        //.pipe($.notify({
        //    message: 'Finished Compiling SASS'
        //}));
});



/*
 CLEAN THE BUILD FOLDER
 */
gulp.task('clean', function() {
    return gulp.src(appPaths.prod, {read: false})
        .pipe(vinylPaths(del));
});




/*
    OPTIMIZE IMAGES!!!
*/

gulp.task('image', function(cb) {
   return gulp.src(appPaths.images + '**/*')
       .pipe($.plumber())
       .pipe($.webp())
       .pipe($.imagemin())
       .pipe(gulp.dest(appPaths.prod));
});








/*
 INJECT THE FILES THAT SIT IN THE LISTED DIRECTORIES INTO THE HTML FILE
 */
gulp.task('inject',['bower'], function() {

    return gulp.src('public/index.html')
        .pipe($.plumber())
        .pipe($.inject(gulp.src(['./public/scripts/vendor/**/*.js'], { read: false }),{ relative: true, name:'vendor'}))
        .pipe($.inject(gulp.src(['./public/scripts/**/*js', '!./public/scripts/vendor/**/*.js'], { read: false }),{ relative: true}))
        .pipe($.inject(gulp.src(['./public/styles/*.css'], { read: false }),{ relative: true}))
        .pipe(gulp.dest('./public'));
});





/*
    WIRE THE DEPENDENCIES (JS OR CSS FILES) THAT CAME THROUGH BOWER
 */
gulp.task('bower', function() {
    return gulp.src( appPaths.app + '/*.html')
        .pipe($.plumber())
        .pipe(wiredep())
        .pipe(gulp.dest(appPaths.app));
});






/*
 CREATE A NEW DIRECTIVE
 */
gulp.task('generate:directive', function (name) {
    gulp.start('create-directive', 'create-style','create-view');
});




/*
 CREATE A NEW CONTROLLER
 */
gulp.task('generate:controller', function (name) {
    gulp.start('create-controller');
});


gulp.task('create-directive', directiveWrapper('directives', null, true));

gulp.task('create-style', directiveWrapper('styles', 'directives'));

gulp.task('create-view',directiveWrapper('views','directives'));

gulp.task('create-controller',directiveWrapper('controller', null, true));

//gulp.task('create-service',directiveWrapper('service'));




/*
 SERVE FILES USING BROWSER SYNC
 */
gulp.task('browsersync', function() {
    browserSync({
        server: {
            baseDir: appPaths.app
        }
    })
});



/*
 LINT STYLES AND COMPILE
 */
gulp.task('style:dev',['lint:scss'], function (name) {
    gulp.start('style');
});




/*
 LINT SCSS
 */
gulp.task('lint:scss', function (name) {
    return gulp.src(appPaths.app + '/**/*.scss')
        .pipe($.plumber())
        .pipe($.scssLint(
            {
                bundleExec:true
            }
        ))
        .pipe(reload)
});


/*
 LINT JAVASCRIPT
 */
gulp.task('lint:js', function (name) {
    return gulp.src(appPaths.directives + '**/*.js')
        .pipe($.plumber())
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
});


/*
    WATCH MY FILES
*/
gulp.task('watch', function() {

    // IF THESE FILES CHANGE THEN...

    // ...RELOAD THE SCREEN
    gulp.watch([
        'public/scripts/**/*.js',
        'public/images/**/*',
        'public/**/*.html'
    ])
        .on('change', reload);

    gulp.watch([
        'public/scripts/**/*.js'
    ],['lint:js']);

    // ... WIRE UP THE DEPENDENCIES
    gulp.watch([
        'bower.json',
    ],['bower']);


    // ...RECOMPILE THE STYLES
    gulp.watch(['public/styles/**/*.scss', 'public/scripts/**/*.scss'], ['style:dev']);

});



/*
 RUN A BUILD
 */
gulp.task('build',['clean'], function (name) {
    gulp.start('html','image');
});



/*
 RUN A BUILD
 */
gulp.task('default', function (name) {
    gulp.start('serve');
});

/*
 RUN A BUILD
 */
gulp.task('serve',['inject'], function (name) {
    gulp.start('browsersync','watch');
});


/** HELPER FUNCTIONS **/
function directiveWrapper(templateUrl, directory ,shouldCamelCase){
    directory = directory || templateUrl;
    return function (name) {
        var url = appPaths[directory]+name;
        return gulp.src(templates[templateUrl])
            .pipe($.rename(function(path){
                path.basename = name
            }))
            .pipe($.data(function () {
                return {
                    name: shouldCamelCase && camelCase(name) || name,
                    url:url + '.html'
                };
            }))
            .pipe($.template())
            .pipe(gulp.dest(url));
    }
}


function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}
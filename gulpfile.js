/**
 * @file
 * Gulpfile for fortytwo.
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

/**
 * @task sass-lint
 * Lint sass, abort calling task on error
 */
gulp.task('sass-lint', function () {
  return gulp.src('assets/sass/**/*.s+(a|c)ss')
  .pipe($.sassLint({configFile: '.sass-lint.yml'}))
  .pipe($.sassLint.format())
  .pipe($.sassLint.failOnError());
});

gulp.task('sass-compile', function () {
  // postCss plugins and processes
  var pcPlug = {
    autoprefixer: require('autoprefixer'),
    mqpacker: require('css-mqpacker')
  };
  var pcProcess = [
    pcPlug.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11']
    }),
    pcPlug.mqpacker()
  ];

  return gulp.src('assets/sass/**/*.s+(a|c)ss') // Gets all files ending
    .pipe($.sass({includePaths: './node_modules'}))
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    })
    .pipe($.sourcemaps.init())
    .pipe($.postcss(pcProcess))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({ stream: true, match: '**/*.css' }));
});

/**
 * @task js
 *
 */
gulp.task('js', function () {
  return gulp.src(['assets/js/**/*.js'])
    .pipe($.jscs({ fix: true }))
    .pipe($.jscs.reporter())
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest('./assets/js'));
    // .pipe(browserSync.reload());
});

/**
 * @task clean
 * Clean the dist folder.
 */
gulp.task('clean', function () {
  return del(['assets/css/*', 'assets/js/*']);
});

/**
 * @task serve
 * Watch files and do stuff.
 */
gulp.task('serve', ['sass-compile', 'js'], function() {
  browserSync.init({
    proxy: "http://kolot.lh:8888",
    port: 3000
  });
});

/**
 * @task watch
 * Watch files and do stuff.
 */
gulp.task('watch', ['serve'], function () {
  gulp.watch('assets/sass/**/*.+(scss|sass)', ['sass-compile']);
  gulp.watch('assets/js/**/*.js', ['js']);
});

/**
 * @task default
 * Watch files and do stuff.
 */
gulp.task('default', ['watch']);


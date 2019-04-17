var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var htmlImport = require('gulp-html-import');
var imagemin = require('gulp-imagemin');
var mmq = require('gulp-merge-media-queries');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss', {
      style: 'expanded'
    }) // Gets all files ending with .scss in app/scss

    // Compile SASS.
    .pipe(sass({ outputStyle: 'compressed' }))
    // Run compiled CSS through autoprefixer.
    .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('mmq', function() {
  gulp.src('app/css/*.css')
    .pipe(mmq({ log: true }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')

    .pipe(htmlImport('app/html'))
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Compress all images and move them to /dist/images
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({ interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});

// Moves all fonts into /dist folder
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Gulp will delete the `dist` folder for you whenever gulp clean:dist is run.
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'replaceHTML', 'replaceJS', 'mmq', 'fonts'], callback )}
);

gulp.task('default', function(callback) {
  runSequence(['sass', 'browser-sync', 'watch'], callback )}
);

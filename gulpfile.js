
// function defaultTask(cb) {
  // place code for your default task here
//   console.log("hello");
//   cb();
// }
//
// exports.default = defaultTask

const { src, dest, parallel } = require('gulp');
// const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
// const concat = require('gulp-concat');

// function html() {
//   return src('client/templates/*.pug')
//     .pipe(pug())
//     .pipe(dest('build/html'))
// }

function css() {
  return src('app/scss/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('dist/css'))
}

// function js() {
//   return src('client/javascript/*.js', { sourcemaps: true })
//     .pipe(concat('app.min.js'))
//     .pipe(dest('build/js', { sourcemaps: true }))
// }

// exports.js = js;
exports.css = css;
// exports.html = html;
// exports.default = parallel(html, css, js);
exports.default = parallel(css);

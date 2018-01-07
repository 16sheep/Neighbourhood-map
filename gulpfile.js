const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();


//Lint JS
gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// Compile Sass
gulp.task('sass', function(){
  gulp.src('./scss/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', function () {

  browserSync.init({
    server: {
      baseDir:'./'
    }
  });
  gulp.watch('./scss/*.scss',['sass']);
  gulp.watch('./**/*.html').on('change', browserSync.reload({stream: true}));
});

gulp.task('default',['sass','serve']);



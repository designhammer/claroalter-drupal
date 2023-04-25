// Load modules
const gulp = require('gulp')
const autoprefixer = require('autoprefixer')
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')(require('sass'))
const sourceMaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

// paths
const path = {
  styles: {
    src: ['./sass/style.scss', './sass/toolbar.scss'],
    dest: './css/',
    watch: './sass/**/*.scss'
  },
  scripts: {
    src: ['./js/main.js'],
    dest: './js/min/',
    watch: './js/*.js'
  }
}

// browserSync watch
function browsersync () {
  browserSync.init({
    port: 3110,
    proxy: 'http://local.drupal10.test',
    open: false,
    browser: 'google chrome',
    notify: true,
    ghostMode: false,
    ui: false
  })
}

// browserSync notify messages
const bsMessage = {
  sassComplete: 'Sass compiled successfully 🎉',
  sassError: 'Sass error! <small>⚠️</small>',
  jsComplete: 'JS uglified successfully 🎉 ...reloading',
  jsError: 'Javascript error! <small>⚠️</small>',
  successTime: 3000,
  errorTime: 5000
}

// Scss : expanded, compressed
function styles (done) {
  let isSuccess = true
  gulp.src(path.styles.src)
    .pipe(sourceMaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', function (err) {
      console.log(err.toString())
      browserSync.notify(bsMessage.sassError, bsMessage.errorTime)
      isSuccess = false
      this.emit('end')
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(path.styles.dest))
    .on('end', function () {
      if (isSuccess) {
        browserSync.notify(bsMessage.sassComplete, bsMessage.successTime)
      }
    })
    .pipe(browserSync.stream())

  done()
}

// Minify JS
function scripts (done) {
  let isSuccess = true
  gulp.src(path.scripts.src)
    .pipe(sourceMaps.init())
    .pipe(uglify({
      mangle: false
    }))
    .on('error', function (err) {
      console.log(err.toString())
      browserSync.notify(bsMessage.jsError, bsMessage.errorTime)
      isSuccess = false
      this.emit('end')
    })
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(path.scripts.dest))
    .on('end', function () {
      if (isSuccess) {
        browserSync.notify(bsMessage.jsComplete, bsMessage.successTime)
        browserSync.reload()
      }
    })
    .pipe(browserSync.stream())

  done()
}

// watch files
function watchfiles () {
  gulp.watch(path.styles.watch, gulp.series(styles))
  gulp.watch(path.scripts.watch, gulp.series(scripts))
}

gulp.task('styles', styles)
gulp.task('scripts', scripts)
gulp.task('default', gulp.parallel(styles, scripts))
gulp.task('watch', gulp.parallel(browsersync, watchfiles))

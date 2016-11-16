var gulp = require("gulp");
var source = require('vinyl-source-stream');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var babelify = require("babelify");
var concat = require("gulp-concat");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var browserify = require('browserify');
var watchify = require('watchify');




var path = {
  HTML: 'src/index.html',
  SCSS: 'src/scss/styles.scss',
  SRC: 'src/jsx/*',
  POST_BABEL_JS:'tmp/postBabelJs',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/js',
  DEST_CSS: 'dist/css',
  ENTRY_POINT: 'src/jsx/app.jsx'
};

gulp.task('copy', function () {
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function () {


  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.SCSS, ['sass']);
  //gulp.watch(path.SRC,['babel']);
  //var watcher = watchify(browserify(path.ENTRY_POINT, { debug: true }).transform(babel));
  var watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: ["babelify"],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));
  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
    console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));


});




gulp.task('sass', function () {
  gulp.src(path.SCSS)
    .pipe(sass())
    .pipe(gulp.dest(path.DEST_CSS));
});

gulp.task('replaceHTML', function () {
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task("babel", function () {
  return gulp.src(path.SRC)
    .pipe(babel())
    .pipe(gulp.dest(path.POST_BABEL_JS));
});

//gulp.task('browserify',function(){
//  return browserify({entries: path.ENTRY_POINT, debug: true}).transform("babelify")
//
//    .bundle()
//    .pipe(source('bundle.js'))
//    .pipe(gulp.dest('dist'));
//});

gulp.task('production', ['replaceHTML', 'build']);
gulp.task('default', ['watch','copy','sass']);

//gulp.task("default", function () {
//  return gulp.src("src/js/*.js")
//    .pipe(babel())
//    .pipe(gulp.dest("dist"));
//});
//
//gulp.task("build", function () {
//  return gulp.src("src/**/*.js")
//    .pipe(sourcemaps.init())
//    .pipe(babel())
//    .pipe(concat("all.js"))
//    .pipe(sourcemaps.write("."))
//    .pipe(gulp.dest("dist"));
//});








//gulp.task('build', function () {
//  browserify({
//    entries: [path.ENTRY_POINT],
//    transform: [babel],
//  })
//    .bundle()
//    .pipe(source(path.MINIFIED_OUT))
//    .pipe(streamify(uglify(path.MINIFIED_OUT)))
//    .pipe(gulp.dest(path.DEST_BUILD));
//});



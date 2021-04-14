var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var prefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var svgstore = require("gulp-svgstore");

var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("src/scss/main.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("dist/css"))
    .pipe(csso())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest("dist/css"))
});

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("dist/"))
});

gulp.task("refresh", function () {
  server.reload();
  done();
});

gulp.task("sprite", function () {
  return gulp.src("src/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("dist/img"))
})

gulp.task("copy", function () {
  return gulp.src([
    "src/img/**",
    "src/fonts/**/*.{woff2,woff}",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src/"
  })
  .pipe(gulp.dest("dist/"))
})

gulp.task("server", function () {
  server.init({
    server: "dist/"
  });

  gulp.watch("src/scss/**/*.{scss,sass}", gulp.series("css", "refresh"))
  gulp.watch("src/img/icon-*.svg", gulp.series("sprite", "html", "refresh"))
  gulp.watch("src/*.html", gulp.series("html", "refresh"))
});
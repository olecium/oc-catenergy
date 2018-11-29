"use strict";
var gulp = require('gulp'); // Подключаем Gulp
var less = require('gulp-less'); //Подключаем Less пакет,
var plumber = require("gulp-plumber");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var del = require("del");
var uglify = require("gulp-uglify");
var server = require("browser-sync").create(); // Подключаем Browser Sync

var PUBLIC_DEST = "build";
var LOCAL_DEST = "source";

gulp.task("style", function(){ // Создаем таск less
  return gulp.src(LOCAL_DEST + "/less/style.less") // Берем источник
    .pipe(plumber()) //отслеживаем ошибки
    .pipe(less()) // Преобразуем Less в CSS посредством gulp-less
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(LOCAL_DEST + "/css")) // Выгружаем результата в папку source/css
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(PUBLIC_DEST + "/css")) // Выгружаем результата в папку build/css
    .pipe(server.stream()) // Обновляем CSS на странице при изменении
});

gulp.task("images", function(){
  return gulp.src(LOCAL_DEST + "/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(PUBLIC_DEST + "/img"));
});

gulp.task("webp", function(){
  return gulp.src(LOCAL_DEST + "/img/**/*.{png,jpg,svg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest(PUBLIC_DEST + "/img"));
});

gulp.task("sprite", function(){
  return gulp.src(LOCAL_DEST + "/img/sprite-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest(PUBLIC_DEST + "/img"));
});

gulp.task("minjs", function () {
  return gulp.src(LOCAL_DEST + "/js/main.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(PUBLIC_DEST + "/js"));
});

gulp.task("html", function(){
  return gulp.src(LOCAL_DEST + "/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task("copy", function(){
  return gulp.src([
    LOCAL_DEST + "/fonts/**/*.{woff,woff2}",
    LOCAL_DEST + "/img/**",
    LOCAL_DEST + "/js/**"
  ], {
    base: LOCAL_DEST
  })
  .pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task("clean", function(){
  return del(PUBLIC_DEST);
})

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("serve", function() {
  server.init({
    server: PUBLIC_DEST,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(LOCAL_DEST + "/less/**/*.less", gulp.series("style"));
  gulp.watch(LOCAL_DEST + "/img/**/sprite-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch(LOCAL_DEST + "/*.html", gulp.series("html", "refresh"));
  gulp.watch(LOCAL_DEST + "/js/**/*.js", gulp.series("minjs", "refresh"));
  gulp.watch(LOCAL_DEST + "/img/**/*.{png,jpg,gif,svg}", gulp.series("images", "webp"));
});

gulp.task("build", gulp.series("clean", "images", "webp", "copy", "minjs", "style", "sprite", "html"));



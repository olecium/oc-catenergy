"use strict";
var gulp = require('gulp'); // Подключаем Gulp
var less = require('gulp-less'); //Подключаем Less пакет,
var plumber = require("gulp-plumber");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require("browser-sync").create(); // Подключаем Browser Sync


gulp.task('style', function(){ // Создаем таск less
  return gulp.src('source/less/style.less') // Берем источник
    .pipe(plumber()) //отслеживаем ошибки
    .pipe(less()) // Преобразуем Less в CSS посредством gulp-less
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css')) // Выгружаем результата в папку source/css
    .pipe(browserSync.stream()) // Обновляем CSS на странице при изменении
});
/*
gulp.task('browser-sync', function(){ // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
      server: { // Определяем параметры сервера
          baseDir: 'source' // Директория для сервера - app
      },
      notify: false // Отключаем уведомления
  });
});*/


gulp.task("watch", function() {
  browserSync.init({
    server: { // Определяем параметры сервера
      baseDir: 'source' // Директория для сервера - app
    },
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("style"));
  gulp.watch("source/*.html").on('change', browserSync.reload);
});

gulp.task("build", gulp.series("style"));



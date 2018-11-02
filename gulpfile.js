var gulp = require('gulp'); // Подключаем Gulp
var less = require('gulp-less'); //Подключаем Less пакет,
var browserSync = require('browser-sync'); // Подключаем Browser Sync

gulp.task('less', function(){ // Создаем таск less
  return gulp.src('source/less/**/*.less') // Берем источник
      .pipe(less()) // Преобразуем Less в CSS посредством gulp-less
      .pipe(gulp.dest('source/css')) // Выгружаем результата в папку source/css
      .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
      server: { // Определяем параметры сервера
          baseDir: 'source' // Директория для сервера - app
      },
      notify: false // Отключаем уведомления
  });
});

gulp.task('watch', ['browser-sync', 'less'], function() {
  gulp.watch('source/less/**/*.less', ['less']); // Наблюдение за less файлами
  gulp.watch("source/*.html").on('change', browserSync.reload); // запускаем перезагрузку страницы при изменениях html
  // Наблюдение за другими типами файлов
});


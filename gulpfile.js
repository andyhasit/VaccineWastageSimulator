var gulp = require('gulp');
var concat = require('gulp-concat');
var destDir = 'build';

function compileFiles(files, name, dest) {
  return gulp.src(files)
    .pipe(concat(name))
    .pipe(gulp.dest(dest))
}

function copyFiles(files, dest) {
  files.forEach(function(file) {
    gulp.src(file)
    .pipe(gulp.dest(dest))
  });
}
 
gulp.task('buildJS', function() {
  files = [
    //'node_modules/n3-charts/build/LineChart.css',
    
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js', 
    'bower_components/angular/angular.min.js',
    'bower_components/d3/d3.js',
    'node_modules/n3-charts/build/LineChart.js',
    'node_modules/mathjs/dist/math.js',
    'src/app.js'    
  ];
  return compileFiles(files, 'compiled.js', destDir);
});

gulp.task('buildCSS', function() {
  files = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/n3-charts/build/LineChart.css',
    'src/style.css'
  ];
  return compileFiles(files, 'compiled.css', destDir);
});

gulp.task('build', [ 'buildJS', 'buildCSS'] , function() {
  files = [
    'src/container.html',
    'src/container.css',
    'src/index.html',
  ];
  return gulp.src(files).pipe(gulp.dest(destDir));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build']);
});
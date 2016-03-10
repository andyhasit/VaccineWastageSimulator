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
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/mathjs/dist/math.js',
    'src/app.js'    
  ];
  return compileFiles(files, 'compiled.js', destDir);
});

gulp.task('buildCSS', function() {
  files = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.js',
    'src/style.css'
  ];
  return compileFiles(files, 'compiled.css', destDir);
});

gulp.task('build', [ 'buildJS', 'buildCSS'] , function() {
  files = [
    'src/container.html',
    'src/container.css',
    'src/index.html',
    'src/logo.png',
  ];
  return gulp.src(files).pipe(gulp.dest(destDir));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build']);
});
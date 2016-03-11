var gulp = require('gulp');
var concat = require('gulp-concat');
var destDir = 'build';
var connect = require('gulp-connect');

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
 
gulp.task('buildLib', function() {
  files = [
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/mathjs/dist/math.js',
    
  ];
  return compileFiles(files, 'lib.js', destDir);
});

gulp.task('buildJS', function() {
  return gulp.src(['src/app.js', 'src/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destDir))
});


gulp.task('buildCSS', function() {
  files = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.js',
    'static/style.css'
  ];
  return compileFiles(files, 'compiled.css', destDir);
});

gulp.task('build', [ 'buildJS', 'buildCSS', 'buildLib'] , function() {
  files = [
    'src/container.html',
    'src/container.css',
    'src/index.html',
    'src/logo.png',
  ];
  //gulp.src([task.start, task.sources])
  //return gulp.src(files).pipe(gulp.dest(destDir));
  return gulp.src('static/**/*').pipe(gulp.dest(destDir));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('static/**/*', ['build']);
  gulp.watch('src/**/*', ['build']);
});

gulp.task('serve', function() {
  connect.server({
    root: 'build',
    port: 8080,
    livereload: true
  });
});
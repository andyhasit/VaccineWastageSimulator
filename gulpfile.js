var gulp = require('gulp');
var concat = require('gulp-concat');
var destDir = 'build';
var connect = require('gulp-connect');
var ftp = require( 'vinyl-ftp' );

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
    'node_modules/angular/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/mathjs/dist/math.js',
    'node_modules/chart.js/dist/Chart.min.js',
    //'node_modules/angular-chart.js/dist/angular-chart.min.js',
    'angular-chart.js-chartjs-2.0/dist/angular-chart.min.js',
    'node_modules/flot/jquery.js',
    'node_modules/flot/jquery.flot.js',
    'node_modules/angular-flot/angular-flot.js',
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
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
    //'node_modules/angular-chart.js/dist/angular-chart.min.css',
    'static/style.css'
  ];
  return compileFiles(files, 'compiled.css', destDir);
});

gulp.task('build', [ 'buildJS', 'buildCSS', 'buildLib'] , function() {
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
 
gulp.task( 'deploy', function () {
 
	var conn = ftp.create( {
		host:     'host18.qnop.net',
		user:     '****',
		password: '****',
		parallel: 10
	});
 
	// using base = '.' will transfer everything to /public_html correctly 
	// turn off buffering in gulp.src for best performance 
 
	return gulp.src( ['build'], { base: '/demos/paul_coly/', buffer: false } )
		.pipe( conn.newer( '/demos/paul_coly/' ) ) // only upload newer files 
		.pipe( conn.dest( '/demos/paul_coly/' ) );
 
} );
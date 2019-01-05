const gulp 					= require('gulp');
const sass 					= require('gulp-sass');
const browserSync 	= require('browser-sync');
const cssmin 				= require('gulp-cssmin');
const runSequence 	= require('run-sequence');
const sourcemaps 		= require('gulp-sourcemaps');

// WATCHING
gulp.task('watch', ['browserSync', 'sass'], function (){
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});

// BROWSERSYNC
gulp.task('browserSync', function() {
	browserSync.init(["css/*.css", "js/*.js"], {
		server: {
				baseDir: "./"
		}
  });
})

// SASS
gulp.task('sass', function(){
	return gulp.src('scss/**/*.scss')
	.pipe(sass())
	.on('error', function (err) {
		console.log(err.toString());
		this.emit('end');
	})
	.pipe(gulp.dest('css'))
	.pipe(browserSync.stream())
	.pipe(sourcemaps.write())
});

// SOURCEMAP
gulp.task('sass', function () {
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('css'));
});

// CSSMIN
gulp.task('cssmin', function () {
	gulp.src('css/**/*.css')
		.pipe(cssmin())
		// .pipe(rename({
		// 	suffix: '.min'
		// }))
		.pipe(gulp.dest('css'));
});

// SEQUENCAGE - TASK DEFAULT
gulp.task('default', function (callback) {
	runSequence(['sass', 'cssmin', 'browserSync', 'watch'],
	callback
	)
})


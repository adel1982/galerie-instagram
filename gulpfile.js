var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

// WATCHING
gulp.task('watch', ['browserSync', 'sass'], function (){
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});

// BROWSERSYNC
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: './'
		},
	})
})

// SASS
gulp.task('sass', function(){
	return gulp.src('scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

// SEQUENCAGE - TASK DEFAULT
gulp.task('default', function (callback) {
	runSequence(['sass','browserSync', 'watch'],
	callback
	)
})


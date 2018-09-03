const gulp 					= require('gulp');
const sass 					= require('gulp-sass');
const browserSync 	= require('browser-sync');
const cssmin 				= require('gulp-cssmin');
// const rename 				= require('gulp-rename');
const runSequence 	= require('run-sequence');
const sourcemaps 		= require('gulp-sourcemaps');
const autoprefixer 	= require('gulp-autoprefixer');

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
	.on('error', function (err) {
		console.log(err.toString());
		this.emit('end');
	})
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({
		stream: true
	}))
	.pipe(sourcemaps.write())
});

// AUTOPREFIXER
gulp.task('autoprefixer', () =>
	gulp.src('css/style.css')
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: true
	}))
	.pipe(gulp.dest('css'))
);

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
	runSequence(['sass', 'autoprefixer','cssmin', 'browserSync', 'watch'],
	callback
	)
})


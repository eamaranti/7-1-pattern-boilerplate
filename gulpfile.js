var gulp = require('gulp'), 
    files = require( 'gulp-add-files' ),
    fs = require('fs');
    sass = require('gulp-sass')
    notify = require('gulp-notify')
    browsersync = require('browser-sync').create()
    concat = require('gulp-concat')
    moduleImporter = require('sass-module-importer')
    sourcemaps = require('gulp-sourcemaps')
    data = require('gulp-data')
    path = require('path')
    jade = require('gulp-jade');

var config = {
    sassPath: './resources/sass',
    nodeDir: './node_modules',
    assetsDir: './public/assets'
}

gulp.task('icons', function() {
    return gulp.src([
        config.nodeDir + '/font-awesome/fonts/**.*',
        config.nodeDir + '/mdi/fonts/**.*'
    ])
        .pipe(gulp.dest(config.assetsDir + '/fonts'));
});

gulp.task('js', function(){
    return gulp.src([
        config.nodeDir + '/jquery/dist/jquery.min.js', 
        config.nodeDir + '/popper.js/dist/umd/popper.min.js',
        config.nodeDir + '/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(config.assetsDir + '/js'));   
});

gulp.task('css', function() {
    return gulp.src(config.sassPath +'/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed', 
        importer: moduleImporter()
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.assetsDir + '/css'));
});

gulp.task('index', function() {
    return gulp.src('templates/index.jade')
    .pipe(data(function(file) {
        return require('./templates/index.json');
      }))
        .pipe(jade({pretty: true})) 
        .pipe(gulp.dest('public')); 
});

gulp.task('page', function() {
    return gulp.src('templates/page.jade')
    .pipe(data(function(file) {
        return require('./templates/page.json');
      }))
        .pipe(jade({pretty: true})) 
        .pipe(gulp.dest('public')); 
});

gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch('public/*.html').on('change', browsersync.reload);
    gulp.watch('public/css/**/*.css').on('change', browsersync.reload);
    gulp.watch('public/js/**/*.js').on('change', browsersync.reload);
});

gulp.task('build', ['files','directories','icons', 'css', 'js','index']);

gulp.task('serve', ['css','watch'],function(){
	browsersync.init({
        server: "./public"
    });
});


gulp.task('directories', function () {
    return gulp.src('*.*', { read: false })
        .pipe(gulp.dest(config.assetsDir+'/css'))
        .pipe(gulp.dest(config.assetsDir+'/images'))
        .pipe(gulp.dest(config.assetsDir+'/fonts'))
        .pipe(gulp.dest(config.assetsDir+'/js'))
        ;
});

gulp.task('files', function () {
    var manifestText = fs.readFileSync('manifest.txt','utf-8');
    let str = '/****/';
    return files([
        {
            name: './main.scss',
            content: manifestText
        },
        {
            name: './abstracts/_variables.scss',
            content: str
        },
        {
            name: './abstracts/_mixins.scss',
            content: str
        },
        {
            name: './base/_reset.scss',
            content: str
        },
        {
            name: './base/_typography.scss',
            content: str
        },
        {
            name: './layout/_navigation.scss',
            content: str
        },
        {
            name: './layout/_grid.scss',
            content: str
        },
        {
            name: './layout/_header.scss',
            content: str
        },
        {
            name: './layout/_grid.scss',
            content: str
        },
        {
            name: './layout/_footer.scss',
            content: str
        },
        {
            name: './layout/_sidebar.scss',
            content: str
        },
        {
            name: './layout/_forms.scss',
            content: str
        },
        {
            name: './components/_buttons.scss',
            content: str
        },
        {
            name: './components/_carousel.scss',
            content: str
        },
        {
            name: './components/_cover.scss',
            content: str
        },
        {
            name: './components/_dropdown.scss',
            content: str
        },
        {
            name: './pages/_home.scss',
            content: str
        },
        {
            name: './themes/_theme.scss',
            content: str
        }
        
    ])
        .pipe(gulp.dest(config.sassPath));
});

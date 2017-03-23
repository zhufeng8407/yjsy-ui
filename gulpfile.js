/**
 * Created by xiafan on 16/8/27.
 * for the whole projects, we need to copy all non-js files into the target directory;<br>
 * for each app html file, we need to do the following steps automatically:
 * <ul>
 *     <li>inject Javascripts maintained by bower into html</li>
 *     <li>injects Javascripts of common modules into html</li>
 *     <li>injects Javascripts of modules implemented for the html</li>
 * </ul>
 */

var gulp = require('gulp');
var es = require('event-stream');
var inject = require('gulp-inject');
var mainBowerFiles = require('gulp-main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var gulpFilter = require('gulp-filter');
var useref = require('gulp-useref');
var series = require('stream-series');
var eol = require('gulp-eol');
var wiredep = require('wiredep');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var map = require('map-stream');
var concat = require('gulp-concat');
//var livereload = require('gulp-livereload');
var debug = require('gulp-debug');
var clean = require('gulp-clean');
var install = require('gulp-install');

//used to create file
var File = require('vinyl');
var fs = require('graceful-fs');
var lazystream = require('lazystream');
//var stripBomFromStream = require('strip-bom-stream');
var path = require('path');

var DEV_DIR = "./build";
var DEPLOY_DIR = "./dist";
var SRC_DIR = "./src";

/*
 * FIXME: there is a bug in gulp watch that cause it won't lanch corresponding tasks after the first modification
 * to watched files. we need to wait for gulp 4.0 where the bug will be fixed
 * */
gulp.task("watch-deploy", function () {
    //livereload.listen({port: 8081, basePath: 'dist'});
    gulp.watch("src/**/*", ["deploy"]);
});

gulp.task("watch-dev", function () {
    //livereload.listen({port: 8081, basePath: 'build'});
    gulp.watch("src/**/*", ["dev"]);
});

gulp.task("clean", function () {
    return gulp.src(["build/*", "dist/*"]).pipe(clean());
});

gulp.task("deploy", ["deploy-copy", "deploy-department"], function (done) {
    console.log("begin deploy");
    return done();
});

/**
 * inject Javascripts into department pages used in the development enviroments
 */
gulp.task('deploy-department', ['deploy-copy'], injectForDeploy);

gulp.task('deploy-copy', copyModulesToDestForDeploy);

gulp.task("dev", ["dev-copy", "dev-department"], function (done) {
    return done();
});

gulp.task('dev-copy', function () {
    return copyModulesToDestForDev();
});

/**
 * inject Javascripts into department pages used in the development enviroments
 */
gulp.task('dev-department', ['dev-copy'], function () {
    return injectForDev();
});

//the default task will generate codes for both development and deployment enviroments
gulp.task("default", ["development"]);

//install bower dependencies
gulp.task('bower-install', function () {
    gulp.src("src/!(lib)/**/bower.json", {cwd: "./", base: "./src"}).pipe(debug()).pipe(install({cwd: "./"}));
});

/**
 * copy source codes into the dest
 * @param dest
 * @returns {*}
 */
function copyModulesToDestForDeploy() {
    console.log("begin to copy compiled files into target directory");
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //copy bower files
    var libJs = gulp.src('./bower.json')
                    .pipe(mainBowerFiles())
                    .pipe(gulp.dest("./lib/js", {cwd: DEPLOY_DIR}));
    var libStyle = gulp.src("./lib/style/**", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    //common modules: first copy non-js files, then generate compressed js
    var commonCodes = gulp.src("./common/**/!(*.js)", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    var commonJS = gulp.src(["./common/**/*!(.spec).js"], srcDir)
                       .pipe(gulpFilter("**/!(*.spec.js)"))
                       .pipe(angularFilesort()).pipe(concat("/common.app.min.js"))
                       .pipe(uglify()).pipe(gulp.dest(DEPLOY_DIR + "/common"));
    //copy modules
    var modules = gulp.src("./!(common|lib)/**/!(*.js)", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    return es.merge(libJs, libStyle, commonCodes, commonJS, modules);

}

/**
 * for each app:
 * 1. copy all files into the build directory
 * 2. inject javascripts into htmls
 *
 */
function injectForDeploy() {

    console.log("inject for deploy environment");
    var dest = DEPLOY_DIR;
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //first inject bower dependencies
    var apps = gulp.src("./!(common|lib)/**/*.app.js", srcDir).pipe(map(wiredepForApp));
    //inject page specific Javascripts and store injected files into target directory
    apps = apps.pipe(useref()).pipe(gulpif("*.js", uglify())).pipe(map(changeBase))
               .pipe(gulp.dest(dest));

    //inject common libraries and store injected files into target directory
    var commonJS = gulp.src("./common/common.app.min.js", {read: false, cwd: dest, base: dest});
    apps = apps.pipe(inject(commonJS, {relative: true})).pipe(gulp.dest(dest));

    return series(apps);
}

/**
 * copy source codes into the dest
 * @param dest
 * @returns {*}
 */
function copyModulesToDestForDev() {

    console.log("begin to copy compiled files into target directory");
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //copy bower files
    var libJs = gulp.src('./bower.json')
                    .pipe(mainBowerFiles())
                    .pipe(gulp.dest("./lib/js", {cwd: DEV_DIR}));
    var libStyle = gulp.src("./lib/style/**", srcDir).pipe(gulp.dest(DEV_DIR));
    //copy common
    var commonCodes = gulp.src("./common/**/*", srcDir).pipe(gulp.dest(DEV_DIR));

    //copy modules
    var modules = gulp.src("./!(common|lib)/**/*", srcDir).pipe(gulp.dest(DEV_DIR));

    return es.merge(libJs, libStyle, commonCodes, modules);

}

/**
 * module files and inject them automatically.
 * for each app:
 * 1. copy all files into the build directory
 * 2. inject javascripts into htmls
 *
 */
function injectForDev() {
    var dest = DEV_DIR;
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};
    //first inject bower dependencies
    var apps = gulp.src("./!(common|lib)/**/*.app.js", srcDir).pipe(map(wiredepForApp))
                   .pipe(map(changeBase)).pipe(gulp.dest(dest));
    //inject common libraries
    var commonJS = gulp.src("./common/**/*.js", {read: false, cwd: dest, base: dest}).pipe(
        gulpFilter("**/!(*spec.js)"));
    apps.pipe(inject(commonJS, {relative: true})).pipe(gulp.dest(dest));
    return series(apps);

}

function wiredepForApp(appFile, cb) {
    var fileName = path.basename(appFile.path, ".app.js");
    var pathDir = path.dirname(appFile.path);
    var htmlFile = new File({
        cwd: appFile.cwd,
        base: appFile.base,
        path: pathDir + "/" + fileName + ".html"
    });

    fs.readFile(htmlFile.path, function (err, data) {
        try {
            htmlFile.contents = data;
            var opts = {bowerJson: require(pathDir + "/bower.json")};
            opts.stream = {
                src: htmlFile.contents.toString(),
                path: htmlFile.path,
                fileType: path.extname(htmlFile.path).substr(1)
            };

            htmlFile.contents = new Buffer(wiredep(opts));
            cb(null, htmlFile);
        } catch (err) {
            cb(err, null);
        }
    });

}

//---------------------------------------------------------------
//some helping function for debug

function changeBase(file, cb) {
    file.base = SRC_DIR;
    cb(null, file);
}

/**
 *
 * @param func: a function that accepts a vlny-fs file object
 */
function filePathProcess(func) {
    return map(function (file, cb) {
        func(file);
        cb(null, file);
    });
}

function fileLogFunction() {
    return filePathProcess(function (file) {
        console.log("base:" + file.base + ";path:" + file.path)
    });
}


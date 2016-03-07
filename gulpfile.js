var gulp = require("gulp");
var download = require("gulp-download");
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var clean = require('gulp-clean');

var rename = require("gulp-rename");
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();

var server = {
  server: {
    baseDir: "./pages/",
    directory: true
  }
};

var checkArg = function(arg) {
  if(arg === undefined) {
    return false;
  } else {
    return true;
  }
}

var getAllCss = function(url) {
  var str = '<!-- INJECTED BY VACCINE -->\n';

  str +='  <link rel="stylesheet" href="' + url + 'base-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'helper-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'component-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'layout-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'layout-styles.css">\n';

  str +='  <!-- END INJECTION -->\n';

  return str;
}

var getCss = function(url) {
  var str = '<!-- INJECTED BY VACCINE -->\n';

  str +='  <link rel="stylesheet" href="' + url + '">\n';

  str +='  <!-- END INJECTION -->\n';

  return str;
}

gulp.task("download-page", function() {
  if(argv.url !== undefined) {
    server.server.directory = false;
    server.server.index = argv.url.split("//")[1] + ".html";
    console.log(argv.url.split("//")[1] + ".html");
    download(argv.url)
      .pipe(gulpif(checkArg(argv.url), rename(argv.url.split("//")[1] + ".html")))
      .pipe(gulpif(checkArg(argv.injectallcss), replace("</head>", getAllCss(argv.injectallcss) + "</head>")))
      .pipe(gulpif(checkArg(argv.injectcss), replace("</head>", getCss(argv.injectcss) + "</head>")))
      .pipe(gulp.dest("./pages/"));
  }
});

gulp.task("browser-sync", ['download-page'], function() {
  browserSync.init(server);
});

gulp.task("clean-pages", function() {
    return gulp.src(['pages/*','!pages/.gitkeep'], {read: false})
      .pipe(clean());
});

gulp.task("default", ["browser-sync", 'download-page']);

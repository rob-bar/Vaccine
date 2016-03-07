var gulp = require("gulp");
var download = require("gulp-download");
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var clean = require('gulp-clean');

var rename = require("gulp-rename");
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();

//fs.stat('file.txt', function(err, stat) {
//  if(err == null) {
//      console.log('File exists');
//  } else {
//      console.log(err.code);
//  }
//});

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

gulp.task("default", function() {
  var server = {
    server: {
      baseDir: "./pages/",
      directory: true
    }
  };

  if(argv.url !== undefined) {
    download(argv.url)
      .pipe(gulpif(checkArg(argv.url), rename(argv.url.split("//")[1] + ".html")))
      .pipe(gulpif(checkArg(argv.injectallcss), replace("</head>", getAllCss(argv.injectallcss) + "</head>")))
      .pipe(gulpif(checkArg(argv.injectcss), replace("</head>", getCss(argv.injectcss) + "</head>")))
      .pipe(gulp.dest("pages/"));

    server.server.directory = false;
    server.server.index = argv.url.split("//")[1] + ".html";
  }

  browserSync.init(server);
});

gulp.task("clean-pages", function() {
    return gulp.src(['pages/*','!pages/.gitkeep'], {read: false})
      .pipe(clean());
});

var gulp = require("gulp");
var download = require("gulp-download");
var gulpif = require('gulp-if');
var replace = require('gulp-replace');

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
  if(arg == undefined) {
    return false;
  } else {
    return true;
  }
}
var getCss = function(url) {
  var str = '';

  str +='<link rel="stylesheet" href="' + url + 'base-styles.css">\n';
  str +='<link rel="stylesheet" href="' + url + 'helper-styles.css">\n';
  str +='<link rel="stylesheet" href="' + url + 'component-styles.css">\n';
  str +='<link rel="stylesheet" href="' + url + 'layout-styles.css">\n';
  str +='<link rel="stylesheet" href="' + url + 'layout-styles.css">\n';

  return str;
}

gulp.task("default", function() {
  download(argv.url)
    .pipe(gulpif(checkArg(argv.url), rename(argv.url.split("//")[1].replace("/", "-") + ".html")))
    .pipe(gulpif(checkArg(argv.injectcss), replace("</head>", getCss(argv.injectcss) + "</head>")))
    .pipe(gulp.dest("pages/"));

    browserSync.init({
      server: {
        baseDir: "./pages/",
        index: argv.url.split("//")[1].replace("/", "-") + ".html"
      }
    });
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "pages/"
    }
  });
});

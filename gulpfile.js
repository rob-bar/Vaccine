var gulp = require("gulp-help")(require("gulp"));
var gulpSequence = require('gulp-sequence');
var download = require("gulp-download");
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var gutil = require('gulp-util');

var rename = require("gulp-rename");
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();

var server = {
  server: {
    baseDir: "./pages/",
    directory: true
  }
};

var checkArg = function(arg, name) {
  if(arg === undefined) {
    return false;
  } else {
    gutil.log(gutil.colors.black.bgBlue("INFO: Found argument", gutil.colors.blue.bgBlack(" " + name + " = " + arg)));
    return true;
  }
}

var getAllCss = function(url) {
  var str = '<!-- INJECTED BY VACCINE -->\n';
  str +='  <link rel="stylesheet" href="' + url + 'base-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'helper-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'component-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'layout-styles.css">';
  str +='<link rel="stylesheet" href="' + url + 'print-styles.css">\n';
  str +='  <!-- END INJECTION -->\n';

  return str;
}

var getCss = function(url) {
  var str = '<!-- INJECTED BY VACCINE -->\n';
  str +='  <link rel="stylesheet" href="' + url + '">\n';
  str +='  <!-- END INJECTION -->\n';

  return str;
}

// ====================================================================================================== //
// Inject -- This downloads a webpage based on --url, optionaly injected with assets //
// ====================================================================================================== //
gulp.task("inject", "This downloads a webpage based on --url, optionaly injected with assets", function() {
  if(argv.url !== undefined) {
    download(argv.url)
      .pipe(gulpif(checkArg(argv.url, "url"), rename(argv.url.split("//")[1] + ".html")))
      .pipe(gulpif(checkArg(argv.injectallcss, "injectallcss"), replace("</head>", getAllCss(argv.injectallcss) + "</head>")))
      .pipe(gulpif(checkArg(argv.injectcss, "injectcss"), replace("</head>", getCss(argv.injectcss) + "</head>")))
      .pipe(gulp.dest("./pages/"));

    if(argv.injectallcss === undefined && argv.injectcss === undefined) {
      gutil.log(gutil.colors.black.bgYellow("WARNING: There was no injection! Downloaded page " + argv.url));

    } else {
      gutil.log(gutil.colors.black.bgGreen("SUCCESS: Succesfully injected page"));
      gutil.log(gutil.colors.black.bgGreen(argv.url));
      gutil.log(gutil.colors.black.bgGreen("with"));
      gutil.log(gutil.colors.black.bgGreen(argv.injectallcss + argv.injectcss));
    }

  } else {
    gutil.log(gutil.colors.black.bgRed("ERROR: you must specify a url, this can be done with --url"));
  }
});

// ====================================================================================================== //
// Serve -- This command calls inject with the same parrameters but serves the page after the injection //
// ====================================================================================================== //
gulp.task("vaccine", "This command calls the inject command but serves the page after the injection", function(cb) {
  if(argv.url !== undefined) {
    server.server.directory = false;
    server.server.index = argv.url.split("//")[1] + ".html";

    gulpSequence("inject", "serve", cb);
  } else {
    gutil.log(gutil.colors.black.bgRed("ERROR: you must specify a url, this can be done with --url"));
  }
});


// ====================================================================================================== //
// Serve -- Serves the pages directory to browse all the pages //
// ====================================================================================================== //
gulp.task("serve", "Serves the pages directory to browse all the pages", function() {
  browserSync.init(server);
});


// ====================================================================================================== //
// clean -- This cleans the pages directory to start over or te rebuild the pages. //
// ====================================================================================================== //
gulp.task("clean", "This cleans the pages directory to start over or te rebuild the pages.", function() {
    return gulp.src(['pages/*','!pages/.gitkeep'], {read: false})
      .pipe(clean());
});

// ====================================================================================================== //
// Default -- The default task displays the help. //
// ====================================================================================================== //
gulp.task("default", ["help"]);

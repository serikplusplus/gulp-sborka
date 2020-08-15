//npm init
//npm i gulp --save-dev
//npm i browser-sync --save-dev
//npm i gulp-file-include --save-dev
//npm i del --save-dev
//npm i gulp-sass --save-dev
//npm i gulp-autoprefixer --save-dev
//npm i gulp-group-css-media-queries --save-dev
//npm i gulp-clean-css --save-dev
//npm i gulp-rename --save-dev
//npm i gulp-uglify-es --save-dev
//npm i gulp-imagemin --save-dev
//npm i gulp-webp --save-dev
//npm i gulp-webp-html --save-dev
//npm i gulp-webp-css --save-dev
//npm i --save-dev gulp-ttf2woff gulp-ttf2woff2 
//npm i gulp-fonter --save-dev


let progect_folder = require('path').basename(__dirname);
let sourse_folder = "#src";
let fs = require('fs');

let path = {
  build: {
    html: progect_folder + "/",
    css: progect_folder + "/css/",
    js: progect_folder + "/js/",
    img: progect_folder + "/img/",
    fonts: progect_folder + "/fonts/",
  },
  src: {
    html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
    css: sourse_folder + "/scss/style.scss",
    js: sourse_folder + "/js/script.js",
    img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: sourse_folder + "/fonts/*.ttf",
  },
  watch: {
    html: sourse_folder + "/**/*.html",
    css: sourse_folder + "/scss/**/*.scss",
    js: sourse_folder + "/js/**/*.js",
    img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + progect_folder + "/"
}

let {
  src,
  dest
} = require('gulp');
let gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require(' gulp-clean-css'),
  rename = require(' gulp-rename'),
  uglify = require('gulp-uglify-es').default(),
  imagemin = require(' gulp-imagemin'),
  webp = require(' gulp-webp'),
  webp_html = require(' gulp-webp-html'),
  webp_css = require(' gulp-webp-css'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter');


function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + progect_folder + "/"
    },
    port: 3000,
    notify: false

  })
}


function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webp_html())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css(params) {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(group_media())
    .pipe(webp_css())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}


function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        interlaced: true,
        optimizationLevel: 3
      }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts(params) {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}




gulp.task('otf', function (params) {
  return src([sourse_folder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ['ttf']
      })
    )
    .pipe(dest(sourse_folder + '/fonts/'))
})


function clean(params) {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
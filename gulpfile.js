const { src, dest, watch, series } = require( 'gulp' )
    , sass         = require( 'gulp-sass' )
    , autoprefixer = require( 'gulp-autoprefixer' )
    , babel        = require( 'gulp-babel' )
    , concat       = require( 'gulp-concat' )
    , uglify       = require( 'gulp-uglify' )
    , ts           = require( 'gulp-typescript' )
    , favicons     = require( 'gulp-favicons' )
    , webp         = require( 'gulp-webp' )
    , livereload   = require( 'gulp-livereload' )


const srcPath = {
    fonts     : 'source/fonts'  ,
    images    : 'source/images' ,
    scripts   : 'source/scripts',
    styles    : 'source/styles' ,
    typescript: 'source/typescript',
    root      : 'source'
}

const destPath = {
    styles : 'html/design/styles' ,
    fonts  : 'html/design/fonts'  ,
    images : 'html/design/images' ,
    scripts: 'html/design/scripts',
    root   : 'html'
}


/**
 * Generate favicons for all devices.
 * @param {function} callback 
 */
function favico ( callback ) {
    const settings = {
        appName: "PL App",
        appShortName: "PL App",
        appDescription: "This is an App created with pl-boilerplate",
        developerName: "César Mejía",
        developerURL: "http://cesarmejia.me/",
        background: "#020307",
        path: "/favicons",
        url: "http://cesarmejia.me/",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/?homescreen=1",
        version: 1.0,
        logging: false,
        html: `${ destPath }/index.html`,
        pipeHTML: true,
        replace: true,
        icons: {
            android: false,
            appleIcon: true,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: false,
            twitter: false,
            windows: false,
            yandex: false
        }
    }

    return src( `${ srcPath.root }/favicon.png` )
        .pipe( favicons( settings ) )
        .pipe( dest(`${ destPath.root }/favicons`) )
}


/**
 * Copy fonts to production folder.
 * @param {function} callback 
 */
function fonts ( callback ) {
    const files = `${ srcPath.fonts }/*.{eot,woff,woff2,ttf,svg,otf}`

    return src( files )
        .pipe( dest( `${ destPath.fonts }` ) )
}


/**
 * Copy images to production folder.
 * @param {function} callback 
 */
function images ( callback ) {
    const files = `${ srcPath.images }/**.{jpg,jpeg,png,svg,webp}`

    return src( files )
        .pipe( dest( `${ destPath.images }` ) )
}


/**
 * Compiles ts files to generate production scripts.
 * @param {function} callback 
 */
function scripts ( callback ) {
    const files = [
        `!${ srcPath.scripts }/vendor`,
        `${ srcPath.scripts }/scripts.js`,
        `${ srcPath.scripts }/data.js`,
        `${ srcPath.scripts }/configurador.js`
    ]

    const opts = {
        presets: ['@babel/env']
    }

    return src( files )
        .pipe( concat('scripts.min.js') )
        .pipe( babel( opts ) )
        .pipe( uglify( ) )
        .pipe( dest( `${ destPath.scripts }` ) )
}


/**
 * Compiles sass files to generate production styles.
 * @param {function} callback 
 */
function styles (callback) {
    const files = [
        `!${ srcPath.styles }/vendor`,
        `${ srcPath.styles }/styles.scss`
    ]

    const sassSettings = {
        outputStyle: 'compressed'
    }

    const autoprefixerSettings = {
        cascade: false
    }

    return src( files )
        .pipe( sass( sassSettings ) )
        .pipe( autoprefixer( autoprefixerSettings ) )
        .pipe( dest( `${ destPath.styles }` ) )
}


/**
 * Compiles ts files to generate production scripts.
 * @param {function} callback 
 */
function typescript (callback) {
    const files = [
        `${ srcPath.typescript }/core/**/*.ts`,
        `${ srcPath.typescript }/util/**/*.ts`,
        `${ srcPath.typescript }/*.ts`
    ]

    const settings = {
        allowJs: true,
        module: 'amd',
        noImplicitAny: false,
        outDir: `${ destPath.scripts }`,
        outFile: `pl.js`,
        rootDir: `${ srcPath.typescript }`,
        sourceMap: true,
        target: 'ES5'
    }

    return src( files )
        .pipe( ts( settings ) )
        .pipe( uglify( ) )
        .pipe( dest( `${ destPath.scripts }` ) )
}


/**
 * Copy scripts to production folder.
 * @param {function} callback
 */
function vendorStyles (callback) {
    const files = [
        `${ srcPath.styles }/vendor/**/*.*`
    ]

    return src ( files )
        .pipe( dest( `${ destPath.styles }/vendor` ) )
}


/**
 * Copy styles to production folder.
 * @param {function} callback
 */
function vendorScripts (callback) {
    const files = [
        `${ srcPath.scripts }/vendor/**/*.*`
    ]

    return src ( files )
        .pipe( dest( `${ destPath.scripts }/vendor` ) )
}


/**
 * Handle watch event.
 * @param {function} callback 
 */
function watcher ( callback ) {
    const files = [
        `${ srcPath.fonts }/**/*.{otf,ttf,woff,svg}`,
        `${ srcPath.imgs }/**/*.{jpg,jpeg,svg,png}`,
        `${ srcPath.styles }/**/*.scss`,
        `${ srcPath.scripts }/**/*.js`
    ]

    livereload.listen()

    return watch( files, series( styles, scripts ) )
}


/**
 * Copy images to production folder.
 * @param {function} callback 
 */
function webpImages ( callback ) {
    const files = `${ srcPath.images }/**/*.{jpg,jpge,png,tiff,webp}`

    return src( `${ files }` )
        .pipe( webp(  ) )
        .pipe( `${ destPath.images }` )

}


exports.favico        = favico
exports.fonts         = fonts
exports.images        = images
exports.scripts       = scripts
exports.styles        = styles
exports.typescript    = typescript
exports.vendorScripts = vendorScripts
exports.vendorStyles  = vendorStyles
exports.watcher       = watcher
exports.webpImages    = webpImages

exports.build = series( favico, fonts, images, scripts, styles, typescript, vendorScripts, vendorStyles )

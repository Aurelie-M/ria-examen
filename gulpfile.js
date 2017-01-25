/* auré/ria-examen
 *
 * /gulpfile - gulp tasks
 *
 * coded by auré
 * started at 24/01/2017
 */

/* eslint-disable */

"use strict";

var sUser = process.env.USER,
    gulp = require( "gulp" ),
    gSass = sUser !== "vagrant" && require( "gulp-sass" ), // cf. NOTE below
    gEslint = require( "gulp-eslint" ),
    gBabel = require( "gulp-babel" ),
    gUtil = require( "gulp-util" ),
    Mongo = require( "mongodb" ),
    browserify = require( "browserify" ),
    babelify = require( "babelify" ),
    sourceStream = require( "vinyl-source-stream" ),
    buffer = require( "vinyl-buffer" ),
    gRename = require( "gulp-rename" ),
    gUglify = require( "gulp-uglify" ),
    ObjectID = Mongo.ObjectID,
    MongoClient = Mongo.MongoClient;

if ( sUser === "vagrant" ) {
    gulp.task( "reset-db", function( fNext ) {
        MongoClient.connect( "mongodb://127.0.0.1:27017/ria-examen", function( oError, oDB ) {
            var fDataParser;

            if ( oError ) {
                gUtil.beep();
                return fNext( oError );
            }

            fDataParser = function( oElement ) {
                oElement.slug = new ObjectID( oElement.slug);
                if ( oElement.quick && oElt.quick.slug ) {
                    oElement.quick = new ObjectID( oElement.quick.slug );
                }

                return oElement;
            };

            oDB
                .dropDatabase()
                .then( function() {
                    return oDB.collection( "quicks" ).insertMany( require( __dirname + "/data/quicks.json" ).map( fDataParser ) );
                } )
                .then( function() {
                    oDB.close();
                    gUtil.log( gUtil.colors.green( "DB has been resetted." ) );
                    fNext();
                } )
                .catch( function( oError ) {
                    oDB.close();
                    fNext( oError );
                } );
        } );
    } );

    return;
}

gulp.task( "style", function() {
    return gulp
        .src( "static/sass/** *.scss" )
        .pipe( gSass( {
            "includePaths": [
                require( "bourbon" ).includePaths,
            ],
        } ).on( "error", gSass.logError ) )
        .pipe( gulp.dest( "static/css" ) )
} );

gulp.task( "eslint", function() {
    return gulp
        .src( [ "src/** *.js", "static/modules/**/*.js" ] )
        .pipe( gEslint() )
        .pipe( gEslint.format() );
} );

gulp.task( "build", function() {
    return gulp
        .src( "src/**/*.js" )
        .pipe( gBabel() )
        .pipe( gulp.dest( "bin" ) );
} );

gulp.task( "views", function() {
    return gulp
        .src( "src/views/**" )
        .pipe( gulp.dest( "bin/views" ) );
} );

gulp.task( "modules", function() {
    browserify( "static/modules/main.js" )
        .transform( babelify, {
            "presets": [ "es2015" ],
        } )
        .bundle()
        .pipe( sourceStream( "app.js" ) )
        .pipe( gulp.dest( "static/js/" ) )
        .pipe( buffer() )
        .pipe( gRename( "app.min.js" ) )
        .pipe( gUglify().on( "error", console.log ) )
        .pipe( gulp.dest( "static/js/" ) );
} );

gulp.task( "watch", function() {
    gulp.watch( "src/**/*.js", [ "build" ] );
    gulp.watch( "src/views/**", [ "views" ] );
    gulp.watch( "static/sass/**/*.scss", [ "style" ] );
    gulp.watch( "static/modules/**/*.js", [ "modules" ] );
} );

gulp.task( "default", [ "build", "views", "style", "modules"  ] );

gulp.task( "work", [ "default", "watch" ] );

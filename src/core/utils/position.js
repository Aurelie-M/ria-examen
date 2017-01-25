/* auré/ria-examen
 *
 * /src/core/utils/position.js - Quick position
 *
 * coded by auré
 * started at 24/01/2017
 */

export default function( iLatitude, iLongitude ) {

    // latitude and longitude are numbers
    if ( isNaN( iLatitude ) || isNaN( iLongitude ) ) {
        return false;
    }


    if ( iLatitude < -150 || iLatitude > 150 ) {
        return false;
    }

    if ( iLongitude < -150 || iLongitude > 150 ) {
        return false;
    }

    return {
        "latitude": iLatitude,
        "longitude": iLongitude,
    };
}
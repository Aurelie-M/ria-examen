/* auré/ria-examen
 *
 * /src/controllers/quicks/list.js - Controllers for quicks list
 *
 * coded by auré
 * started at 24/01/2017
 */

import getQuicks from "../../models/quicks";
import { send, error } from "../../core/utils/api";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";

const ARC_KILOMETER = 0.1, 
    DEFAULT_RADIUS = 1,
    MAX_RADIUS = 15;

export default function( oRequest, oResponse ) {

    let oCurrentPosition = checkPosition( +oRequest.query.latitude, +oRequest.query.longitude ),
        iSearchRadius = +oRequest.query.radius;

    if ( !oCurrentPosition ) {
        return error( oRequest, oResponse, "Invalid position!", 400 ); // bad request
    }

    // check if it's a number
    isNaN( iSearchRadius ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius < DEFAULT_RADIUS ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius > MAX_RADIUS ) && ( iSearchRadius = MAX_RADIUS );

    iSearchRadius *= ARC_KILOMETER;

    getQuicks()
        .find( {
            "latitude": {
                "$gt": oCurrentPosition.latitude - iSearchRadius,
                "$lt": oCurrentPosition.latitude + iSearchRadius,
            },
            "longitude": {
                "$gt": oCurrentPosition.longitude - iSearchRadius,
                "$lt": oCurrentPosition.longitude + iSearchRadius,
            },
        } )
        .toArray()
        .then( ( aQuicks = [] ) => {
            let aCleanQuicks,
                aQuicksToReset = [];

            aCleanQuicks = aQuicks.map( ( { slug, name, address, latitude, longitude, empty } ) => {
                let bEmptyState = empty; // eslint-disable-line id-match

                return {
                    slug, name, address, 
                    "distance": distance( oCurrentPosition, { latitude, longitude } ) * 1000,
                    "empty": bEmptyState,
                };
            } );

            getQuicks()
                .update( {
                    "slug": { "$in": aQuicksToReset },
                }, {
                    "$set": { "empty": false },
                } );

            // sort by distance
            aCleanQuicks.sort( ( oQuickOne, oQuickTwo ) => oQuickOne.distance - oQuickTwo.distance );

            send( oRequest, oResponse, aCleanQuicks );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
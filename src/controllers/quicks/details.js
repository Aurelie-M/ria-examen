/* auré/ria-examen
 *
 * /src/controllers/quicks/details.js - Controller for quicks details
 *
 * coded by auré
 * started at 24/01/2017
 */

import getQuicks from "../../models/quicks";
import { send, error } from "../../core/utils/api";
import { ObjectID } from "mongodb";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";

export default function( oRequest, oResponse ) {

    let sQuickSlug = ( oRequest.params.slug || "" ).trim(),
        oCurrentPosition;

    if ( !sQuickSlug ) {
        error( oRequest, oResponse, "Invalid slug!", 400 ); // bad request
    }

    oCurrentPosition = checkPosition( +oRequest.query.latitude, +oRequest.query.longitude );

    getQuicks()
        .findOne( {
            "slug": new ObjectID( sQuickSlug ),
        } )
        .then( ( oQuick ) => {
            if ( !oQuick ) {
                return error( oRequest, oResponse, "Unknown Quick", 404 ); // not found
            }

            let { slug, name, address, latitude, longitude, hours, empty /*"open" = true*/} = oQuick,
                oCleanQuick;

            // open or close
           /* if(hours[i] > hours.[0] && hours[i] < hours[1] ){
                    return "open" = true;
            }
            return "fermé" = false; */

            oCleanQuick = {
                slug, name, address, latitude, longitude, hours,
                "empty": !!empty,
                /*"open": true,*/
            };

            if ( oCurrentPosition ) {
                oCleanQuick.distance = distance( oCurrentPosition, oCleanQuick ) * 1000;
            }

            send( oRequest, oResponse, oCleanQuick );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}

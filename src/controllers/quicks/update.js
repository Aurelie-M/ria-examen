/* auré/ria-examen
 *
 * /src/controllers/quicks/update.js - Controller for quick update
 *
 * coded by auré
 * started at 24/01/2017
 */

import { ObjectID } from "mongodb";

import getQuicks from "../../models/quicks";
import { checkQuick } from "../../models/quicks";
import { send, error } from "../../core/utils/api";
import checkPosition from "../../core/utils/position";
import distance from "jeyo-distans";


const MAX_DISTANCE = 0.1; // km

export default function( oRequest, oResponse ) {

    const POST = oRequest.body;

    // values to change
    let oQuickSlug,
        sAddress = ( POST.address || "" ).trim(),
        iLatitude = POST.latitude,
        iLongitude = POST.longitude,
        aHours = (POST.hours || "").trim(),
        bEmpty = !!POST.empty,       
        aModifications = [],
        oPosition;

    try {
        oQuickSlug = new ObjectID( oRequest.params.slug );
    } catch ( oError ) {
        return error( oRequest, oResponse, new Error( "Invalid slug!" ), 400 ); // 400 = bad request
    }

    // quick exists?

    getQuicks()
        .findOne( {
            "slug": oQuickSlug,
        } )
        .then( ( oQuick ) => {
            if ( !oQuick ) {
                return error( oRequest, oResponse, new Error( "Unknown Quick" ), 404 ); // 404 = not found
            }


            // values are ok ?

            // latitude, longitude
            if ( iLatitude != null && iLongitude != null ) {
                oPosition = checkPosition( +iLatitude, +iLongitude );
                if ( !oPosition ) {
                    return error( oRequest, oResponse, new Error( "Invalid position" ), 400 ); // bad request
                }

                // position changed => new distance
                if ( oQuick.latitude !== oPosition.latitude || oQuick.longitude !== oPosition.longitude ) {
                    if ( distance( oPosition, oQuick ) > MAX_DISTANCE ) {
                        return error( oRequest, oResponse, new Error( "Movement is too big" ), 400 ); // bad request
                    }
                    oQuick.latitude = oPosition.latitude;
                    oQuick.longitude = oPosition.longitude;
                    aModifications.push( "latitude", "longitude" ); // apply modification
                }
            }

            // Address
            if ( sAddress ) {
                oQuick.address = sAddress;
                aModifications.push( "address" ); // apply modification
            }

            // Hours
            if(aHours){
                oQuick.hours = aHours;
                aModifications.push("hours"); // apply modification
            }

            // empty ?
            if ( bEmpty ) {
                oQuick.empty = true;
                aModifications.push( "empty" ); // apply modification
            }

            // Quick changed => change Quick
            return checkQuick( sQuickSlug ).then( ( bHasQuick ) => {
                let oModificationsToApply = {};

                if ( bHasQuick ) {
                    oQuick.slug = new ObjectID( sQuickSlug );
                    aModifications.push( "slug" ); // apply modification
                }

                if ( aModifications.length === 0 ) {
                    return error( oRequest, oResponse, new Error( "No changes" ), 400 ); // bad request
                }

                aModifications.forEach( ( sName ) => {
                    oModificationsToApply[ sName ] = oQuick[ sName ];
                } );

                return getQuicks()
                    .updateOne( {
                        "slug": oQuick.slug,
                    }, {
                        "$set": oModificationsToApply,
                    } )
                    .then( ( { matchedCount, modifiedCount } ) => {
                        if ( matchedCount !== 1 || modifiedCount !== 1 ) {
                            return error( oRequest, oResponse, new Error( "Unknown save error" ), 500 ); // internal server error
                        }

                        return send( oRequest, oResponse, null, 204 ); // no content
                    } );
            } );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}

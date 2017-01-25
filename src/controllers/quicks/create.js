/* auré/ria-examen
 *
 * /src/controllers/quicks/create.js - Create quick controller
 *
 * coded by auré
 * started at 24/01/2017
 */

import { ObjectID } from "mongodb";

import getQuicks from "../../models/quicks";
import { checkQuick } from "../../models/quicks";
import { send, error } from "../../core/utils/api";
import checkPosition from "../../core/utils/position";

export default function( oRequest, oResponse ) {

    const POST = oRequest.body;

    let sQuickSlug = ( POST.slug || "" ).trim(),
        sName = ( POST.name || "" ).trim(),
        sAddress = ( POST.address || "" ).trim(),
        aHours = ( POST.hours || "" ),
        iLatitude = +POST.latitude,
        iLongitude = +POST.longitude,
        oPosition = checkPosition( iLatitude, iLongitude ),
        oQuick, fCreateQuick;

    // status 400 = bad request => some modifications
    if ( !oPosition ) {
        return error( oRequest, oResponse, "Invalid position", 400 );
    }

    // latitude, longitude
    oQuick = {
        "latitude": oPosition.latitude,
        "longitude": oPosition.longitude,
    };

    // address
    sAddress && ( oQuick.address = sAddress );

    // slug
    fCreateQuick = ( bHasQuick ) => {
        if ( bHasQuick ) {
            oQuick.quick = new ObjectID( sQuickSlug );
        }

        return getQuicks().insertOne( oQuick );
    };

    // name
    sName && (oQuick.name = sName);

    // hours
    aHours && (oQuick.hours = aHours);

    // create a quick
    checkQuick( sQuickSlug )
        .then( fCreateQuick )
        .then( () => {
            send( oRequest, oResponse, {
                "slug": oQuick.slug,
                "name": oQuick.name || null,
                "address": oQuick.address || null,
                "hours": oQuick.hours || null,
                "latitude": oQuick.latitude,
                "longitude": oQuick.longitude,
            }, 201 ); // status 201 = create a new quick
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );

}

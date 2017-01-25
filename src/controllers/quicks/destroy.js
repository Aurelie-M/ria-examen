/* auré/ria-examen
 *
 * /src/controllers/quicks/destroy.js - Delete quick controller
 *
 * coded by auré
 * started at 24/01/2017
 */

import { ObjectID } from "mongodb";
import { send, error } from "../../core/utils/api";
import getQuicks from "../../models/quicks";

export default function( oRequest, oResponse ) {

    let oQuickSlug;

    try {
        oQuickSlug = new ObjectID( oRequest.params.slug );
    } catch ( oError ) { // status 400 = bad request
        return error( oRequest, oResponse, new Error( "Invalid slug!" ), 400 );
    }

    getQuicks()
        .deleteOne( {
            "slug": oQuickSlug,
        } )
        .then( ( { deletedCount } ) => {
            if ( deletedCount === 1 ) {
                return send( oRequest, oResponse, null, 204 ); // status 204 = no content
            }

            return error( oRequest, oResponse, "Unknown deletion error", 500 ); // status 500 = internal server error
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}

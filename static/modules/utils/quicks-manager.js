/* auré/ria-examen
 *
 * /static/modules/utils/quicks-manager.js - Quicks manager utility
 *
 * coded by auré
 * started at 24/01/2017
 */

import reqwest from "reqwest";

let oQuicks = {};

export default function( sQuickSlug = null ) {
    if ( sQuickSlug && oQuicks[ sQuickSlug ] ) {
        return oQuicks[ sQuickSlug ];
    }

    return reqwest( {
        "url": "/quicks",
        "method": "get",
        "data": {
            slug, name, address, longitude, latitude, hours, 
        },
    } )
        .then( ( oResponse ) => {
            for ( let oQuick of oResponse.data ) {
                oQuicks[ oQuick.slug ] = oQuick;
            }

            return oQuicks[ sQuickSlug ] || null;
        } );
}

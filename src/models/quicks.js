/* auré/ria-examen
 *
 * /src/models/quicks.js - Model for quicks
 *
 * coded by auré
 * started at 24/01/2017
 */

import Promise from "bluebird";
import { db } from "../core/mongodb";
import { ObjectID } from "mongodb";

let fCheckQuick;

fCheckQuick = function( sQuickSlug ) {
    let oQuickSlug;

    if ( !sQuickSlug ) {
        return Promise.resolve( false );
    }

    try {
        oQuickSlug = new ObjectID( sQuickSlug );
    } catch ( oError ) {
        return Promise.reject( new Error( "Invalid Quick Slug!" ) );
    }

    return db.collection( "quicks" )
        .findOne( {
            "slug": oQuickSlug,
        } )
        .then( ( oQuick ) => {
            if ( oQuick ) {
                return Promise.resolve( true );
            }

            return Promise.reject( new Error( "Unknown Quick!" ) );
        } );
};

export default function() {
    return db.collection( "quicks" );
}

export {
    fCheckQuick as checkQuick,
};

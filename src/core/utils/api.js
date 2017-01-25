/* auré/ria-examen
 *
 * /src/core/utils/api.js - API
 *
 * coded by auré
 * started at 24/01/2017
 */

let fSend, fError;

// when we send the request
// status 200 = ok
fSend = function( oRequest, oResponse, oData = {}, iStatus = 200 ) {
    oResponse.status( iStatus ).json( {
        "url": `[${ oRequest.method }] ${ oRequest.url }`,
        "timestamp": Date.now(),
        "data": oData,
        "error": false,
    } );
};

// when there is an error
// status 500 = a bad thing
fError = function( oRequest, oResponse, mError, iStatus = 500 ) {
    oResponse.status( iStatus ).json( {
        "url": `[${ oRequest.method }] ${ oRequest.url }`,
        "timestamp": Date.now(),
        "data": null,
        "error": mError instanceof Error ? mError.message : mError,
    } );
};

export {
    fSend as send,
    fError as error,
};

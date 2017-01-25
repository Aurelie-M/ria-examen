/* auré/ria-examen
 *
 * /src/controllers/system/error.js - Controller for system error
 *
 * coded by auré
 * started at 24/01/2017
 */

import { error } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    error( oRequest, oResponse, { "message": "There is an error!" } );
}
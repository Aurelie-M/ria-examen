/* auré/ria-examen
 *
 * /src/controllers/system/echo.js - Controller for system echo
 *
 * coded by auré
 * started at 24/01/2016
 */

import { send } from "../../core/utils/api";
 
export default function(oRequest, oResponse) {
    let sEcho = oRequest.query.echo || "Hello ! ";

    send( oRequest, oResponse, sEcho );
}
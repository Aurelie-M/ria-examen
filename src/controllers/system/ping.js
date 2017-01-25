/* auré/ria-examen
 *
 * /src/controllers/system/ping.js - Controller for system ping
 *
 * coded by auré
 * started at 24/01/2017
 */

import { send } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    send( oRequest, oResponse, true );
}
/* auré/ria-examen
 *
 * /src/server.js - main entry point
 *
 * coded by auré
 * started at 24/01/2017
 */

import { init as initDB } from "./core/mongodb";
import { init as initExpress } from "./core/express";

const APP_PORT = 56789;

initDB()
    .then( () => initExpress( APP_PORT ) );

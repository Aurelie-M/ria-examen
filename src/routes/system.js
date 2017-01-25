/* auré/ria-examen
 *
 * /src/routes/system.js - System routes
 *
 * coded by auré
 * started at 24/01/2017
 */

import { Router } from "express";

import systemPingController from "../controllers/system/ping";
import systemEchoController from "../controllers/system/echo";
import systemErrorController from "../controllers/system/error";

let oRouter = new Router();

oRouter.get( "/system/ping", systemPingController );
oRouter.get( "/system/echo", systemEchoController );
oRouter.get( "/system/error", systemErrorController );

export default oRouter;
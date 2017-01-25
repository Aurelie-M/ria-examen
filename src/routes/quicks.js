/* auré/ria-examen
 *
 * /src/routes/quicks.js - API Routes for quicks
 *
 * coded by auré
 * started at 24/01/2017
 */

import { Router } from "express";
import list from "../controllers/quicks/list";
import details from "../controllers/quicks/details";
import create from "../controllers/quicks/create";
import update from "../controllers/quicks/update";
import destroy from "../controllers/quicks/destroy";

let oRouter = new Router();

oRouter.get( "/quicks", list );
oRouter.get( "/quicks/:slug", details );
oRouter.post( "/quicks", create );
oRouter.patch( "/quicks/:slug", update );
oRouter.delete( "/quicks/:slug", destroy );

export default oRouter;

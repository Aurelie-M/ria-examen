/* auré/ria-examen
 *
 * /src/routes/pages.js - Pages routes
 *
 * coded by auré
 * started at 24/01/2017
 */

import { Router } from "express";

import homepageController from "../controllers/pages/home";

let oRouter = new Router();

oRouter.get( "/", homepageController );

export default oRouter;

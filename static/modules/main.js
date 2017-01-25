/* auré/ria-examen
 *
 * /static/modules/main.js - Main entry file
 *
 * coded by auré
 * started at 24/01/2017
 */

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use( VueRouter );

import QuicksList from "./components/quicks/list";
import QuicksDetails from "./components/quicks/details";

let oRouter, oApp;

oRouter = new VueRouter( {
    "routes": [
        { "path": "/", "component": QuicksList },
        { "path": "/slug", "component": QuicksDetails },
    ],
} );

oApp = new Vue( {
    "template": `
        <div class="content">
            <header>
                <h1> Examen RIA - Quick </h1>
            </header>
            <main>
                <router-view> </router-view>
            </main>
            <footer>
                <p> Auré 2384 </p>
            </footer>
        </div>
    `,
    "router": oRouter,
} );

oApp.$mount( "#app" );

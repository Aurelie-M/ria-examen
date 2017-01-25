/* auré/ria-examen
 *
 * /static/modules/components/quicks/list.js - Quicks list Vue component
 *
 * coded by auré
 * started at 24/01/2017
 */

import Vue from "vue";
import reqwest from "reqwest";

import getLocation from "../../utils/location-manager.js";
import getQuick from "../../utils/quicks-manager.js";

let oQuicksList = Vue.component( "list", {
    "data": function() {
        return {
            "loaded": false,
            "quicks": [],
            "error": null,
        };
    },
    "template": `
        <div class="list">
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <ul v-if="loaded">
                <li v-for="elt in quicks">
                    <router-link :to="'/' + elt.slug">
                        <div class="right">
                            <ul class="list-info">
                                <li class="item-info"> 
                                    <strong> {{ elt.quick ? elt.quick.name : "Unknown" }} </strong>
                                </li>
                                <li class="item-info"> <p> {{ elt.slug }} </p> </li>
                                <li class="item-info"> <address> {{ elt.address }} </address> </li>
                                <li class="item-info"> <p> {{ elt.distance }} m </p> </li>
                                <li class="item-info"> <p> Heures ouverture </p> </li>
                            </ul>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    `,
    mounted() {
        return getQuick()
            .then( this.updatePosition )
            .catch( this.showError );
    },
    "methods": {
        updatePosition() {
            return getLocation()
                .then( ( { coords } ) => {
                    return reqwest( {
                        "url": "/quicks",
                        "method": "get",
                        "data": {
                            "latitude": coords.latitude,
                            "longitude": coords.longitude,
                        },
                    } );
                } )
                .then( ( oResponse ) => {
                    this.loaded = true;
                    this.quicks = oResponse.data.map( ( oQuick ) => {
                        return oQuick;
                    } );
                } )
                .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oQuicksList;

/* auré/ria-examen
 *
 * /static/modules/components/details.js - Quicks details vue component
 *
 * coded by auré
 * started at 24/01/2017
 */

import Vue from "vue";
import reqwest from "reqwest";
import getQuick from "../../utils/quicks-manager.js";
import getLocation from "../../utils/location-manager.js";

let oQuickDetails = Vue.component( "details", {
    "data": function() {
        return {
            "loaded": false,
            "quick": {},
            "error": null,
        };
    },
    "template": `
        <div class="details">
            <router-link to="/"> &lsaquo; retour </router-link>
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <div v-if="loaded">
                <h2>{{ quick ? quick.name : "Unknown" }}</h2>
                <address>{{ quick.address }}</address>
                <p>{{ quick.distance }}m</p>
                <p> {{ quick.hours }} </p>
            </div>
        </div>
    `,
    mounted() {
        return getQuick()
            .then( () => this.fetchInfos( this.$route.params.slug ) )
            .catch( this.showError );
    },
    "methods": {
        fetchInfos( sQuickId ) {
            return getLocation()
                .then( ( { coords } ) => {
                    return reqwest( {
                        "url": `/quicks/${ sQuickSlug }`,
                        "method": "get",
                        "data": {
                            "latitude": coords.latitude,
                            "longitude": coords.longitude,
                        },
                    } );
                } )
                .then( ( oResponse ) => {
                    let oQuick = oResponse.data;

                    this.loaded = true;
                    this.quick = oQuick;
                } )
                .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oQuickDetails;

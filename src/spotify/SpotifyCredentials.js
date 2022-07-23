/**
 * 
 * ABOUT: 
 *  SpotifyCredentials Class
 * 
 * TO DO: 
 *  Add Youtube API handler
 *  Add soundcloud API handler
 *  Change class name: 'SpotifyCredentials' to more appropriate name
 *  Implement proper error handling
 *  Clean up promise handling
 * 
 */
require('dotenv').config({path: 'src/configs/.env'});
const SpotifyWebApi = require("spotify-web-api-node");
var {
    refreshTokenExists,
    loadCredentials,
    saveCredentials
} = require("./io_helpers");

require('dotenv').config();

//extends spotifyApi
class SpotifyCredentials extends SpotifyWebApi {

    constructor() {
        super({
            redirectUri: ("http://" + process.env.HOST + ":" + process.env.PORT + "/api/auth/callback"),
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            scope: JSON.parse(process.env.LIST_SCOPE),
            state: process.env.STATE
   
        });
    }

    async setCredentials(){
        if (refreshTokenExists()) {
            console.log("Info: Fetching refresh token from file")
            this.loadRefreshToken();
        } else {
            console.log("Info: Fetching refresh token from Spotify")
            this.setRedirectURL();
        }
    }

    // ********************** SPOTIFY API SETTERS & GETTERS **********************

    setRedirectURL() {
        this._credentials.setRedirectURL = (this.createAuthorizeURL(JSON.parse(process.env.LIST_SCOPE), process.env.STATE));
        console.log("WARNING: Admin authorization required");
    }
    getRedirectURL() {
        console.log("in here");
        if (this._credentials.setRedirectURL == undefined) {
            console.log("returning /api/" );
            return '/api/';
        }
        return this._credentials.setRedirectURL;
    }
    
    async setTokens(code) {

        this.authorizationCodeGrant(code, (err, data) => {

            if (err) 
                throw(err);
            
            saveCredentials(data.body['refresh_token']);
            this.setAccessToken(data.body['access_token']);
            this.setRefreshToken(data.body['refresh_token']);
            console.log("INFO: Refresh token fetched from spotify.");

        });
        return([200, '/']);
    }


    async loadRefreshToken() {
        console.log("loading refresh token");
        try {
            var creds = await loadCredentials()
            var data = await this.setRefreshToken(creds);
            data = await this.refreshAccessToken();
            this.setAccessToken(data.body['access_token'])
            console.log("INFO: Refresh token fetched from file.");
            return([200, '/']);
        } catch (e) {
            throw(e);
        }
    }

/** 
    async loadRefreshToken() {

        loadCredentials()
            .then((data, this) => this.setRefreshToken(data))
            .then(() => refreshAccessToken())
            .then((data) => setAccessToken(data.body['access_token']))
            .catch((e)=> {throw e});

    }
*/
}

module.exports = SpotifyCredentials

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
        if (refreshTokenExists()) {
            console.log("HERE");
            this.loadRefreshToken();
        } else {
            this.setRedirectURL();
        }
        console.log("INITIAL API STATUS: \n" + JSON.stringify(this));
    }

    // ********************** SPOTIFY API SETTERS & GETTERS **********************

    setRedirectURL() {
        this._credentials.setRedirectURL = (this.createAuthorizeURL(JSON.parse(process.env.LIST_SCOPE), process.env.STATE));
    }
    getRedirectURL() {
        if (this._credentials.setRedirectURL == undefined) {
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

        });
        return([200, '/']);
    }


    async loadRefreshToken() {
        try {
            var creds = await loadCredentials()
            var data = await this.setRefreshToken(creds);
            data = await this.refreshAccessToken();
            this.setAccessToken(data.body['access_token'])
            console.log(JSON.stringify(this));
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

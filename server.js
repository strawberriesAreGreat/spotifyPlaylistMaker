// server root
require('dotenv').config();
const PORT = process.env.PORT || 8888;

const SpotifyCredentials = require('./src/spotify/SpotifyCredentials');
var express = require("express");
var router = require('./src/routes/router')
var dataBase = require('./src/db/nedb');
const request = require('request');

const app = express();
app.use('/api', router);

// Set up spotify credentials
app.locals.spotifyCredentials = new SpotifyCredentials();
console.log(app.locals.spotifyCredentials );





app.locals.spotifyCredentials.setCredentials();


    // Set up database 
    dataBase.startDB().then((resp)=>{
        app.locals.db = resp;
    })



// Launch time baby!!!!
app.listen(PORT, function () {
    console.log(`Server listening on ` + PORT);
});

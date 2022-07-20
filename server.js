// server root
require('dotenv').config();
const PORT = process.env.PORT || 8888;

const SpotifyCredentials = require('./src/spotify/SpotifyCredentials');
var express = require("express");
var router = require('./src/routes/router')
var dataBase = require('./src/db/nedb');

const app = express();

// Set up spotify credentials
app.locals.spotifyCredentials = new SpotifyCredentials();

// Set up database 
dataBase.startDB().then((resp)=>{
    app.locals.db = resp;
});


app.use('/api', router);

// Launch time baby!!!!
app.listen(PORT, function () {
    console.log(`Server listening on ` + PORT);
});

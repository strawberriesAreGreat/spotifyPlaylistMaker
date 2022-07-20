/** Playlist managment
 * 
 * /api/auth/
 * 
 * 
 * 
 * 
*/
const SpotifyWebApi = require("spotify-web-api-node");
var express = require('express');
var router = express.Router();


//add song to playlist
router.get('/authorize', (req, res, next) => {
    res.redirect( req.app.locals.spotifyCredentials.getRedirectURL() );
});

router.get('/callback', (req, res, next) => {
    
    req.app.locals.spotifyCredentials.setTokens(req.query.code).then((redirect,err)=>{
        if(err) throw err;
        res.redirect(redirect[0], redirect[1]);
    })

});

;




module.exports = router;
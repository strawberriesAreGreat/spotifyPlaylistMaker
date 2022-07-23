var express = require('express')
var router = express.Router({mergeParams: true});

var auth_router = require('./auth_router.js');
var playlist_router = require('./playlist_router.js');
var song_router = require('./song_router.js');


// var playlists = require('./playlists');
// var songs = require('./songs');

router.use('/auth', auth_router);
router.use('/playlists', playlist_router);
router.use('/playlists/:group_id/songs/', song_router);
router.get('/', function (req, res) {
    res.send('Hmmm....')
});


module.exports = router;

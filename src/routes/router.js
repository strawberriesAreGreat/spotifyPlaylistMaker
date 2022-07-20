var express = require('express')
var router = express.Router({mergeParams: true});

var auth_router = require('./auth_routers.js');
var playlists_router = require('./playlists_routers.js');


// var playlists = require('./playlists');
// var songs = require('./songs');

router.use('/auth', auth_router);
router.use('/playlists', playlists_router);
router.get('/', function (req, res) {
    res.send('Hmmm....')
});


module.exports = router;

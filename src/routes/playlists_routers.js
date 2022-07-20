/** Playlist managment
 * 
 * /api/router/{playlist_id}/
 * 
 * DELETE PUT GET 
 * 
 * 
*/
var express = require('express')
var router = express.Router({mergeParams: true});
var db = require('./../db/nedb');

// PLAYLIST EXISTS
router.get('/:server_id', (req, res) => {


    console.log("server_id " + req.params.server_id);
    res.json(req.params);

});

// ADD PLAYLIST
router.post('/', (req, res) => {
    
    const spotifyCredentials =  req.app.locals.spotifyCredentials;
    const database =  req.app.locals.db;
    const { group_name, group_id } = req.query;

    spotifyCredentials.createPlaylist(group_name)
    .then((res)=>{
        db.addPlaylist(database, group_name, group_id, res.body.uri )
    })
    .then((res)=>{    
        res.json(res);
    })
    .catch((e)=>{res.json(e)});

});

// UPDATE PLAYLIST
router.put('/', (req, res) => {

    const spotifyCredentials =  req.app.locals.spotifyCredentials;
    const database =  req.app.locals.db;
    const {uri, options} = req.query;

   spotifyCredentials.changePlaylistDetails(uri, JSON.parse(options))
    .then((res)=>{
        db.updatePlaylist(database,uri,JSON.parse(options) )
    })
    .then((res)=>{    
        res.json(res);
    })
    .catch((e)=>{res.json(e)});

});

// DELETE PLAYLIST
router.delete('/:server_id', (req, res) => {

    const spotifyCredentials =  req.app.locals.spotifyCredentials;
    const database =  req.app.locals.db;
    const {uri, options} = req.query;

   spotifyCredentials.changePlaylistDetails(uri, JSON.parse(options))
    .then((res)=>{
        db.updatePlaylist(database,uri,JSON.parse(options) )
    })
    .then((res)=>{    
        res.json(res);
    })
    .catch((e)=>{res.json(e)});

});


/* ************* to do *************

router.get('/', (req, res) => {

    console.log("playlist");
    req.params; // { userId: '42' }
    res.json(req.params);

});

// PLAYLIST SONGS
router.use('/:server_id/songs', songs_router);

*/

module.exports = router;


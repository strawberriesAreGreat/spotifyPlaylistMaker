/** Song managment
 * 
 * /api/playlists/{playlist_id}/songs/{song_id}
 * 
 * 
 * 
 * 
*/
var express = require('express')
var router = express.Router({mergeParams: true});
var Datastore = require('../db/nedb');

// Get songs in playlist
router.get('/', (req, res) => {

    req.params; // { userId: '42' }
    res.json(req.params);

});

// ADD SONG(S)
router.post('/', async (req, res) => {

    const spotifyCredentials = req.app.locals.spotifyCredentials,
        playlistDB = req.app.locals.db['playlists'],
        songsDB = req.app.locals.db['songs'],
        groupId = req.params.group_id;



    var spotifyTracks,
        statusCode,
        response,
        playlist;

    try {

        spotifyTracks = JSON.parse(req.query.spotify_tracks);
        playlist = await (Datastore.getPlaylist(playlistDB, groupId)); 

   
        if (! groupId || ! spotifyTracks) {
            statusCode = 400;
            response = "Malformed query";
        } else {

            spotifyTracks = await Datastore.addSongs(songsDB, groupId, spotifyTracks);
            console.log(spotifyTracks);
            console.log("LENGTH " + spotifyTracks.length);
            if (spotifyTracks.length > 0) 
                spotifyCredentials.addTracksToPlaylist(playlist._id, spotifyTracks)

            

            statusCode = 200;
            response = spotifyTracks;

        }
    } catch (err) {
        statusCode = 500;
        response = err;
    } finally { // Response
        res.status(statusCode).send(response);
    }


});
// REMOVE SONG(S)
router.delete('/:song_id', (req, res) => {

    console.log("server_id " + req.params.server_id + " song_Id " + req.params.song_id);
    // req.params; // { userId: '42' }
    res.json(req.params);

});


module.exports = router;

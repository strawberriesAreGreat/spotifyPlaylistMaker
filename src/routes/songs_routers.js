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

//Get songs in playlist
router.get('/', (req, res) => {

    
    req.params; // { userId: '42' }
    res.json(req.params);
    

});

//ADD SONG(S) 
router.post('/', (req, res) => {

    console.log("server_id " + req.params.server_id + " song_Id " + req.params.song_id);
  

    const spotifyCredentials = req.app.locals.spotifyCredentials,
    db = req.app.locals.db,
    groupId = req.params.group_id,
    {spotifySongs} = req.query;

    var statusCode,
        response;

    try {
        if (! groupName || ! spotifySongs) {
            statusCode = 400;
            response = "Malformed query";
        } else { 
            // Add songs to database
            if (await Datastore.addSongs(db, groupId,spotifySongs) != null) {

                statusCode = 404;
                response = "Playlist already exists for the group.";

            } else {

                await spotifyCredentials.createPlaylist(groupName).then((data) => {
                    return Datastore.addPlaylist(db, groupName, groupId, data.body.uri);
                }).then((data) => {
                    statusCode = 200;
                    response = data;
                })

            }
        }
    } catch (err) {
        statusCode = 500;
        response = err;
    } finally { // Response
        res.status(statusCode).send(response);
    }


});
//REMOVE SONG(S)
router.delete('/:song_id', (req, res) => {

    console.log("server_id " + req.params.server_id + " song_Id " + req.params.song_id);
    // req.params; // { userId: '42' }
    res.json(req.params);

});


module.exports = router;

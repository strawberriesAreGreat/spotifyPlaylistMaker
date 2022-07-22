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
var Datastore = require('./../db/nedb');

// PLAYLIST EXISTS
router.get('/:group_id', async (req, res) => { // Assigning db & group_id
    const db = req.app.locals.db,
        groupId = req.params.group_id;

    var statusCode,
        response;

    // checking if group_id is set in request
    try {

        await Datastore.getPlaylist(db, groupId).then((data) => {
            if (data == Error) {
                statusCode = 502;
            } else if (data == null) {
                statusCode = 404;
                response = "No playlist found.";
            } else {
                statusCode = 200;
                response = data;
            }
        });

    } catch (err) {
        statusCode = 500;
        response = err;
    } finally { // Response
        res.status(statusCode).send(response);
    }


}),


// ADD PLAYLIST
router.post('/', async (req, res) => {

    const spotifyCredentials = req.app.locals.spotifyCredentials,
        db = req.app.locals.db,
        groupName = req.query.group_name,
        groupId = req.query.group_id;

    var statusCode,
        response;

    try {
        if (! groupName || ! groupId) {
            statusCode = 400;
            response = "Malformed query";
        } else { 
            // Check if group already has a playlist
            if (await Datastore.getPlaylist(db, groupId) != null) {

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

// UPDATE PLAYLIST
router.put('/', async (req, res) => {

    const spotifyCredentials = req.app.locals.spotifyCredentials,
        db = req.app.locals.db, 
        {groupId, options} = req.query;

    var statusCode,
        response, 
        playlistUri;

    try {
        if (!groupId || !options) {
            statusCode = 400;
            response = "Malformed query";
        } else {
             //Trading groupId for playlistUri with database
             playlist = await Datastore.getPlaylist(db, groupId); 
             if(playlist==null){
                statusCode = 404;
                response = "No playlist found.";
            } else {
                await spotifyCredentials.changePlaylistDetails(playlist._id, JSON.parse(options))
                    .then(async() => {
                        await Datastore.updatePlaylist(db, groupId, JSON.parse(options))
                        return statusCode = 200;
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

/* ************* ROUTES TO ADD *************

// DELETE PLAYLIST 
router.delete('/:server_id', (req, res) => {


});

*/

module.exports = router;

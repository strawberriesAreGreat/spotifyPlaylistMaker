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


router.get('/', (req, res) => {

    
    req.params; // { userId: '42' }
    res.json(req.params);
    

});

//ADD SONG(S) 
router.get('/:song_id', (req, res) => {

    console.log("server_id " + req.params.server_id + " song_Id " + req.params.song_id);
    // req.params; // { userId: '42' }
    res.json(req.params);

});
//REMOVE SONG(S)
router.get('/:song_id', (req, res) => {

    console.log("server_id " + req.params.server_id + " song_Id " + req.params.song_id);
    // req.params; // { userId: '42' }
    res.json(req.params);

});

//ADD SONG BASED ON SEARCH (requires)
router.get('/SEARCH', (req, res) => {

    console.log("songs!");
    // req.params; // { userId: '42' }
    res.json(req.params);

});

module.exports = router;

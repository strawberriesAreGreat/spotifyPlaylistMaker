/**
 * ************* LITE_DB **************
 * 
 * NeDB:
 *  Embedded persistent or in memory database for Node.js
 *  https://github.com/louischatriot/nedb
 * 
 *  Used to store each group's unique playlist_uri 
 *  
 * To Add: 
 *  Add songs to DB 
 *  Add metrics to DB (relational db may be better)
 *      Group Data
 *          multiple playlists (genres or whatever)
 *          num of adds
 *          num of deletes
 *        
 *      User Data (in case of sys abuse)
 *          discord_id
 *          request
 *          num of requests   
 * 
 */

const fs = require('fs');


require('dotenv').config();

const Datastore = require('nedb'),
    // Be certain to addd any new databse tables to gitignore file
    songDB = [
        process.env.DB_PATH + 'songs.db', {
            fieldName: 'playlist_track',
            unique: true
        }
    ],
    playlistDB = [
        process.env.DB_PATH + 'playlists.db', {
            fieldName: 'group_id',
            unique: true
        }
    ];

var db;

module.exports = {

    // Load or Initialize db for server use
    startDB: async function () {

        db = await new Promise((Resolve, Reject) => {
            Resolve({playlists: playlistDB, songs: songDB});
            Reject(err);
        });

        // console.log("DB " + JSON.stringify(db));

        for (var table in db) {

            var temp = db[table];

            // Requires databases to already exist
            if (fs.existsSync(temp[0])) {
                db[table] = new Datastore({filename: temp[0], autoload: true});
                db[table].loadDatabase(function (err) {
                    if (err) {
                        console.log('FATAL: local database could not be loaded. Caused by: ' + error);
                        throw err;
                    }
                    console.log('INFO: local database ' + temp[0] + ' loaded successfully.');
                });
            } else {
                db[table] = new Datastore({filename: temp[0], autoload: true});
            }

            // Using a unique constraint with the index
            db[table].ensureIndex(temp[1], function (err) {});


        }

        return db;
    },


    // delete playlist
    addPlaylist: function (db, groupName, groupId, playlistUri) {

        playlistUri = playlistUri.split(':')[2];

        var playlist = [{

                _id: playlistUri,
                group_id: groupId,
                name: groupName,
                description: ''

            }];
        return new Promise((resolve, reject) => {
            db.insert(playlist, function (err, newDoc) {
                if (err) 
                    reject(err);
                
                // console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
                resolve(newDoc);

            });
        })
    },


    // Update name, pic, description
    updatePlaylist: function (db, groupId, options) {

        return new Promise((resolve, reject) => {
            db.update({
                group_id: groupId
            }, {
                $set: options
            }, function (err, newDoc) {
                if (err) 
                    reject(err);
                
                // console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
                resolve(newDoc);
            });
        })

    },

    getPlaylist: function (db, groupId) {

        return new Promise((resolve, reject) => {
            db.findOne({
                group_id: groupId
            }, function (err, docs) {
                if (err) 
                    reject(err);
                

                resolve(docs);
            });
        })
        // to do: double check it exists as a spotify playlist

    },

    addSongs: async function (songsDB, groupId, spotifyTracks) { // Filter out songs already added to the playlist
        var playlistTrack,
            spotifyURI,
            updatedTrackList = [];

        return await new Promise(async (resolve, reject) => {

            for (var spotifyTrack in spotifyTracks) {

                spotifyURI = spotifyTracks[spotifyTrack];
                playlistTrack = [{
                        playlist_track: ("{" + groupId + ':' + spotifyURI + "}")
                    }];

                spotifyURIStatus = await new Promise((resolve, reject) => {
                    songsDB.insert(playlistTrack, function (err) {
                        if (err) 
                            resolve();
                        
                        if (! err) {
                            resolve(spotifyURI);
                        }
                    })
                })

                if (spotifyURIStatus != undefined) 
                    updatedTrackList.push("spotify:track:" + spotifyURI);
                

            }
            resolve(updatedTrackList);
        })
    },
    
    removeSongs: async function (songsDB, groupId, spotifyTracks) {
        var playlistTrack,
            spotifyURI,
            updatedTrackList = [];
      
        return await new Promise(async (resolve, reject) => {
            for (var spotifyTrack in spotifyTracks) {

                spotifyURI = spotifyTracks[spotifyTrack];
                playlistTrack = {
                        playlist_track: ("{" + groupId + ':' + spotifyURI + "}")
                    };
             
                spotifyURIStatus = await new Promise((resolve, reject) => {
                    songsDB.remove(
                        playlistTrack, 
                        function (err, numRemoved) {
                            console.log(numRemoved);
                        if (err || numRemoved == 0)
                            resolve();
                        
                        if (! err) {
                            resolve(spotifyURI);
                        }
                    })
                })

                if (spotifyURIStatus != undefined) 
                    updatedTrackList.push({uri:"spotify:track:" + spotifyURI});
                

            }
            resolve(updatedTrackList);
        })

    }


    /*
        return new Promise( (resolve, reject)=>{

                for (var spotifyTrack in spotifyTracks){
                    console.log("In here " + spotifyTrack);
                    spotifyURI = spotifyTracks[spotifyTrack];
                    playlistTrack = ("{"+groupId+':'+spotifyURI+"}");
                    track = [{ playlist_track: playlistTrack }];
                
                    updatedTrackList.push(
                    new Promise( (resolve, reject)=>{
                        songsDB.insert(track,function (err, newDoc) {
                            if(err) reject();
                            else{
                                //console
                                resolve( spotifyURI);
                                    //console.log(updatedTrackList);
                            }
                        })
                    })
                    );
               
                }
                Promise.allSettled(updatedTrackList).then((data)=>{
                    var res = [];
                    console.log("here. finished the loop");
                    console.log(data);
                    for( var result in data){
                        console.log(data[result]);
                        if(data[result].status == 'fulfilled'){

                            res.push("spotify:track:"+data[result].value);
                        }
                    }
                    console.log("new x "+ res);
                    //console.log("RESPONSE : " + JSON.stringify(updatedTrackList));
                   return res; 
                }).then((x)=>{
                    resolve(x);
                });
                //console.log(updatedTrackList);
              

            })
              */
};


/* ************* to do *************
    // delete playlist from spotify & db?
    // keep db copy, in case of user error
    removePlaylist: function (db) {},
*/

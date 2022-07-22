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

const   Datastore = require('nedb'),
        songDB = [process.env.DB_PATH + 'songs.db',"" ],
        playlistDB = [process.env.DB_PATH + 'playlists.db', {fieldName: 'group_id', unique: true}] ;

var db;

module.exports = {

    // Load or Initialize db for server use
    startDB: async function () {
        
       db = await new Promise((Resolve, Reject)=>{
            Resolve ({ playlists: playlistDB, songs:songDB});
                Reject(err);
       });

       console.log("DB " + JSON.stringify(db));
       
        for(var table in db){

            var temp = db[table];
     
            // Requires databases to already exist
            if (fs.existsSync(temp[0])) {
                db[table] = new Datastore({filename: temp[0], autoload: true});
                db[table].loadDatabase(function (err) {
                    if (err) {
                        console.log('FATAL: local database could not be loaded. Caused by: ' + error);
                        throw err;
                    }
                    console.log('INFO: local database loaded successfully.');
                });
            } else {
                db[table] = new Datastore({filename: temp[0], autoload: true});
            }

            // Using a unique constraint with the index
            db[table].ensureIndex(
              temp[1]
            , function (err) {});
            console.log("done ");
            
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
                    reject( err );
                //console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
                resolve(newDoc);
                
            });
        })
    },


    // Update name, pic, description
    updatePlaylist: function (db, groupId, options) { 

        return new Promise((resolve, reject) => {
            db.update({group_id: groupId}, { $set: options}, function (err, newDoc) {
                if (err) 
                    reject( err );
                //console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
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

    addSongs: function(db, groupId, spotifySongs){


        //playlistUri = playlistUri.split(':')[2];

        var playlist = [{

                _id: playlistUri,
                group_id: groupId,
                name: groupName,
                description: ''

            }];
        return new Promise((resolve, reject) => {
            db.insert(playlist, function (err, newDoc) {
                if (err) 
                    reject( err );
                //console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
                resolve(newDoc);
                
            });
        })

    }

    /* ************* to do *************
    // delete playlist from spotify & db?
    // keep db copy, in case of user error
    removePlaylist: function (db) {},
*/

};

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
var DB_PATH = process.env.DB_PATH+'playlist.db';
const Datastore = require('nedb');
var db = 

module.exports = { 
    
    // Load or Initialize db for server use
    startDB: async function () { 
        var db = {};
        // Requires db to already exist
        if (fs.existsSync(DB_PATH)) {

            db =  new Datastore({filename: DB_PATH, autoload: true});
            db.loadDatabase(function (error) {   
                if (error) {
                    console.log('FATAL: local database could not be loaded. Caused by: ' + error);
                    throw error;
                  }
                  console.log('INFO: local database loaded successfully.');
              });

        } else {
         
            db =  new Datastore({filename: DB_PATH, autoload: true});

        }

        return db;
    },

    // Check if playlist is found
    checkPlaylist: function (db) {
        var p_uri;
       
        return p_uri;
    },

    // delete playlist
    addPlaylist: async function (db,group_name, group_id, playlist_uri) {
        console.log("HERE2.1");
        console.log(db);

        var uri = playlist_uri.split(':')[2];

        var playlist = [{

            _id: uri
            ,group_id: group_id
            ,name: group_name
            ,description:''

        }];
    
        db.insert(playlist, function (error, newDoc) {   
                if (error) {
                  console.log('ERROR: saving playlist: ' + JSON.stringify(doc) + '. Caused by: ' + error);
                  throw error;
                }    
                console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
        });

    },

    // delete playlist from spotify & db?
    // keep db copy, in case of user error
    removePlaylist: function (db) {},

    // Update name, pic, description
    updatePlaylist: function (db,uri, options) {

        db.update({ _id: uri }, { $set: options }, function (error, newDoc) {
            if (error) {
                console.log('ERROR: saving playlist: ' + JSON.stringify(doc) + '. Caused by: ' + error);
                throw error;
              }    
              console.log('INFO: successfully saved playlist: ' + JSON.stringify(newDoc));
      });


    }


};

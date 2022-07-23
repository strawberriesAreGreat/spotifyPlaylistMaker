/**
 * 
 * ABOUT: 
 *  IO Module
 * 
 * TO DO:  
 *  add remove functions
 *  implement data encryption and decryption for save file
 *  add functions { loadPlaylist, savePlaylist } 
 *      store server to playlist relationships in a hashmap {"group_id":"playlist_id"}
 * 
 *  (  1:1 relationship between group and playlist. This can be expanded in the future. )
 *  
 *  maybe use mongoDB???? hmmmm 
 * 
 */
const fs = require('fs');
require('dotenv').config();
var REFRESH_TOKEN_PATH = './src/configs/state.key';

module.exports = { 
    
    // change name to checkCredentials
    refreshTokenExists: function () {
        
        return fs.existsSync(REFRESH_TOKEN_PATH);
    },

    loadCredentials: async function () {
        return await fs.promises.readFile(REFRESH_TOKEN_PATH, 'utf-8');
    },

    saveCredentials: async function (refreshToken) {

        fs.writeFile(REFRESH_TOKEN_PATH, refreshToken, function (err) {
            if (err) 
                throw(err);
            
        });
    }

}

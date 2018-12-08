require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var bandsintown = require('bandsintown')('codingbootcamp');
var action=process.argv[2];
var thing=process.argv[3];
console.log("action is:"+ action);
console.log("thing is:"+thing);

switch (action){
    case 'concert-this':
        displayEventList();
 /*       bandsintown.getArtistEventList(thing).then(function(events){
            console.log("Event list");
            console.log(events);
        });*/
        break;
    case 'spotify-this-song':
        displaySongInfo();
        break;
    default:
        console.log("default");
}

function displayEventList(){
    bandsintown.getArtistEventList(thing).then(function(events){
        console.log("Event list");
        console.log(events);
    });
}

function displaySongInfo(){
    spotify.search({ type: 'track', query: thing }).then(function(response){
        console.log("Spotify response")
        console.log(response);
        var songInfo=response.tracks.items[0];
        console.log(songInfo.artists[0].name);
        console.log(songInfo.name);
        console.log(songInfo.album.name);
        console.log(songInfo.preview_url);
        })
        .catch(function(err) {
            console.log(err);
        });
}
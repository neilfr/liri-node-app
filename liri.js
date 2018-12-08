require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var bandsintown = require('bandsintown')('codingbootcamp');
var fs = require('fs-extra');

var action=process.argv[2];
var thing=process.argv[3];

function goDoThis(){
    switch (action){
        case 'concert-this':
            displayEventInfo();
            break;
        case 'spotify-this-song':
            displaySongInfo();
            break;
        case 'movie-this':
            displayMovieInfo();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("default");
    }
}

function doWhatItSays(){
    // Async with promises:
    fs.readFile('random.txt','utf-8',function(err,data){
        if (err){
            console.log("error: "+err);
        }
        instructions=data.split(',');
        action=instructions[0];
        thing=instructions[1];
        goDoThis();
      //  var instructions=String.fromCharCode(data);
      //  console.log(instructions);
    });   
}

function displayMovieInfo(){
    if(typeof thing==="undefined"){
        thing="Mr. Nobody";
    }  
    var apikey="351a9807"
    var query="http://www.omdbapi.com/?apikey="+apikey+"&t="+thing;
    request(query, function(err,response,body){
        if(err){
            console.log('error:', err);
        }
        var movieData=JSON.parse(body);
        console.log("Title: "+movieData.Title);
        console.log("Year: "+movieData.Year);
        console.log("Rated: "+movieData.Rated);
        console.log("Country: "+movieData.Country);
        console.log("Language: "+movieData.Language);
        console.log("Plot: "+movieData.Plot);
        console.log("Actors: "+movieData.Actors);
        console.log("Rotten Tomatoes: "+movieData.Ratings[1].Value);   
    });
}

function displayEventInfo(){
    bandsintown.getArtistEventList(thing).then(function(events){
        for(i=0;i<events.length;i++){
            console.log("event title: "+events[i].title);
            var myDate=moment(events[i].datetime).format("MM DD YYYY");
            console.log("event date: "+myDate);
            var thisVenue=events[i].venue;
            console.log("event venue: "+thisVenue.name);
            console.log("event location: "+thisVenue.city+', '+thisVenue.region+', '+thisVenue.country);
            console.log("");
        }
        }).catch(function(err){
            console.log(err);
        });
}

function displaySongInfo(){
    if(typeof thing==="undefined"){
        thing="The Sign";
    }
    spotify.search({ type: 'track', query: thing }).then(function(response){
        for (i=0;i<response.tracks.items.length;i++){
            var songInfo=response.tracks.items[i];
            console.log("artist name: "+songInfo.artists[0].name);
            console.log("song name: "+songInfo.name);
            console.log("album name: "+ songInfo.album.name);
            console.log("link: "+songInfo.preview_url);
            console.log("");
        }
        }) 
        .catch(function(err) {
            console.log(err);
        });
}

goDoThis();

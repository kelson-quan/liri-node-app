require("dotenv").config();
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

var spotifyAccess = new Spotify(keys.spotify);

var nodeArgs = process.argv;
var command = process.argv[2];
console.log(keys.spotify);

var executeOMDB = function(){
    var movieName = "";
    for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {

        movieName = movieName + "+" + nodeArgs[i];

    }
    else {

        movieName += nodeArgs[i];
    }
    }
    var omdbQueryURL = 'http://www.omdbapi.com/?t=' + movieName + '=&plot=short&apikey=trilogy';

    axios.get(omdbQueryURL).then(
    function(response) {
        // console.log(response);
        console.log(
            " ======================================", '\n',
            "Title: " + response.data.Title, '\n',
            "Release Year: " + response.data.Released, '\n',
            "The movie's rating is: " + response.data.imdbRating, '\n', 
            "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value, '\n',
            "Country Produced: " + response.data.Country, '\n',
            "Language: " + response.data.Language, '\n',
            "Plot of movie: " + response.data.Plot, '\n',
            "Actors: " + response.data.Actors, '\n',
            " ======================================", '\n'
            );
    }
    );
}
    

var executeBands = function () {
    var artistName = "";
    for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        artistName = artistName + "+" + nodeArgs[i];
    }
    else {
        artistName += nodeArgs[i];
    }
    }
    
    var bandsQueryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(bandsQueryURL).then(
    function(response) {
        // console.log(response);
        for (var i = 0 ; i < response.data.length ; i++) {
        console.log(
            " ======================================", '\n',
            "Event Number: " + i, '\n',
            "Venue Name: " + response.data[i].venue.name, '\n',
            "Venue Location: " + response.data[i].venue.city, '\n',
            "Date of the Event: " + response.data[i].datetime, '\n',
            " ======================================", '\n'
            );
        }
    });
}

var executeSpotify = function() {
    var songName = "";
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            songName = songName + "+" + nodeArgs[i];
        }
        else {
            songName += nodeArgs[i];
        }
    }
 
    spotifyAccess.search({type: 'track', query: songName, limit: 1}, function(err,data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            
            var pull = data.tracks.items[0]
            
            console.log(
                " ======================================", '\n',
                "Artist: " + pull.artists[0].name, '\n',
                "Song Name: " + pull.name, '\n',
                "Preview of song link: " + pull.preview_url, '\n',
                "Album : " + pull.album.name, '\n',
                "======================================", '\n'
            );
        });  
}

var log = function() {
    fs.appendFile("log.txt", nodeArgs, function(err) {
        if (err) return console.log(err)
    })
    console.log("Logged command: " + nodeArgs);
}

var whyYouGottaBeExtra = function () {
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err) {
            return console.log(err);
        }
        var split = data.split(',');
        process.argv[2] = split[0];
        process.argv[3] = split[1];
    })
}

function theProcess() {
    switch(command) {
        case `concert-this`:
            executeBands()
            log()
            break;

        case `spotify-this-song`:
            executeSpotify()
            log()
            break;

        case `movie-this`:
            executeOMDB()
            log()
            break;

        case `do-what-it-says`:
            whyYouGottaBeExtra()
            log()
            break;
    }
}

theProcess();
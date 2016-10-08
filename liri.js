// Twitter
var Twitter = require('twitter');
var keys = require('./keys.js');
var twitter = new Twitter(keys);

// Spotify
var spotify = require('spotify');

// Inputs and Outputs
var fs = require('fs');
var request = require('request');
var command = process.argv[2];
var title = process.argv.splice(3).join(" ");

// Functions
function getTweets() {
	twitter.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
  		if (!error) {
  			for (var i = 0; i < tweets.length; i++) {
  				console.log(tweets[i].text + ' ---Created on: ' + tweets[i].created_at + '\n');
  				fs.appendFile('log.txt', "LIRI Command: " + command + "\n" + tweets[i].text + ' ---Created on: ' + tweets[i].created_at + '\n==============================\n'); 
  			}
 		} else {
 			console.log(error);
 		}
	});
};

function getSong() {
	if (title == undefined) {
		title = 'Ace of Base - The Sign';
	}
	spotify.search({ type: 'track', query: title }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        fs.appendFile('log.txt', "LIRI Command: " + command + "\n" + "Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name  + "\n" + "==============================\n");
	});
};

function getMovie() {
	if (title == undefined) {
		title = 'Mr. Nobody';
	}
	request('http://www.omdbapi.com/?t='+title+'&tomatoes=true', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var movie = JSON.parse(body);
			console.log("Title: " + movie.Title);
			console.log("Year: " + movie.Year);
			console.log("IMDB Rating: " + movie.imdbRating);
			console.log("Country: " + movie.Country);
			console.log("Language: " + movie.Language);
			console.log("Plot: " + movie.Plot);
			console.log("Actors: " + movie.Actors);
			console.log("Rotten Tomatoes Rating: " + movie.tomatoUserRating);
			console.log("Rotten Tomatoes URL: " + movie.tomatoURL);
			fs.appendFile('log.txt', "LIRI Command: " + command + "\n" + "Title: " + movie.Title + "\n" + "Year: " + movie.Year + "\n" + "IMDB Rating: " + movie.imdbRating + "\n" + "Country: " + movie.Country + "\n" + "Language: " + movie.Language + "\n" + "Plot: " + movie.Plot + "\n" + "Actors: " + movie.Actors + "\n" + "Rotten Tomatoes Rating: " + movie.tomatoUserRating + "\n" + "Rotten Tomatoes URL: " + movie.tomatoURL + "\n" + "==============================\n");
		} else {
			console.log(error);
		}
	});
};

function getRandom() {
	fs.readFile("random.txt", "utf8", function(error, data) {
     	if (error) {
     		console.log(error);
     	} else {
     		var inputArray = data.split(',');
     		command = inputArray[0];
     		title = inputArray[1];
     		sincerity = inputArray[2];
     		switch(command) {
     			case 'my-tweets':
     				getTweets();
     				break;
     			case 'spotify-this-song':
     				console.log('\n' + sincerity + '\n');
     				getSong();
     				break;
     			case 'movie-this':
     				getMovie();
     				break;
     			default:
     				console.log('A valid command was not found.');
     		}
     	}
    });
};

// Main Switch Statement
switch(command) {
	case 'my-tweets':
		getTweets();
		break;
	case 'spotify-this-song':
		getSong();
		break;
	case 'movie-this':
		getMovie();
		break;
	case 'do-what-it-says':
		getRandom();
		break;
	default:
		console.log('Please enter a valid command.');
}
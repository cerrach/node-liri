function getTweets(subCommand){

  var twitterClient = info.twitterKeys; //assigning a variable to twitterInfo
  var Twitter = require("twitter"); //twitter object to be used in tandem with api
  var tUser = new Twitter(twitterClient); //setting client variable to new twitter object with predefined credentials

  if(subCommand === "sample-post"){
    tUser.post('statuses/update', {status: "testing1"},  function(error, tweet, response) {
      if(error) console.log(error);
      console.log("\r\n" + "Tweet was created at: " + JSON.stringify(tweet.created_at) + "\r\n" + "UserName: " + JSON.stringify(tweet.user.name) + "\r\n" + "ScreenName: " + JSON.stringify(tweet.user.screen_name) + "\r\n" + "Tweet Content: " + JSON.stringify(tweet.text));
    });
  }else{

    tUser.get('statuses/user_timeline', {screen_name: "SzechaunJohnson", count: 20}, function(error, tweets, response) {
      if(error) console.log(error);
      tweets.forEach(function(tweet){
        console.log("\r\n" + "Tweet was created at: " + JSON.stringify(tweet.created_at) + "\r\n" + "UserName: " + JSON.stringify(tweet.user.name) + "\r\n" + "ScreenName: " + JSON.stringify(tweet.user.screen_name) + "\r\n" + "Tweet Content: " + JSON.stringify(tweet.text));
      });

    });
  }

}

function spotifySong(subCommand,tertiaryCommand){

  var spotifyClient = info.spotifyKeys; //assigning a variable to spotifyInfo
  var Spotify = require('node-spotify-api'); //spotify object to be used in tandem with api
  var sUser = new Spotify(spotifyClient); //setting client variable to new spotify object with predefined credentials

  var selectedSong;

  adjustedCommand = subCommand.split("-").join(" "); //song name
  adjustedCommand2 = tertiaryCommand.split("-").join(" "); //song artist
  subCommandArray = subCommand.split("-"); //song name array

  sUser.search({type: 'track', query: adjustedCommand}, function(err,data){
    if(err) console.log(err);

    var trackItems = data.tracks.items; //list of possible tracks
    var bool = false; //boolean for determining if the default song of "The Sign" is displayed

    trackItems.every(function(item){ //loop through all the possible songs
      if(item.name.toLowerCase() === adjustedCommand.toLowerCase() || (item.name.toLowerCase() === adjustedCommand.toLowerCase() && item.artists[0].name.toLowerCase() === adjustedCommand2.toLowerCase()) || item.name.toLowerCase().includes(subCommandArray[1])){ //if the track's name and artists match the search -- lowercasing to avoid casing issues
          bool = true; //set boolean to true so other possibility does not get executed
          selectedSong = item; //setting the song to the item object
          return false; //breaking out of loop
      }else{
        return true;
      }
    });

    if(!bool) //if no song with the search parameters is found
    {
      sUser.search({type: 'track', query: "The Sign"}, function(err,data){ //same thing but with predetermined song "The Sign" by "Ace of Base"
        if(err) console.log(err);
        var trackItems = data.tracks.items;
        trackItems.every(function(item){
          if(item.name.toLowerCase() === "The Sign".toLowerCase() || (item.name === "The Sign".toLowerCase() && item.artists[0].name.toLowerCase() === "Ace of Base".toLowerCase())){
            selectedSong = item;
            return false;
          }else{
            return true;
          }
        });
      });
    }

    console.log("\r\n" + "Song Name: " + JSON.stringify(selectedSong.name) + "\r\n" + "Song Artist(s): " + JSON.stringify(selectedSong.artists[0].name) + "\r\n" + "Song Album: " + JSON.stringify(selectedSong.album.name) + "\r\n" + "Song Preview URL: " + JSON.stringify(selectedSong.preview_url));
    //^^ prints the needed information to the console
  });


}

function movieSearch(subCommand){

  var request = require("request");
  var plusCommand = subCommand.replace(/-/g,"+");
  request("http://www.omdbapi.com/?t=" + plusCommand + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      var advancedBody = JSON.parse(body);
      console.log("\r\nMovie Title: " + advancedBody.Title);
      console.log("Movie Release Year: " + advancedBody.Released);
      console.log("IMDB Rating: " + advancedBody.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating" + advancedBody.Ratings[1].Value);
      console.log("Movie Release Country: " + advancedBody.Country);
      console.log("Movie Language: " + advancedBody.Language);
      console.log("Movie Plot: " + advancedBody.Plot);
      console.log("Movie Actors: " + advancedBody.Actors);
    }
  });

}

function doWhat(command,subCommand,tertiaryCommand){

  var fs = require("fs");

  fs.readFile("random.txt","utf8",function(err,data){

    if(err){
      console.log(err);
    }
    var commandArray = [];
    commandArray = data.split(",");

    var command = commandArray[0];
    var subCommand = commandArray[1];
    var tertiaryCommand;
    if(commandArray.length === 3){
      tertiaryCommand = commandArray[2];
    }

    if(command === "myTweets"){
      getTweets();
    }else if(command === "spotify-this-song"){
      spotifySong(subCommand,tertiaryCommand);
    }else if(command === "movie-this"){
      movieSearch(subCommand);
    }else{
      console.log("not a command");
    }



  });

}

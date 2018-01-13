var fs = require('fs');
var Regex = require("regex");
var util = require('util');
var oauth = require('./oauth.js');
var DB = require('./mysql.js');

Prefix = "#";
Trigger = "honorbet";
HonorPrefix = "#honorbet";

// Old Function below. Will reuse some of them but not much.
/*
// Testing how to generate Arrays of the messages // Ex. = Testing,123 was written like Testing 123 in chat.
client.on("chat", function(channel, userstate, message, self) {
  if (self) return;
  // Logic under here
  LoserScore = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  WinnerScore = ["16","19","22"];
  var str = message;
  var res = str.split(" ");
  // Extracted Country and Score.
  var country = res[0].toLowerCase();
  //console.log(country);
  var score = res[1];
  //console.log(score);
  regStr1 = /\d|\d-\d|\d/gi.exec(score);
  regStr2 = /\d\d-\d/gi.exec(score);
  //console.log("Testing values from regStr "+regStr1 + regStr2);
  if (regStr1 == true) {
    ToMatchScore = score.split("-");
    if (WinnerScore.indexOf(ToMatchScore[0]) >= 0) {
      //client.say("kingofnordic", "Winner: "+ ToMatchScore[0]);
      //console.log("Winner: "+ ToMatchScore[0]);
      WinScore = 1;
    } else {
      WinScore = 0;
    }
    if (LoserScore.indexOf(ToMatchScore[1]) >= 0) {
      //client.say("kingofnordic", "Loser: "+ ToMatchScore[1]);
      //console.log("Loser: "+ ToMatchScore[1]);
      LoseScore = 1;
    } else {
      LoseScore = 0;
    }
    ScoreAfterFilter = ToMatchScore[0] + " - " + ToMatchScore[1];
    //console.log("WinnerScore: "+ ToMatchScore[0]+" LoserScore: "+ ToMatchScore[1]);
  }
  // Accepted written syntax for country
  var CountryCheck = ["sweden", "norway", "denmark", "finland"];
  // Here we check if Country array matches.
  // (&& regStr1 == true || regStr2 == true)
  if(CountryCheck.indexOf(country) >= 0 && WinScore > 0 && LoseScore > 0) {
    // First we need to create the post to send to database.
    var honorbet  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: score, matchid: "Value Goes here"};
    // Now we bring in database logic
    var query = connection.query('INSERT INTO honorbets SET ?', honorbet, function (error, results, fields) {
    if (error) throw error;
    });// end if Country check
    console.log("Honorbet added!");
    // Sends Message to the one who made the honorbet
    //var PrivateMessage = userstate['display-name'] + " : " + "Your honorbet has been added to the pool!" + country.toUpperCase() + " " + ScoreAfterFilter;
    var PrivateMessage = userstate['display-name'] + " : " + "Your honorbet has been added to the pool!";
      client.say(channel, PrivateMessage).then(function(data) {
      // data returns [username, message]
    }).catch(function(err) {
      //
    });
  console.log("Message Sent !");
  }
});
*/

client.on("chat", function(channel, userstate, message, self) {
  if (self) return;
  /*
  Variables that we use for checks.
  */
  CountryCheck = ["sweden", "norway", "denmark", "finland"];
  LoserScore = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  WinnerScore = ["16","19","22"];
  /*
  Code for submit and such.

   +" "+ CountryCheck.indexOf(message) +" "+ WinnerScore.indexOf(message) +"-"+ LoserScore.indexOf(message) 
  */
  BetMsgUser = userstate['display-name']; //console.log(BetMsgUser);
  StoreMsg = message; //console.log(StoreMsg);
  WordArray = StoreMsg.split(" "); //console.log(WordArray);


  if (WordArray[0] === HonorPrefix) {
    console.log("We have a matched Msg");
    // Lets bring in the whole array to work our magic!

    country = WordArray[1].toLowerCase(); console.log(country);
    score = WordArray[2]; console.log(score);
    // We are going to start matching everything to just get correct values in score ! 

      ToMatchScore = score.split("-");
      if (WinnerScore.indexOf(ToMatchScore[0]) >= 0) {
        //client.say("kingofnordic", "Winner: "+ ToMatchScore[0]);
        console.log("Winner: "+ ToMatchScore[0]);
        WinScore = 1;
      } else {
        WinScore = 0;
      }
      if (LoserScore.indexOf(ToMatchScore[1]) >= 0) {
        //client.say("kingofnordic", "Loser: "+ ToMatchScore[1]);
        console.log("Loser: "+ ToMatchScore[1]);
        LoseScore = 1;
      } else {
        LoseScore = 0;
      }
      ScoreAfterFilter = ToMatchScore[0] + " - " + ToMatchScore[1];
      console.log("WinnerScore: "+ ToMatchScore[0]+" LoserScore: "+ ToMatchScore[1]);
    }

});

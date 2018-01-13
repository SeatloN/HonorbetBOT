var fs = require('fs');
var Regex = require("regex");
var util = require('util');
var oauth = require('./oauth.js');
var DB = require('./mysql.js');

Prefix = "#";
Trigger = "honorbet";
HonorPrefix = "#honorbet";

client.on("chat", function(channel, userstate, message, self) {
  if (self) return;
  /*
  Variables that we use for checks.
  */
  CountryCheck = ["sweden", "norway", "denmark", "finland"];
  LoserScore = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  WinnerScore = ["16","19","22"];

  Match16 = ["14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  Match19 = ["18","17","16","15"];
  Match22 = ["20","19","18"];

  var Check16;
  var Check19;
  var Check22;
  var MatchCountry;

  /*
  Code for submit and such.

  */
  BetMsgUser = userstate['display-name']; //console.log(BetMsgUser);
  StoreMsg = message; //console.log(StoreMsg);
  WordArray = StoreMsg.split(" "); //console.log(WordArray);


  if (WordArray[0] === HonorPrefix) {
    //console.log("We have a matched Msg");
    // Lets bring in the whole array to work our magic!

    country = WordArray[1].toLowerCase(); //console.log(country);
    score = WordArray[2]; //console.log(score);
    // We are going to start matching everything to just get correct values in score ! 

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

      if (ToMatchScore[0] === "16") {
        // Check if loser is in the 
        if (Match16.indexOf(ToMatchScore[1]) >= 0) {
          //console.log("Loser score is alright for 16: "+ ToMatchScore[1]);
          Check16 = 1;
        } else {
          Check16 = 0;
        }
      }
      if (ToMatchScore[0] === "19") {
        if (Match19.indexOf(ToMatchScore[1]) >= 0) {
          //console.log("Loser score is alright for 19: "+ ToMatchScore[1]);
          Check19 = 1;
        } else {
          Check19 = 0;
        }
      }
      if (ToMatchScore[0] === "22") {
        if (Match22.indexOf(ToMatchScore[1]) >= 0) {
          //console.log("Loser score is alright for 22: "+ ToMatchScore[1]);
          Check22 = 1;
        } else {
          Check22 = 0;
        }
      }

      //console.log("Found 16: "+Check16);
      //console.log("Found 19: "+Check19);
      //console.log("Found 22: "+Check22);

      ScoreAfterFilter = ToMatchScore[0] + "-" + ToMatchScore[1];
      /*
      console.log("WinnerScore: "+ ToMatchScore[0]+" LoserScore: "+ ToMatchScore[1]);
      console.log(ScoreAfterFilter);

      End of score check 
      */
      // Checking that the country is correct. 
      if (CountryCheck.indexOf(country) >= 0) {
        //console.log("Country is a match");
        MatchCountry = 1;
      } else {
        MatchCountry = 0;
      }
      //console.log("Found Country: "+MatchCountry);
      /*
      End country check feature.
      */

      /*
      Now will will process everything to add it to the database.
      */
      if (MatchCountry === 1 && Check16 === 1) {
        //console.log("We have a Good BET! within normal time!");
        // Creating the QUERY
        var honorbet  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "Normal Score"};
        var query = connection.query('INSERT INTO honorbets SET ?', honorbet, function (error, results, fields) {
          if (error) throw error;
          });
          //console.log("Honorbet added!");
          var PrivateMessage = userstate['display-name'] + " : " + "Your honorbet has been added to the pool!";
          client.say("kingofnordic", PrivateMessage).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }

      if (MatchCountry === 1 && Check19 === 1) {
        //console.log("We have a Good BET! within First overtime!");
        var honorbetOT1  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "OT #1 Score"};
        var queryOT1 = connection.query('INSERT INTO honorbets SET ?', honorbetOT1, function (error, results, fields) {
          if (error) throw error;
          });
          //console.log("Honorbet added! for OT #1");
          var PrivateMessage1 = userstate['display-name'] + " : " + "Your honorbet has been added to the pool! for OT #1";
          client.say("kingofnordic", PrivateMessage1).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }

      if (MatchCountry === 1 && Check22 === 1) {
        //console.log("We have a Good BET! within Secound overtime!");
        var honorbetOT2  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "OT #2 Score"};
        var queryOT2 = connection.query('INSERT INTO honorbets SET ?', honorbetOT2, function (error, results, fields) {
          if (error) throw error;
          });
          //console.log("Honorbet added! for OT #2");
          var PrivateMessage2 = userstate['display-name'] + " : " + "Your honorbet has been added to the pool! for OT #2";
          client.say("kingofnordic", PrivateMessage2).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }

    }

});

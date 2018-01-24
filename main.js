var fs = require('fs');
var util = require('util');
var oauth = require('./oauth.js');
var DB = require('./mysql.js');
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: '',
  encrypted: true
});

Active = 0;

HonorPrefix = "#honorbet";
MapBanPrefix = "#banmap";
MvpVotePrefix = "#mvp";


client.on("chat", function(channel, userstate, message, self) {
  if (self) return;
  /*
  Variables that we use for checks.
  */
  CountryCheck = ["sweden", "norway", "denmark", "finland"];
  LoserScore = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  WinnerScore = ["16","19","22"];

  Match16 = ["14","13","12","11","10","9","8","7","6","5","4","3","2","1","0"];
  Match19 = ["17","16","15"];
  Match22 = ["20","19","18"];

  var Check16;
  var Check19;
  var Check22;
  var MatchCountry;
  var length;
  var score;
  var Hyphen = "-";
  var Space = " ";
  /*
  Code for submit and such.
  */
  BetMsgUser = userstate['display-name']; //console.log(BetMsgUser);
  StoreMsg = message; //console.log(StoreMsg);
  WordArray = StoreMsg.split(" "); //console.log(WordArray);

  var validateSplitSpace = function(StoreMsg, Space) {
    return (StoreMsg || '').split(Space).length > 1;         
  };

  var validateSplitHyphen = function(StoreMsg, Hyphen) {
    return (StoreMsg || '').split(Hyphen).length > 1;         
  }; 


  if (WordArray[0] === HonorPrefix) {
    //console.log("We have a matched Msg");
    // Lets bring in the whole array to work our magic!
    if (WordArray[1] == undefined) {
      return;
    }
    if (WordArray[2] == undefined) {
      return;
    }
    country = WordArray[1].toLowerCase(); //console.log(country);
    score = WordArray[2]; //console.log(score); //console.log(score.length);

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
    if (MatchCountry === 1) {
          

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

    }

      /*
      Now will will process everything to add it to the database.
      */
      if (Active === 1 && MatchCountry === 1 && Check16 === 1) {
        //console.log("We have a Good BET! within normal time!");
        // Creating the QUERY
        var honorbet  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "Normal Score"};
        var query = connection.query('INSERT INTO honorbets SET ?', honorbet, function (error, results, fields) {
          if (error) throw error;
          });

          pusher.trigger('honor_bet', 'bet_saved', {
            "user": BetMsgUser,
            "country": country.toUpperCase(),
            "score": ScoreAfterFilter,
            "message": "Bet is saved!"
          });

          //console.log("Honorbet added!");
          var PrivateMessage = userstate['display-name'] + " : " + "Your honorbet has been added to the pool!";
          client.say(channel, PrivateMessage).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }

      if (Active === 1 && MatchCountry === 1 && Check19 === 1) {
        //console.log("We have a Good BET! within First overtime!");
        var honorbetOT1  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "OT #1 Score"};
        var queryOT1 = connection.query('INSERT INTO honorbets SET ?', honorbetOT1, function (error, results, fields) {
          if (error) throw error;
          });
          //console.log("Honorbet added! for OT #1");
          var PrivateMessage1 = userstate['display-name'] + " : " + "Your honorbet has been added to the pool! for OT #1";
          client.say(channel, PrivateMessage1).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }

      if (Active === 1 && MatchCountry === 1 && Check22 === 1) {
        //console.log("We have a Good BET! within Secound overtime!");
        var honorbetOT2  = {user_name: userstate['display-name'], country: country.toUpperCase(), score: ScoreAfterFilter, matchid: "OT #2 Score"};
        var queryOT2 = connection.query('INSERT INTO honorbets SET ?', honorbetOT2, function (error, results, fields) {
          if (error) throw error;
          });
          //console.log("Honorbet added! for OT #2");
          var PrivateMessage2 = userstate['display-name'] + " : " + "Your honorbet has been added to the pool! for OT #2";
          client.say(channel, PrivateMessage2).then(function(data) {
          // data returns [username, message]
        }).catch(function(err) {
          // Send error msg or something if you want. 
        });
      }
    }
});


// Now lets write function for mapban.
client.on("chat", function(channel, userstate, message, self) {
  if (self) return;
  //console.log("Wee we see messages!");

  // Here we define accepted entries into mapban.
  AcceptedMaps = ["mirage","train","cbble","inferno","cache","overpass"];
  var InDB;
  var results;
  // Lets try and get the message we want.
  BanMsgUser = userstate['display-name']; //console.log(BanMsgUser);
  StoreMsgBan = message; //console.log(StoreMsgBan);
  BanWordArray = StoreMsgBan.split(" "); //console.log(BanWordArray);
  

  if (BanWordArray[0] === MapBanPrefix) {
    // Escape any undefined issues.
    if (BanWordArray[1] == undefined) {
      return;
    }
    //console.log(BanWordArray[1]);
    MapName = BanWordArray[1].toLowerCase();

    // this part will filter the mapname out. And make sure that it is in the AcceptedMaps ARRAY.
    if (MapName.toLowerCase() === 'cobble' || MapName.toLowerCase() === 'cobblestone') {
      MapName = 'cbble';
    }

    if (AcceptedMaps.indexOf(MapName) >= 0) {
      //console.log(BanMsgUser+" banned: "+MapName.toUpperCase());
      // Create a return msg.

      //console.log(SaveFile);
      
      // Check if user have made a bet.
      var EntryCheck = BanMsgUser;
      var QueryEntryCheck = connection.query('SELECT * FROM `mapbans` WHERE `user_name` = ?', EntryCheck, function(error,results) {
        if (error) throw error;
      
      UserCheck = results;
      //console.log(results);
      //console.log(UserCheck.length);
        if (UserCheck.length <= 0) {
          //console.log("No more votes.");

          // Insert section.
        
          InsertToDB = {user_name: BanMsgUser, mapname: MapName.toUpperCase(), matchid: "Normal"};
          InsertQuery = connection.query('INSERT INTO mapbans SET ?', InsertToDB, function (error, results, fields) {
            if (error) throw error;
            //console.log("Ban is saved!");
            client.say(channel, BanMsgUser+" Thank you for your vote!").then(function(data) {
                // data returns [username, message]
              }).catch(function(err) {
            });
          });
        } else {
          //console.log("User has already made there ban.");
          client.say(channel, BanMsgUser+" You have already casted your vote.").then(function(data) {
            // data returns [username, message]
            }).catch(function(err) {
          });
        }
      });
      /*
      BanReturnMsg = BanMsgUser+" You banned: "+MapName.toUpperCase();
      client.say(channel, BanReturnMsg).then(function(data) {
        // data returns [username, message]
      }).catch(function(err) {
        // Send error msg or something if you want. 
      });
      */
    } else {
      return;
    }
  }
});

// Chat triggers for activate and deactivate registration of bets and votes.

client.on("chat", function (channel, userstate, message, self) {
  // Don't listen to my own messages..
  if (self) return;

  UserDisplayName = userstate['display-name']; // Define user.
  UserUsername = userstate['username'];
  Msg = message;
  //console.log(UserDisplayName+UserUsername);
  /*
  if(Admins.indexOf(UserUsername) >= 0) {
    // We have now done a check if admin is in the array.
    if(Msg == "#honorbet open") {
      Active = 1;
      client.say(channel, "The honorbet is now Opened for this match!").then(function(data) {
      }).catch(function(err) {
    });
    }
    // Sets the value and prints its action to chat.
    if(Msg == "#honorbet close") {
      Active = 0;
      client.say(channel, "The honorbet is now closed for this match!").then(function(data) {
      }).catch(function(err) {
    });
    }
    // Checks the value of Active and returns either message.
    if(Msg == "#honorbet status") {

      // If app is not active this is true
      if(Active === 0) {
        client.say(channel, "Honorbet is closed!").then(function(data) {
        }).catch(function(err) {
      });
      }
      // If app is active this is true
      if(Active === 1) {
        client.say(channel, "Honorbet is open!").then(function(data) {
        }).catch(function(err) {
      });
      }
    }

    if(Msg == "#honorbet clear") {

      var BetClear = "UPDATE honorbets SET `in_or_out` = 'OUT' WHERE `in_or_out` = 'IN'";
      connection.query(BetClear, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });

      client.say(channel, "Honorbet is now cleared. Ready for next match!").then(function(data) {
      }).catch(function(err) {
    });
    }
  //console.log("We have a admin!");
  }
  */

  if (userstate.mod) {
    // We have now done a check if admin is in the array.
    if(Msg == "#honorbet open") {
      Active = 1;
      client.say(channel, "The honorbet is now Opened for this match!").then(function(data) {
      }).catch(function(err) {
    });
    }
    // Sets the value and prints its action to chat.
    if(Msg == "#honorbet close") {
      Active = 0;
      client.say(channel, "The honorbet is now closed for this match!").then(function(data) {
      }).catch(function(err) {
    });
    }
    // Checks the value of Active and returns either message.
    if(Msg == "#honorbet status") {

      // If app is not active this is true
      if(Active === 0) {
        client.say(channel, "Honorbet is closed!").then(function(data) {
        }).catch(function(err) {
      });
      }
      // If app is active this is true
      if(Active === 1) {
        client.say(channel, "Honorbet is open!").then(function(data) {
        }).catch(function(err) {
      });
      }
    }

    if(Msg == "#honorbet clear") {

      var BetClear = "UPDATE honorbets SET `in_or_out` = 'OUT' WHERE `in_or_out` = 'IN'";
      connection.query(BetClear, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });

      client.say(channel, "Honorbet is now cleared. Ready for next match!").then(function(data) {
      }).catch(function(err) {
    });
    }
  //console.log("We have a admin!");
  }

});
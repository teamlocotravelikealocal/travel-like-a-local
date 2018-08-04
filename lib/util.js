var connection = require('../db/index').connection;
const bcrypt = require('bcrypt-nodejs');
const request = require('request');
// const DIFFBOT_API_KEY = require('./../db/config.js').DIFFBOT_API_KEY;
// const EVENTBRITE_OAUTH_TOKEN = require('./../db/config.js').EVENTBRITE_OAUTH_TOKEN;
require('dotenv').config();
const DIFFBOT_API_KEY = process.env.DIFFBOT_API_KEY;
const EVENTBRITE_OAUTH_TOKEN = process.env.EVENTBRITE_OAUTH_TOKEN;
const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY;
const https = require('https');
//var eventbriteAPI = require('node-eventbrite');

// console.log("process.env ", process.env);
var googleMapsClient = require('@google/maps').createClient({
  //add a new key once this one expires - we were not getting any errors,
  // but could not fetch results from Google API
  key: 'AIzaSyBzZ_ydULp5S4kvIgAyhpEd173RceLYk6M'
});

// ------------------------------ Database calls ------------------------------------ //
exports.getLoggedUserId = function(req, res){
  var username = req.params.username;
  var queryStr = 'select ID from users where username = '+ JSON.stringify(username) + ';';
  connection.query(queryStr, function(error, result){
        if (error){
      res.send(error.sqlMessage);
      console.log(error.sqlMessage);
    } else {
      res.send(result);
    }
  });
};

exports.addNewDest = function(req, res){
  var newDest = req.params.newdest;
  connection.query('insert into destinations(destinationName) values('+ JSON.stringify(newDest)+')', function(err, result){
    if (err){
      res.send(err.sqlMessage);
      console.log(err.sqlMessage);
    } else {
      console.log("Successfully added destination");
      res.send("Successfully added destination");
    }
  });
};

// fix the SQL to show only users that are not friends with you
exports.getSuggestedFriendsForUser = function(req, res){
  var loggedUser = req.params.username;
  var queryStr = 'select users.username, users.id, friendships.friendID FROM users LEFT JOIN friendships ON \
  users.ID = friendships.userID WHERE ((username <>'+ JSON.stringify(loggedUser) + ') AND ((friendID <> id) OR (friendID IS NULL))) GROUP BY users.id, users.username, friendships.friendID ORDER BY users.username;';


  connection.query(queryStr, function(error, result){
    if (error){
      res.send(error.sqlMessage);
      console.log('Error in getSuggestedFriendsForUser...', error.sqlMessage);
    } else {
      res.send(result)
    }
  });
};

exports.getFriendListForUser = function(req, res){
  var loggedUser = req.params.username;
  var queryStr = 'SELECT users.ID AS userID,\
                         users.username AS username,\
                         Query_friendships.friendID AS friendID,\
                         FK_users_Query_friendships.username AS friendName\
                  FROM users AS users\
                       LEFT JOIN (\
                                  SELECT friendships.friendID AS friendID,\
                                         friendships.userID AS userID\
                                  FROM friendships AS friendships\
                                  ) AS Query_friendships\
                         ON users.ID = Query_friendships.userID\
                       INNER JOIN users AS FK_users_Query_friendships\
                         ON Query_friendships.friendID = FK_users_Query_friendships.ID\
                  WHERE (users.username = '+ JSON.stringify(loggedUser) +') ORDER BY friendName;';
  connection.query(queryStr, function(error, result){
    if (error){
      console.log(error.sqlMessage);
      res.send(error.sqlMessage);
    } else {
      res.send(result);
    }
  });
};


exports.addNewFriend = function(req, res) {
  var username = req.body.username;
  var friend = req.body.friend;
  var queryStr1 = 'INSERT INTO friendships ( userid, friendid )\
    SELECT (SELECT users.ID AS userid\
    FROM users\
    WHERE (((users.username)='+JSON.stringify(username)+'))) as userid, users.ID AS friendid\
    FROM (SELECT users.ID AS userid\
    FROM users\
    WHERE (((users.username)='+JSON.stringify(username)+'))) as whatevername, users\
    WHERE (((users.username)='+JSON.stringify(friend)+'));';
  var queryStr2 = 'INSERT INTO friendships ( userid, friendid )\
    SELECT (SELECT users.ID AS userid\
    FROM users\
    WHERE (((users.username)='+JSON.stringify(friend)+'))) as userid, users.ID AS friendid\
    FROM (SELECT users.ID AS userid\
    FROM users\
    WHERE (((users.username)='+JSON.stringify(friend)+'))) as whatevername, users\
    WHERE (((users.username)='+JSON.stringify(username)+'));';
  connection.query(queryStr1, function(error, result){
    if (error){
      console.log(error.sqlMessage);
      res.send(error.sqlMessage);
    } else {
      console.log("Successfully added friend1");
      connection.query(queryStr2, function(error, result){
        if (error) {
          res.send(error.sqlMessage);
          console.log(error.sqlMessage);
        } else {
          console.log("Successfully added friend2");
          res.send("Successfully added friend");
        }
      });
    }
  });
};



exports.getSuggestionsFromFriends = function(req, res) {
  var location = req.params.location;
  var username = req.params.username;
  var queryStr = 'SELECT users.ID AS userID,\
                     users.username AS username,\
                     friendships.friendID AS friendID,\
                     friends.username AS friendName,\
                     suggestions.suggestionName AS suggestionName,\
                     suggestions.suggestionDescription AS suggestionDescription,\
                     suggestions.destinationID AS destinationID,\
                     suggestions.photoLink AS photoLink, \
                     destinations.destinationName AS destinationName\
                  FROM users AS users\
                       INNER JOIN friendships\
                         ON users.ID = friendships.userID\
                       INNER JOIN users AS friends\
                         ON friendships.friendID = friends.ID\
                       INNER JOIN suggestions\
                         ON friendships.friendID = suggestions.userID\
                       INNER JOIN destinations\
                         ON suggestions.destinationID = destinations.ID\
                  WHERE (users.username = '+JSON.stringify(username)+') AND (destinations.destinationName = '+JSON.stringify(location)+');';
  connection.query(queryStr, function(error, result){
    if (error) {
      console.log(error.sqlMessage);
      res.send(error.sqlMessage);
    } else {
      res.send(result);
    }
  });
};

exports.addNewSuggestion = function (req, res) {
  var username = req.body.username;
  var destination = req.body.destination;
  var suggestionName = req.body.suggestionName;
  var suggestionLink = req.body.suggestionLink;

  console.log('in addNewSuggestion...destination is...', destination)
  var queryStr = 'INSERT INTO suggestions (userID, destinationID, suggestionName, photoLink)\
                 SELECT\
                (SELECT users.ID FROM users WHERE users.username='+JSON.stringify(username)+') AS userID, \
                (SELECT destinations.ID FROM destinations WHERE destinations.destinationName='+JSON.stringify(destination)+') AS destinationID, \
                '+JSON.stringify(suggestionName)+', \
                '+JSON.stringify(suggestionLink)+';';
  connection.query(queryStr, function(error, result){
    if (error) {
      console.log('Error in addNewSuggestion...', error.sqlMessage);
      res.send(error.sqlMessage);
    } else {
      res.send(result);
    }
  });
};

exports.getDestinations = function(req, res) {
  var queryStr = 'select destinationName from destinations;';
  connection.query(queryStr, function(error, result){
    if (error) {
      console.log('Error in getDestinations...', error.sqlMessage);
      res.send(error.sqlMessage);
    } else {
      // console.log('Success in getDestinations...', result);
      res.send(result);
    }
  });
}

exports.deleteFriendship = function(req, res) {
  var userID = req.params.userID;
  var friendID = req.params.friendID;
  var queryStr1 = 'DELETE FROM friendships WHERE friendships.userID = ' + userID + ' \
   AND friendships.friendID = ' + friendID + ';';
  var queryStr2 = 'DELETE FROM friendships WHERE friendships.userID = ' + friendID + ' \
  AND friendships.friendID = ' + userID + ';';
  connection.query(queryStr1, function(err, result){
    if (err) {
      console.log(err.sqlMessage);
      res.send(err.sqlMessage);
    } else {
      connection.query(queryStr2, function(err, result){
        if (err) {
          console.log(err);
          res.send(err.sqlMessage);
        } else {
          res.send('frienship deleted sucessfully');
        }
      });
    }
  });
}
// ------------------------------ End Database calls ------------------------------------ //


// ------------------------------ BEGIN Third Party API calls (google, diffbot) ------------------------------------ //
// you need a proxy to access Google Maps API,
// since you cannot access it directly from client side due to CORS error
exports.getPlacesFromGoogleMapsProxy = function(req, res) {

    //   var lattitude = '41.8781';
    //   var longitude = '87.6298';

    // https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLEMAPS_API_KEY}&location=${lattitude},${longitude}&radius=5000`, (resp) => {

    // let data = '';
    // let eventNames = [];
    // resp.on('data', (chunk) => {
    //   data += chunk;
    // });
    // // The whole response has been received. Print out the result.
    // resp.on('end', () => {
    //   var results = JSON.parse(data).results;
    //   if (results.length > 0 ) {
    //     console.log('Success in https get', results.length);
    //     // res.send(eventNames)
    //   }
    // });

    // }).on("error", (err) => {
    //   console.log("Error in https get: " + err.message);
    // });

    //   googleMapsClient.placesNearby({
    //     location:[lattitude, longitude],
    //     radius:5000
    //   }, function(err, response){
    //     if (err) {
    //       console.log("ERROR: in google maps client placesNearby...", err);
    //     } else {
    //       let locationSuggestions = {
    //         lattitude: lattitude,
    //         longitude: longitude,
    //         suggestions: response
    //       };
    //       console.log('googleMapsClient placesNearby response...', response.json.results.length);
    //       res.send(locationSuggestions);
    //     }
    //   });

  googleMapsClient.places({
    query:req.params.location
    }, function(err, response) {
    if (err) {
      console.log("ERROR: in google maps client places...", err);
    } else {
      var lattitude = response.json.results[0].geometry.location.lat;
      var longitude = response.json.results[0].geometry.location.lng;
      googleMapsClient.placesNearby({
        location:[lattitude, longitude],
        radius:5000
      }, function(err, response){
        if (err) {
          console.log("ERROR: in google maps client placesNarby...", err);
        } else {
          let locationSuggestions = {
            lattitude: lattitude,
            longitude: longitude,
            suggestions: response
          };
          res.send(locationSuggestions);
        }
      });
    }
  });
};


// exports.getEventsFromGoogleMapsAndEventbrite = function(req, res) {

//   console.log('inside utils.getEventsFromGoogleMapsAndEventbrite...');
//   googleMapsClient.places({
//     query:req.params.location
//     }, function(err, response) {
//       if (err) {
//         console.log(err);
//       } else {
//         var lattitude = response.json.results[0].geometry.location.lat;
//         var longitude = response.json.results[0].geometry.location.lng;

//         let options = {
//           url: `https://www.eventbriteapi.com/v3/events/search/?token=${EVENTBRITE_API_KEY}&q=music&location.within=20mi&location.latitude=${latitude}&location.longitude=${longitude}`,
//           json:true,
//           headers: {
//             'User-Agent': 'request',
//             "Content-Type": "application/json",
//             'EVENTBRITE-API-KEY':`${EVENTBRITE_API_KEY}`,
//             "Access-Control-Allow-Origin": true
//           }
//         };
//         console.log('successful googleMapsClient call for events...');

//         request(options, function(err, response, body) {
//             console.log('inside EVENTSBRITE api call...');
//             if(err){
//               console.log('ERROR: in utils.getEventsFromGoogleMapsAndEventbrite ', err.message);
//             } else {
//               var results = body.events;
//               let eventNames = [];
//               if ( results && results.length > 0 ) {
//                 eventNames.push(results[0].name.text);
//               }
//               console.log('SUCCESS: response in eventbrite api Request...', eventNames);
//               res.send(eventNames);
//             }
//           });

//       }
//     });
// }


exports.getEventsFromEventbrite = function(req, res) {

  var lattitude = Number(req.query.lattitude);
  var longitude = Number(req.query.longitude);

  // console.log('lattitude inside utils getEventsFromEventbrite',lattitude);
  // console.log('longitude inside utils getEventsFromEventbrite',longitude);

  let options = {
    url: `https://www.eventbriteapi.com/v3/events/search/?q=music&location.within=20mi&location.latitude=37.5482697&location.longitude=-121.9885719`,
    json:true,
    headers: {
      'User-Agent': 'request',
      "Content-Type": "application/json",
      // 'Authorization': 'Bearer ' + EVENTBRITE_OAUTH_TOKEN,
      "Access-Control-Allow-Origin": true
    }
  };

  console.log('Environmental variables..', process.env);
  https.get(`https://www.eventbriteapi.com/v3/events/search/?token=${EVENTBRITE_OAUTH_TOKEN}&q=music&location.within=20mi&location.latitude=${lattitude}&location.longitude=${longitude}`, (resp) => {
    let data = '';
    let eventNames = [];
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log('eventbrite response data is...', data);
      if ( data.hasOwnProperty('top_match_events') ) {
        var results = JSON.parse(data).top_match_events;
      } else {
        var results = JSON.parse(data).events;
      }
      var top10Events = results.length >= 10 ? results.slice(0,10) : results;

      if (top10Events.length > 0 ) {
        top10Events.map(event => eventNames.push(JSON.stringify({
          'name':event.name.text,
          'description':event.description.text,
          'url':event.url,
          'localtime':event.start.local,
          'free':event.is_free
        })));
        // console.log('Success in https get',eventNames);
        res.send(eventNames)
      }
    });

  }).on("error", (err) => {
    console.log("Error in https get: " + err.message);
  });

}










exports.getImageLinks = function(req, res) {

  let suggestionLink = req.query.link || `https://freeradikal.smugmug.com/`;
  let options = {
    url: `https://api.diffbot.com/v3/image?token=${DIFFBOT_API_KEY}&url=${suggestionLink}`,
    json:true,
    headers: {
      'User-Agent': 'request',
      "Content-Type": "application/json",
      'DIFFBOT-API-KEY':`${DIFFBOT_API_KEY}`,
      "Access-Control-Allow-Origin": true
    }
  };


  // res.send('https://photos.smugmug.com/Travel/Italy-Venizia/i-fhbXXKs/0/921a50aa/M/IMG_0992_3_4_tonemapped-M.jpg');

  request(options, function(err, response, body) {
    // console.log('-----------------------------------------------------');
    // console.log('inside getImageLinks, link is...', suggestionLink);
    if(err){
      console.log('ERROR: in utils.getImageLinks ', err.message);
    } else {
      var results = body.objects;
      let url = [];
      if ( results && results.length > 0 ) {
        url.push(results[0].url);
      }

      // console.log('SUCCESS: response in diffbot Request...', results ? results : 'no results');
      res.send(url);
      // res.send('https://photos.smugmug.com/Travel/Italy-Venizia/i-fhbXXKs/0/921a50aa/M/IMG_0992_3_4_tonemapped-M.jpg');
      // callback(null,results);
    }
  });
}

// ------------------------------ END Third Party API calls (google, diffbot) ------------------------------------ //


// ------------------------------ Authentication Logic ---------------------------------- //

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

//check if user is logged in or not
exports.checkUser = function(req, res, next) {
  var username = 'not logged in';
  if (!exports.isLoggedIn(req)) {
    res.render('index', {data:username})
  } else {
    username = req.session.user;
    res.render('index',  {data:username});
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.render('index', {data: newUser});
  });
};

exports.handleLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query('select username, password from users where username='+JSON.stringify(username), function(err, results){
    if (err) {
      console.log(err);
    } else {
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function(err, result){
          if (err) {
            console.log(err);
          } else {
            if (result) {
              exports.createSession(req, res, username);
            } else {
              res.redirect('login.html');
            }
          }
        });
      } else {
        res.redirect('signup.html');
      }
    }
  });
};


exports.handleSignup = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var hash = bcrypt.hashSync(password);
  connection.query('insert into users (username, password) values ('+ JSON.stringify(username) +','+ JSON.stringify(hash) +')', function(err, results){
    if (err) {
      console.log(err.sqlMessage);
      res.redirect('signup.html');
    } else {
      exports.createSession(req, res, username);
    }
  });
};

exports.handleLogout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

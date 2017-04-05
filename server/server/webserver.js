"use strict";

var express    = require('express');
var bodyParser = require('body-parser');
var http       = require('http');
var path       = require('path');
var webapp     = express();
var webserver  = http.Server(webapp);
var webroot    = path.resolve(__dirname, '..', 'client');

class Webserver {

  constructor() {
    webapp.use(express.static(webroot));
    webapp.get('/api/fetchData', function(request, response) {
      response.send(JSON.stringify({
        status: 'ok',
        arrivals: app.cache,
        departures: app.lastDeparted
      }));
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      webserver.listen(8080, '0.0.0.0', 511, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Listening for connections on port 8080`);
          resolve();
        }
      });
    });
  }

}

module.exports = Webserver;

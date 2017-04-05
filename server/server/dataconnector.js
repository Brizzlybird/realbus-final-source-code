"use strict";

var request = require('request');

var requests = {
  'cheddar': '/api/2.0/rti/report?stopID=0100BRA10081&maxItems=10',
  'bishopsworth': '/api/2.0/rti/report?stopID=0100BRA10086&maxItems=10',
  'bishport': '/api/2.0/rti/report?stopID=0100BRA10108&maxItems=10',
  'hengrove': '/api/2.0/rti/report?stopID=0100FBX18342&maxItems=10'
};

var params = {
  host: "https://bristol.api.urbanthings.io",
  key:  "FphsGgd3JUewBKxfkpFlbQ"
};

var options = {
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key":    params.key
  }
};

class DataConnector {

  //Call when app starts then every minute
  getData() {

    var apiRequests = [];

    apiRequests.push(this.getRequest(params.host + requests.cheddar));
    apiRequests.push(this.getRequest(params.host + requests.bishopsworth));
    apiRequests.push(this.getRequest(params.host + requests.bishport));
    apiRequests.push(this.getRequest(params.host + requests.hengrove));

    // then do a Promise.all on your array of Promises, and act on the result
    return Promise.all(apiRequests);

  }

  getRequest(url) {
      options.url = url;
      return new Promise(function (success, failure) {
          request(options, function (error, response, body) {
              if (!error) {
                  success(body);
              } else {
                  failure(error);
              }
          });
      });
  }

}

module.exports = DataConnector;

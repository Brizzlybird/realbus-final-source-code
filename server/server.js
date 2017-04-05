/**
 * Realbus - description
 * @author clare marsh
 */

"use strict";

var Components = {
  Webserver:     require('./server/webserver'),
  DataConnector: require('./server/dataconnector')
};

class RealbusServer {

  /**
   * Constructor
   */
  constructor() {

    this.cache         = {};
    this.lastDeparted  = {};
    this.webserver     = new Components.Webserver();
    this.dataconnector = new Components.DataConnector();
    this.scheduler     = require('node-schedule');

  }

  /**
   * Initialize the application
   */
  start() {

    var server = this;

    this.webserver.start();
    this.updateData();

    this.scheduler.scheduleJob('12 * * * * *', this.updateData);

  }

  updateData() {

    app.dataconnector.getData().then(

      results => {

        // iterate over upcoming calls for each vehicle - if the upcoming call is in the past, move to app.lastDeparted[vehicleId]
        // also check the item we're about to move is later than the one in lastDeparted (if one exists), so we always end up with
        // the last departed stop in lastDeparted
        for (let vehicleId in app.cache)
          for (let upcomingCall of app.cache[vehicleId])
            if ((new Date(upcomingCall.expected) - new Date()) < 0)
              if (!(vehicleId in app.lastDeparted) || (new Date(app.lastDeparted[vehicleId].expected) - new Date(upcomingCall.expected)) < 0)
                app.lastDeparted[vehicleId] = upcomingCall;

        // empty the cache afterwards, then we can refill it
        app.cache = {};

        for (let result of results) {

          try {
            result = JSON.parse(result);
          } catch (e) {
            console.error('There was a problem parsing the JSON data:');
            console.error(e.message);
            continue;
          }

          let stopID = result.data.stopID;
          let report = result.data.rtiReports[0];

          try {

            if ('upcomingCalls' in report) {

              // for each item in upcomingCalls ..
              for (let i in report.upcomingCalls) {

                let upcomingCall = report.upcomingCalls[i];

                // we're only interested in records that have a unique identifier we can identify the bus by (vehicleID)
                if ('vehicleID' in upcomingCall.vehicleRTI) {

                  let vehicleID = upcomingCall.vehicleRTI.vehicleID;

                  // if an entry for the vehicleID does not exist in cache, create an empty array
                  if (!(vehicleID in app.cache))
                    app.cache[vehicleID] = [];

                  // then push some info about upcoming call into it ..
                  app.cache[vehicleID].push({
                    stopID:   upcomingCall.stopID,
                    stopName: upcomingCall.stopName,
                    route:    upcomingCall.routeInfo.lineName,
                    expected: upcomingCall.expectedDepartureTime
                  });

                }

              }

            }
          } catch (e) {
            console.error('An error occurred processing upcomingCalls:', e);
          }

        }

        // when done, sort each cache entry by expected departure time
        for (let vehicleID in app.cache)
          app.cache[vehicleID].sort((a, b) => {
            return new Date(a.expected) - new Date(b.expected);
          });

        console.log(JSON.stringify(app.cache, null, 2));
        console.log(JSON.stringify(app.lastDeparted, null, 2));

      }

    ).catch(error => {
      console.error(error);
    }); 

  }


}

global.app = new RealbusServer();
app.start();

// Create an angular app.

app = angular.module('realbus', [
  'ngAnimate'
]);


// Build an Angular controller. This will control everything that happens within the front end of the application
app.controller('BusCtrl', function($scope, $http, $interval) {


  // The URL that will connect to the Node server in order to retrieve bus data
  var url = "/api/fetchData";


  // Array of bus stops and ids to ng-repeat over in HTML file
  $scope.bus_stop = [
    'cheddar-grove-0100BRA10081',
    'bishopsworth-0100BRA10086',
    'bishport-0100BRA10108',
    'hengrove-0100FBX18342',
  ];


  // SVGs cannot be dynamically created using Angular or jquery. This functions makes it possible
  $scope.createBus = function(tag, attrs) {
      var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs)
          el.setAttribute(k, attrs[k]);
      return el;
  }


  // Function that collects the data from the node server
  // and performs all the necessary calculations to place a bus icon on the SVG map
  $scope.updateMap = function() {
    console.log('retrieving new data ...');

    // Get data from node....
    var responsePromise = $http.get(url)
    .then(function(response) {
      $('#bus-icons').html('');

      // Loop through every index of the JSON file, performing the calculations and adding to the map.
      for (var vehicleId in response.data.arrivals) {
          var nextArrival = response.data.arrivals[vehicleId][0];
          if (nextArrival.route == '75'){
            if (!(vehicleId in response.data.departures)) {
              console.log('Unable to calculate animation for ' + vehicleId);
              continue;
            }
            var lastDeparture     = response.data.departures[vehicleId];
            var nextArrivalTime   = nextArrival.expected;
            var lastDepartureTime = lastDeparture.expected;

            // Returns all the integers (in seconds) required to position the bus icon at the correct place on the map
            var animationDuration = (new Date(nextArrivalTime) - new Date()) / 1000;
            var animationOffset   = ((new Date() - new Date(lastDepartureTime)) / (new Date(nextArrivalTime) - new Date(lastDepartureTime))) * 100;
            console.log('Animation duration: ' + animationDuration + ' secs');
            console.log('Offset ' + animationOffset + '%');
            var pathClass = 'path-' + lastDeparture.stopID + '-' + nextArrival.stopID;


            // Call the early createBus function and then perform the animations on an icon
            var bus = $scope.createBus('rect', {width: 30, height: 15, id: 'bus-icon-' + vehicleId, class: 'bus-icon ' + pathClass});
            document.getElementById('bus-icons').appendChild(bus);
            document.getElementById('bus-icon-' + vehicleId).animate([
                 { offsetDistance: animationOffset + '%' },
                 { offsetDistance: '100%' }
            ], animationDuration * 1000);
        }
      }
      console.log(response);
    }).catch(function(error) {
      console.error(error);
    });
  };

// $interval sets the interval at which the updateMap function should be run. In this case it runs every 20 seconds
// and updates the position of the buses if there is new date or if the times have changed
  $scope.updateMap();
  $interval($scope.updateMap, 20000);

});

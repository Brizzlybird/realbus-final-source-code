// Using JS to animate the motion path will
// all me to have more control and will
// make development much easier when the
// I start to integrate Angular into the app
//
// var busIcon = document.getElementById("bus-icon");
//
// busIcon.animate([
//     { offsetDistance: 0 },
//     { offsetDistance: '100%' }
//   ], 30000);

  // jQuery.ajax (jQuery.post) that returns data from server
  // Send random number. When I get this response, run this code.
  // If bus icon gets ahead of actual bus, pause animation somehow.

  // this is an example response which your node app would probably return as JSON.
  // var exampleResponse = {
  //     startOffset: 45,
  //     duration:    30000
  // };

  // send a post request to some url your node app is handling
  // $.post('/my/ajax/url', { /* pass any parameters to the node app here if you need to */ }, function(data, status) {
  //     // you'll need to do something with JSON.parse on the data that comes back, to turn it into a javascript object
  //     // we can access variables on - probably this:
  //     data = JSON.parse(data);
  //
  //     // then call your function to start the animation, using the 'startOffset' and 'duration' parameters
  //     // your node app is passing back
  //     busIcon.animate([
  //         { offsetDistance: data.startOffset + '%' },
  //         { offsetDistance: '100%' }
  //     ], data.duration);
  //
  // });

  // basically that anyway - some of the details might be slightly wrong, but check
  // the docs and do something along those lines

// server.js
// where your node app starts
var Raven = require('raven');
Raven.config('https://7cc0e9a88b0241ffb013cf46e406f842@sentry.io/1239319', {
  release: '1.3.0'
}).install();
var cron = require('node-cron');

var cloudinary = require('cloudinary');
// init project
var http = require('http');
var axios = require('axios');
cloudinary.config({ 
  cloud_name: process.env.NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


var task =cron.schedule('*/1 * * * *', function(){
  cloudinary.uploader.upload("https://source.unsplash.com/random", function(result) { 
    var response=JSON.stringify(result);
  console.log(response) ;
   // var results=JSON.parse(response);
   try {
    // Send a POST request
axios({
  method: 'post',
  url: 'https://pb-egxibwlyms.now.sh/photos',
  
  data: response,
   headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
  });
} catch (e) {
    Raven.captureException(e);
}
  });
  console.log('running a task every minute');
});
 //create a server object:
http.createServer(function (req, res) {
  res.write('uploaded'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
// Optionally the request above could also be done as
Raven.config('https://7cc0e9a88b0241ffb013cf46e406f842@sentry.io/1239319').install(function (err, initialErr, eventId) {
  console.error(err);
  process.exit(1);
});
try {
    task.start();
} catch (e) {
    Raven.captureException(e);
}



// connect to database
var horizon = Horizon({host: 'localhost:8181'});
horizon.onReady(function() {
  console.log("Connected to Horizon.")
});
horizon.connect();


//var space = horizon("space-status");

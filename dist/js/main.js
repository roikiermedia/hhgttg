
// connect to database
var horizon = Horizon({host: 'localhost:8181'});
horizon.onReady(function() {
  console.log("Connected to Horizon.")
});
horizon.connect();


var articles = horizon("articles");
var history = horizon("history");


//generate UUIDs
function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

var express = require('express');
var router = express.Router();
var fs = require("fs");
var gpio = require("gpio");
var async = require("async");
var Bleacon = require('bleacon');

var listOfBeacons = ["11111","22222","33333"];

var uuid = 'b9407f30f5f8466eaff925556b57fe6d';

var availableBeacons = {};
var registeredBeacons = [];
var availableSounds;

var majorKeys;

function getListOfBeacons(){

  return function (callback) {

  fs.exists("./data/beacons.json", function(exists){
    if(exists){ // results true
       fs.readFile("./data/beacons.json", {encoding: "utf8"}, function(err, data){
          if(err){
             console.log(err)
          }
          registeredBeacons = [];
          //availableBeacons = JSON.stringify(data);              
          //return JSON.stringify(data);
          data = JSON.parse(data);

			majorKeys = Object.keys(data);
			majorKeys.forEach(function(item){
			registeredBeacons.push(data[item].name);
});
          callback (null, registeredBeacons);
          return data;
       })
    }
    else{
      console.log("File does not exist!");
    }
 });
}
}
function getAvailableBeacons(){
  return function (callback) {
  availableBeacons.push("HALLO");
  console.log(availableBeacons);
  callback(null, availableBeacons);
  return availableBeacons;

  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  async.waterfall([
    getListOfBeacons()
],
    function (err, beacons_data) {
		
	async.waterfall([
    getListOfBeacons()
],
    function (err, beacons_data) {
      res.render('index', { title: 'Anti Lost Device', beaconsList: beacons_data, beaconsAvailable: JSON.stringify(availableBeacons), soundsAvailable: availableSounds});
});
});
});

router.post("/ibeacon", function(req,res,next){
  async.waterfall([
    addBeaconToList(req.body)
],
    function (err, status) {
      res.send(status);
});

});

router.get("/playSound", function(req,res,next){
	gpio17 = gpio.export(17, {
		ready: function() {
			if(gpio17.value != 1){
				intervalTimer = setInterval(function() {
					gpio17.set();
					setTimeout(function() { gpio17.reset(); }, 250);
				}, 	1000);
			}
		}
	});
	setTimeout(function(){
		
		clearInterval(intervalTimer);          // stops the voltage cycling 
		gpio17.removeAllListeners('change');   // unbinds change event 

		gpio17.reset();
		gpio17.unexport(function() {
		isBeaconBeeping = false;
		});
	}, 4000);

});


router.get("/ibeacon", function(req,res,next){

  async.waterfall([
    getNearbyBeacons()
],
    function (err, beacons_data) {
      res.send(beacons_data);
});

});

function addBeaconToList(b_data){

  return function (callback) {

    fs.exists("./data/beacons.json", function(exists){
      if(exists){ // results true
         fs.readFile("./data/beacons.json", {encoding: "utf8"}, function(err, data){
            if(err){
               console.log(err)
            }

            var new_data = {
				"name": b_data.name,
				"uuid": b_data.uuid,
				"sound": b_data.sound
            }
          var temp = b_data.major;

          data = JSON.parse(data);

          data[temp]= new_data;

            fs.writeFile("./data/beacons.json", JSON.stringify(data), "utf8", function(err){
              if(err){
                 console.log(err)
              }
              //availableBeacons = JSON.stringify(data);              
              //return JSON.stringify(data);
              callback (null, data);
              return data;
           });
         });
      }
      else{
        console.log("File does not exist!");
      }
   });
  }

}

function getNearbyBeacons(){
	return function(callback){
	var isFound = false;
	availableBeacons = {};
	if(!isFound){
			Bleacon.startScanning(uuid);
		}

		Bleacon.on("discover", function(bleacon){
	
			var major = bleacon.major;

	if(bleacon.accuracy <= 0.3 && majorKeys.indexOf(major.toString()) <0){
		availableBeacons[bleacon.major] = bleacon.uuid;
		Bleacon.stopScanning();
		isFound = true;
		callback(null, availableBeacons);
	}
		//availableBeacons = bleacon.major;
});

}
}


module.exports = router;

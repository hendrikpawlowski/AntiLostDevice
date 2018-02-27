var Bleacon = require('bleacon');
var gpio = require("gpio");
var gpio17, gpio18, gpio27, intervalTimer;
var fs = require("fs");
var async = require("async");
 
var uuid = 'b9407f30f5f8466eaff925556b57fe6d';
 
//var major = 37080; //37738 0 - 65535

var isBeeping = {};

var isBeaconBeeping = false;
var isRunning = false; 
var knownBeacons;

var rangeCounter = {};

var keysMajor;
 
gpio18 = gpio.export(18, {
	direction: "in",
	ready: function(val){
		if(val == 1){
			gpio27.set();
			isRunning = true;
			Bleacon.startScanning(uuid, major);
		}	
	}
});

gpio17 = gpio.export(17, {
	ready: function(){
	}
});

gpio27 = gpio.export(27, {
	ready: function(){
	}
});

console.log(gpio18.value)
console.log(gpio27.value)


/*
if(gpio18.value == 1){
	gpio27.set();
	isRunning = true;
	Bleacon.startScanning(uuid, major);
}
*/
gpio18.on("change", function(val){
	console.log(val)
	if (val == 1) {
		
		async.waterfall([
			getBeaconConfig()
		],
		function (err, listBeacons) {
			knownBeacons = listBeacons;
			gpio27.set();
			isRunning = true;
			keysMajor = Object.keys(listBeacons);
			keysMajor.forEach(function(item){
				isBeeping[item] = false;
				rangeCounter[item] = 0;
			});
			console.log(isBeeping);
			Bleacon.startScanning(uuid);
		});
		
		

		
	}
	else {
		gpio27.set(0);
		Bleacon.stopScanning();
		
		if (isRunning == true) {
			
			clearInterval(intervalTimer);          
			gpio17.removeAllListeners('change');
			gpio17.reset();
			gpio17.set(0);
		}
		isRunning = false;
	}
});

Bleacon.on("discover", function(bleacon){
	
		
		if(keysMajor.indexOf(bleacon.major.toString()) >-1){
			if(bleacon.accuracy >= 1 && !isBeeping[bleacon.major] && !isBeaconBeeping){
				rangeCounter[bleacon.major] +=1;
				console.log(rangeCounter);
				
				if(rangeCounter[bleacon.major] >= 2){
					isBeeping[bleacon.major] = true;
					rangeCounter[bleacon.major] = -2;			
					piepON(bleacon);
				}
					
			} 
			else if(bleacon.accuracy < 1 && isBeeping[bleacon.major]) {
				rangeCounter[bleacon.major] +=1;
				if(rangeCounter[bleacon.major] >= 0){
					piepOFF(bleacon);
					isBeeping[bleacon.major] = false;
					console.log(bleacon.major+ " : stopping alarm...");
				}	
			}
			else {
				if(!isBeeping[bleacon.major]){
					rangeCounter[bleacon.major] = 0;
				}
			}		
			console.log(bleacon.major+ " : "+bleacon.accuracy+ " : "+rangeCounter[bleacon.major]);
		}
});


function piepON(bleacon){
	if(isBeaconBeeping == false) {
		isBeaconBeeping = true;
		console.log("----- Start of Alarm -----")
		console.log(bleacon.major+' außer Reichweite ('+bleacon.accuracy+')'); 
		gpio17 = gpio.export(17, {
			ready: function() {
				if(gpio17.value != 1){
					intervalTimer = setInterval(function() {
						gpio17.set();
						setTimeout(function() { gpio17.reset(); }, 1000);
					}, 	knownBeacons[bleacon.major].sound);
				}
			}
		});
	}
}
	
function piepOFF(bleacon){
	setTimeout(function(){
		
		console.log(bleacon.major+' nicht mehr außer Reichweite ('+bleacon.accuracy+')'); 
		clearInterval(intervalTimer);          // stops the voltage cycling 
		gpio17.removeAllListeners('change');   // unbinds change event 

		gpio17.reset();
		gpio17.unexport(function() {
			// unexport takes a callback which gets fired as soon as unexporting is done 
			//process.exit(); // exits your node program 
		console.log("----- End of Alarm -----")
		isBeaconBeeping = false;
		});
	}, 4000);
	
}

function existBeacon(bleacon){
	
	
}

function getBeaconConfig(){
	
	return function (callback) {
	var bList = [];
	
	fs.exists("../data/beacons.json", function(exists){
		if(exists){
			fs.readFile("../data/beacons.json", {encoding: 'utf8'}, function(err, data){
				if(err) console.log(err);
				data = JSON.parse(data);

				callback (null, data);
			});
			

		}
		else {
			console.log("File does not exists");
		}
	});
}

}





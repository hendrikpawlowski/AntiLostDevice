var fs = require("fs");
var util = require("util");

var async = require("async");
/*
console.log("------ START ------");
fs.exists("temp.json", function(exists){
	if(exists){
		fs.readFile("temp.json", {encoding: 'utf8'}, function(err, data){
			if(err) console.log(err);
				data = JSON.parse(data);
				var keys = Object.keys(data);
				for(var i = 0; i < keys.length; i++){
					console.log("New Beacon");
					console.log("NAME: "+data[keys[i]].name);
					console.log("UUID: "+data[keys[i]].uuid);
					console.log("MAJOR: "+data[keys[i]].major);
					console.log("SOUND: "+data[keys[i]].sound);
					console.log("");
				}
			//callback(null);
		});
	}
	else {
		console.log("File does not exists");
	}
});
console.log("------ END ------");
*/

  async.waterfall([
    getBeaconConfig()
],
    function (err, listBeacons) {
		
		var major = "37080";
		
		var majorKeys = Object.keys(listBeacons)
		majorKeys.forEach(function(item){
		console.log(util.inspect(listBeacons[major].sound, false, null))

});
      
});






function getBeaconConfig(){
	
	return function (callback) {
	var bList = [];
	
	console.log("------ Writing Beacons in Array ------");
	fs.exists("../data/beacons.json", function(exists){
		if(exists){
			fs.readFile("../data/beacons.json", {encoding: 'utf8'}, function(err, data){
				if(err) console.log(err);
				data = JSON.parse(data);

				majorKeys = Object.keys(data);
				majorKeys.forEach(function(item){
				bList.push(data[item]);
				});
				callback (null, data);
			});
			

		}
		else {
			console.log("File does not exists");
		}
	});
}

}

function Beacon(name, major, uuid, sound){
	this.name = name; 
	this.major = major; 
	this.uuid = uuid; 
	this.sound = sound;
}



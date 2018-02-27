function addBeacon(){
    console.log("It's working! :D");

    var name = document.getElementById("name").value;
    var uuid = document.getElementById("uuid").value;
    var major = document.getElementById("major").value;
    var sound = document.getElementById("sound").value;

    var newBeaconObject = {};
    

    newBeaconObject = {
        "name": name,
        "uuid": uuid,
        "major": major,
        "sound": sound
    }
    


      request = $.ajax({url:'/ibeacon/',type:'POST', data:newBeaconObject})

      request.done(function() {
        window.location.href = "/";
      });
}
function playSound(){

	
	  request = $.ajax({url:'/playSound/',type:'GET'})

      request.done(function() {
        window.location.href = "/";
      });
	
	}

function getAvailableBeacons(){

    request = $.ajax({url:'/ibeacon/',type:'GET'})

    request.done(function(data) {
      window.location.href = "/";
    });
  }


function getBeacons(){

    var listOfBeacons = ["11111","22222","33333"];

    console.log(availableBeacons);

    return availableBeacons;
}

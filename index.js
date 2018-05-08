var express = require('express');
var app = express(); 
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://seniorLeaves.db.sqlite3');

app.use(bodyParser.urlencoded());				// Enable bodyParser on Express (for reading POST requests in request.body)
app.engine('html', mustacheExpress());			// Use mustache for HTML templates
app.set('views', __dirname + '/views');			// Tell Express where mustache templates live (the ./views folder)
app.use(express.static(__dirname + '/public'));	// Tell Express where static files (images, CSS, client-side JS, etc) live (the ./public folder)


conn.query("CREATE TABLE IF NOT EXISTS seniorLeaves (username TEXT, name TEXT, email TEXT, remaingleaves INTEGER, starttime TIMESTAMP, endtime TIMESTAMP, onleave INTEGER)");

password = "BWare"
newNumberOfLeaves = 0 

app.get("/", function(request, response) {
	response.render("login.index.html");
});


app.post("/loadUpdatePage", function(request, response) {
	/*
	if (request.body.UNInput) {
		conn.query("SELECT * FROM seniorLeaves", function(err, data){
			if (err) throw err;
			for (var i = 0; i<data.rows.length; i++){
				if (data.rows[i].username == request.body.UNInput){
					response.render("updatingStatus.html", {confusedPlatypus:request.body.UNInput});
					break
				}
				else if(i == data.rows.length - 1){
					response.render('login.failure.html');
					break
				}
			}
		});
	}
	*/
	//STEWART MORRIS HELPED DO THIS PART ABOVE (NAME INCLUDED IN README.txt)
	/*
	if (request.body.UNInput) {
		conn.query("SELECT * FROM seniorLeaves WHERE username = ?", [request.body.UNInput] , function(err, data){
			if (err) throw err;
			if (data.rows.length == 0) {
				response.render('login.failure.html');
				}
			else {
				response.render("updatingStatus.html", {confusedPlatypus:request.body.UNInput});
				}
			})
		};
		
	//SHIHAN'S CODE ABOVE
	*/
	escapekey = 0
	conn.query("SELECT password FROM seniorLeaves WHERE username =" + "'" + request.body.unique + "'")
	.on("data", function(data) {
		if (data.password == request.body.PWInput) {

			response.render("updatingStatus.html", {confusedPlatypus:request.body.unique});
			escapekey += 1

		}
	}).on("end", function() {
		if (escapekey != 1) {
			response.render("login.failure.html")
		}
	});
	//my code
	
	
});

app.get("/loadAdminLogin", function(request, response){
	response.render("adminLogin.html")
});

app.post("/loadAdminPortal", function(request, response) {
	conn.query("SELECT * FROM seniorLeaves", function(err, data) {
		/*
		.on("data", function(data) {
			stalkerPro.push(data);
		});
		*/
		if (request.body.passwordAttempt == password){
			//console.log("TEST");
			//console.log(JSON.stringify(data));
			response.render("adminPortal.html", {rows:data.rows})
			console.log("logged on as admin")
		}
		else {
			response.render("admin.login.failure.html")
		}
	});
});
	
	/*stalkerPro = []
	conn.query("SELECT * FROM seniorLeaves")
		.on("data", function(data) {
			stalkerPro.push(data);
	//stalkerPro.push("outside");
	console.log(stalkerPro);
	/*
	//if (request.body.UNInput) {
	wow = 1;
	stalkerPro = []
	conn.query("SELECT * FROM seniorLeaves", function(err, data){
		if (err) {
			console.log("heyyyyy")
		}
		else {
			stalkerPro.push("potato");
			wow += 1;
		}
	});
	console.log(wow);
	console.log(stalkerPro);
	//};
	*/
	//not done

app.get("/loadHomepage", function(request, response) {
	response.render("login.index.html");
});


var status = 0
//if status is 0, you are at school. if status is 1, you are on leave
//used for situations where seniors might press end leave even though they didn't sign up for a leave


app.post("/postTimeStart", function(request, response) {
	var userName = request.body.name
	if (status == 1) {
		response.render("updatingStatusFailure.html", {confusedPlatypus:request.body.name});
	}
	if (status != 1) {
		var d = new Date()

		if (d.getHours() < 12 && d.getHours() != 0) {
			console.log(d.getHours(), ':', d.getMinutes(), "AM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;

			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}

			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);

			conn.query("UPDATE seniorLeaves SET starttime = ? WHERE username = ?", [(d.getHours() + ':' + minutes + " " + "AM"), userName]);
			status += 1;
		}
		if (d.getHours() > 12) {
			console.log((d.getHours() - 12), ':', d.getMinutes(), "PM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  				dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			}
			var dateStamp = mm + '/' + dd + '/' + yyyy;

			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}

			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET starttime = ? WHERE username = ?", [((d.getHours() - 12) + ':' + minutes + " " + "PM"), userName]);
			status += 1;
		}


		if (d.getHours() == 12){
			console.log(d.getHours(), ':', d.getMinutes(), "PM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
	  			dd = '0' + dd
			} 
			if (mm<10) {
	    		mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;

			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}

			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET starttime = ? WHERE username = ?", [(d.getHours() + ':' + minutes + " " + "PM"), userName]);
				
			status += 1;
		}
		if (d.getHours() == 0){
			console.log((d.getHours() + 12), ':', d.getMinutes(), "AM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;
			minutes = '0' + minutes;
			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}
			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", [((d.getHours() + 12) + ':' + minutes + " " + "AM"), userName]);

			status += 1;
		
		}
		console.log("checked in");
		conn.query("UPDATE seniorLeaves SET status = ? WHERE username = ?", [1, userName]);
		conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", ["N/A", userName]);
		response.render("updatingStatus.html", {confusedPlatypus:request.body.name});
	}
});



app.post("/postTimeEnd", function(request, response){
	var userName = request.body.name
	if (status == 0) {
		response.render("updatingStatusFailure2.html");
	}
	if (status != 0) {
		var d = new Date()
		if (d.getHours() < 12 && d.getHours() != 0) {
			console.log(d.getHours(), ':', d.getMinutes(), "AM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;

			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}

			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", [(d.getHours() + ':' + minutes + " " + "AM"), userName]);
		}
		if (d.getHours() > 12){
			console.log((d.getHours() - 12), ':', d.getMinutes(), "PM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;
			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}
			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", [((d.getHours() - 12) + ':' + minutes + " " + "PM"), userName]);
		}
		if (d.getHours() == 12){
			//console.log("wow");
			console.log(d.getHours(), ':', d.getMinutes(), "PM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;
			minutes = '0' + minutes;
			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}
			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", [(d.getHours() + ':' + minutes + " " + "PM"), userName]);
		}
		if (d.getHours() == 0){
			//console.log("wow2");
			console.log((d.getHours() + 12), ':', d.getMinutes(), "AM" );
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0
			var yyyy = today.getFullYear();
			var minutes = d.getMinutes();
			var dateStamp = "";
			if (dd<10) {
  			  dd = '0' + dd
			} 
			if (mm<10) {
    			mm = '0' + mm
			} 
			var dateStamp = mm + '/' + dd + '/' + yyyy;
			minutes = '0' + minutes;
			if (d.getMinutes() < 10) {
				minutes = '0' + minutes;
			}
			conn.query("UPDATE seniorLeaves SET mostrecentleave = ? WHERE username = ?", [dateStamp, userName]);
			conn.query("UPDATE seniorLeaves SET endtime = ? WHERE username = ?", [((d.getHours() + 12) + ':' + minutes + " " + "AM"), userName]);
		}
		status -= 1;
		response.render("updatingStatus.html", {confusedPlatypus:request.body.name});
		conn.query("SELECT leavesUsed FROM seniorLeaves WHERE username = ?", [userName], function(err, numberOfLeaves) {
			newNumberOfLeaves += 1
			conn.query("UPDATE seniorLeaves SET leavesUsed = ? WHERE username = ?", [newNumberOfLeaves, userName]);
		});
		console.log("checked out");
		conn.query("UPDATE seniorLeaves SET status = ? WHERE username = ?", [0, userName]);
	}
	/*
	conn.query("SELECT * FROM seniorLeaves", function(err, data) {
		if (request.body.passwordAttempt == password){
			response.render("adminPortal.html", {rows:data.rows})
			//console.log(data)
			console.log("logged on as admin")
		}
		else {
			response.render("admin.login.failure.html")
		}
	});
	*/
});

app.post("/getUserPortalLogin", function(request, response) {
	var userName = request.body.name
	profile_data = []
	conn.query("SELECT * FROM seniorLeaves WHERE username = ?", [userName])
	.on("data", function(data) {
		profile_data.push(data);
		response.render("profilepage.html", {llamas:profile_data});
	});
});

/*
app.post("/loadProfile", function(request, response) {
	if (request.body.UNInputProfile) {
		conn.query("SELECT * FROM seniorLeaves", function(err, data){
			if (err) throw err;
			for (var i = 0; i<data.rows.length; i++){
				//console.log("wow")
				if (data.rows[i].password == request.body.UNInputProfile){
					response.render("profilepage.html", {llamas:request.body.UNInputProfile.name});
					break
				}
				else if(i == data.rows.length - 1){
					response.render('login.failure.html');
					break
				}
			}
		});
	}
})
*/

app.post("/stalkStudent", function(request, response) {
	data = []
	if (request.body.UNSTALK) {
		conn.query("SELECT * FROM seniorLeaves", function(err, data){
			if (err) throw err;
			for (var i = 0; i<data.rows.length; i++){
				if (data.rows[i].username == request.body.UNSTALK){
					conn.query("SELECT * FROM seniorLeaves WHERE username = ?", [request.body.UNSTALK], function(err, information) {
						if (err) throw err;
						response.render("profilepage.html", {llamas:information.rows});
					});
					break
				}
				else if(i == data.rows.length - 1){
					response.render('login.failure.html');
					break
				}
			}
		});
	}
})

app.get("/goBack!!!", function(request, response) {
	window.history.back();
})

app.listen(8081, console.log("What is Love?"));






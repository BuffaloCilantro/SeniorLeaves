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
	conn.query("SELECT password FROM seniorLeaves WHERE username =" + "'" + request.body.UNInput + "'")
	.on("data", function(data) {
		if (data.password == request.body.PWInput) {

			response.render("updatingStatus.html", {confusedPlatypus:request.body.UNInput});
			escapekey += 1

		}
	}).on("end", function() {
		if (escapekey != 1) {
			response.render("login.failure.html")
		}
	});
	
	
	
});

app.get("/loadAdminLogin", function(request, response){
	response.render("adminLogin.html")
});

app.post("/loadAdminPortal", function(request, response){
	stalkerPro = []
	conn.query("SELECT * FROM seniorLeaves")
	.on("data", function(data) {
		stalkerPro.push(data);
	});
	if (request.body.passwordAttempt == password){
		response.render("adminPortal.html", {table:stalkerPro})
	}
	else {
		response.render("admin.login.failure.html")
	};

	//not done
});

app.get("/loadHomepage", function(request, response) {
	response.render("login.index.html");
});


var status = 0
//if status is 0, you are at school. if status is 1, you are on leave
//used for situations where seniors might press end leave even though they didn't sign up for a leave


app.post("/postTimeStart", function(request, response) {
	
	var userName = request.body.name
	if (status == 1) {
		response.render("updatingStatusFailure.html");
	}
	if (status != 1) {
		var d = new Date()
		if (d.getHours() < 12) {
			console.log(d.getHours(), ':', d.getMinutes(), "AM" )
			//conn.query("INSERT", d.getHours(), ':', d.getMinutes(), "AM" ,"INTO starttime FROM seniorLeaves WHERE username=", "'", userName,"'")
		}
		if (d.getHours() > 12){
			console.log((d.getHours() - 12), ':', d.getMinutes(), "PM" )
		}
		if (d.getHours() == 12){
			console.log(d.getHours(), ':', d.getMinutes(), "PM" )
		}
		status += 1;
	}
	console.log("checked in");
});

app.post("/postTimeEnd", function(request, response){
	var name = request.body.name
	if (status == 0) {
		response.render("updatingStatusFailure2.html");
	}
	if (status != 0) {
		var d = new Date()
		if (d.getHours() < 12) {
			console.log(d.getHours(), ':', d.getMinutes(), "AM" )
		}
		if (d.getHours() > 12){
			console.log((d.getHours() - 12), ':', d.getMinutes(), "PM" )
		}
		if (d.getHours() == 12){
			console.log(d.getHours(), ':', d.getMinutes(), "PM" )
		}
		status -= 1;
	}
	console.log("checked out");
});

app.get("/getUserPortalLogin", function(request, response) {
	/*
	response.render("userProfileLogin.html", {llamas:request.body.name}, {date1: }, {time1a: }, {time1b: }, {date2: }, {time2a: }. {time2b: });
	*/
});

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

app.post("/stalkStudent", function(request, response) {
	if (request.body.UNSTALK) {
		conn.query("SELECT * FROM seniorLeaves", function(err, data){
			if (err) throw err;
			for (var i = 0; i<data.rows.length; i++){
				//console.log("wow")
				if (data.rows[i].password == request.body.STALK){
					response.render("profilepage.html", {llamas:request.body.UNSTALK.name});
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

app.listen(8081, console.log("What is Love?"));






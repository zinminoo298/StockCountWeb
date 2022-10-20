function login(db1,email,password,request,response){
    if (email == "admin@gmail.com" && password == "123456") {
		request.session.loggedin = true;
		request.session.username = "admin";
		response.send('admin')
		response.end();
	}
    else {
		if (email && password) {
			let sqlQuery = "SELECT username FROM tbl_userlogin WHERE email = ? AND password = ?";
			db1.all(sqlQuery, email, password, function (err, results) {
				if (err) console.log(err);
				if (results.length > 0) {
					console.log(results)
					request.session.loggedin = true;
					request.session.username = results[0].username;
					console.log("current user : " + request.session.username)
					response.sendStatus(200)
				}
				else {
					response.sendStatus(401)
				}
				response.end();
			});
		}
		else {
			response.sendStatus(401);
			response.end();
		}
	}

}

module.exports = { login };
var sqlite3 = require('sqlite3').verbose();
var db1 = new sqlite3.Database('master.db');
const express = require('express');
const session = require('express-session');
const fsExtra = require('fs-extra');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const path = require('path');
const app = express();
const asyn = require("async");
const filesize = require("filesize")
const download = require('download');
const moment = require("moment");
const port = 3000;
const funlogin = require("./js/login")
const funimport = require("./js/import")
const funuploadmaster = require("./js/uploadmaster")
const funimportdatatable = require("./js/importdatatableserverside")
const funuploadtrans = require("./js/uploadtrans")
const fungenerate = require("./js/generatereport")
const funreportdatatable = require("./js/reportdatatableserverside")
const funfilemanager = require("./js/filemanager")
const funnewcount = require("./js/newcount")
const funusermanager = require("./js/usermanager")

app.enable('trust proxy', true);
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);


/*=====================
	Routing to Files
	==========================*/
app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname + '/HTML/login.html'));
});

app.get('/logout', function (request, response) {
	request.session.destroy();
	response.sendFile(__dirname + '/HTML/login.html');
})

app.get('/mainmenu', function (request, response) {
	if (request.session.loggedin) {
		// Output username-
		response.sendFile(__dirname + '/HTML/import.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

app.get('/importmenu', function (request, response) {
	if (request.session.loggedin && request.session.username != "") {
		// Output username
		response.sendFile(__dirname + '/HTML/import.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
})

// app.get('/importmenu', function (request, response) {
// 	if (request.session.loggedin) {
// 		// Output username
// 		response.sendFile(__dirname + '/HTML/import.html');
// 	} else {
// 		// Not logged in
// 		response.sendFile(__dirname + '/HTML/login.html');
// 	}
// });

app.get('/uploadfiles', function (request, response) {
	if (request.session.loggedin && request.session.username != "") {
		// Output username
		response.sendFile(__dirname + '/HTML/uploadfiles.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

app.get('/summeryreport', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/HTML/summaryreport.html');
	} else {
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

app.get('/admin', function (request, response) {
	if (request.session.username == "admin" && request.session.loggedin) {
		// Output username
		response.sendFile(__dirname + '/HTML/admin.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

/*=====================
	Server side functions
	==========================*/

/* Login page start */
app.get('/login', function (request, response) {
	let email = request.query.email;
	let password = request.query.password;
	funlogin.login(db1,email,password,request,response)
});

/* Upload file to master */
app.post('/upload', function (request, response) {
	var directoryPath = __dirname + '/uploads/' + request.session.username + '/master/'
	funuploadmaster.upload(directoryPath,request,response)
});

/* Load import datatabel from serverside */
app.get('/loadimportdata_serverside', function (request, response) {
	var db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	funimportdatatable.load_serverside(db,request,response)
});

/* Import file to master */
app.post('/import', function (request, response) {
	let db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	let directoryPath = __dirname + '/uploads/' + request.session.username + '/master/'
	funimport.import_master(db, directoryPath, request, response)
});


/* Download DB api optional*/
app.get('/download', function (request, response) {
	// if (request.session.loggedin) {
	const file = `${__dirname}/master.db`;
	response.download(file); // Set disposition and send it.
	
});

/* Upload trans files api */
app.post('/upload_api', function (request, response) {
	funuploadtrans.uploadtrans_api(request,response)
});

/* Upload trans files */
app.post('/upload_multiple_files', function (request, response) {
	funuploadtrans.uploadtrans_files(request,response)
});

/* Creat user */
app.post('/create_user', function (request, response) {
	var username = request.body.username
	var password = request.body.password
	var email = request.body.email
	const dir = path.resolve(path.join(__dirname, '/uploads/', username));
	funusermanager.createuser(dir,username,password,email,db1,request,response)
})

/* Delete user */
app.post('/delete_user', function (request, response) {
	const id = request.body.id
	const username = request.body.username
	funusermanager.deleteuser(id,username,db1,request,response)
})

/* List user from db */
app.get('/load_user_serverside', function (request, response) {
	funusermanager.load_user_serverside(db1,request,response)
});

/* Generate summery report */
app.post('/generate_report', function (request, response) {
	var db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	var directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	fungenerate.generate(db,directoryPath,request,response)
});

/* Load report datatable serverside */
app.get('/load_generate_report_serverside', function (request, response) {
	var db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	funreportdatatable.loadreport(db,request,response)
});

/* get upload file list */
app.get('/get_files', function (request, response) {
	const directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	funfilemanager.getfiles(directoryPath,request,response)
});

/* delete files from upload list */
app.post('/deletefile', function (request, response) {
	const directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	var reqfilename = request.body.filename
	reqfilename = reqfilename.trim();
	funfilemanager.deletefile(directoryPath,reqfilename,request,response)
});

/* get current stoke take id from db */
app.get('/get_stocktakeid',function(request,response){
	const db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	const query = "SELECT id FROM tbl_stocktakeid"
	db.all(query,function(err,data){
		console.log(data[0])
		if(data.length != 0){
			response.send(data[0])
		}
		else{
			response.send("")
		}
	})
})

app.get('/get_username',function(request,response){
	console.log("user name"+request.session.username)
	response.send(request.session.username);
})

/* Start a new count */
app.post('/newcount', function (request, response) {
	var db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
	funnewcount.newcount(db,request,response)
})

// app.get('/landing',function(request,response){
// 	response.sendFile(__dirname + '/HTML/landing_page.html');
// })

// pool = db.serialize(function () {
// 	db.run('CREATE TABLE IF NOT EXISTS tbl_userlogin ('
// 		+ 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
// 		+ 'username varchar(50) NOT NULL,'
// 		+ 'password varchar(255) NOT NULL'
// 		+ ');');

// db.run('CREATE TABLE IF NOT EXISTS tbl_masters ('
//         + 'id INTEGER PRIMARY KEY AUTOINCREMENT,' 
// 		+ 'barcode varchar(255),'
// 		+ 'itemcode varchar(255),'
// 		+ 'description varchar(255),'
// 		+ 'onhand_qty varchar(255),'
// 		+ 'user_id int,'
// 		+ 'created_at DATE DEFAULT (datetime(now,localtime")),'
// 		+ 'updated_at DATE DEFAULT (datetime("now","localtime")))'
//         + ');');

// db.run('CREATE TABLE IF NOT EXISTS tbl_transactions ('
//         + 'id INTEGER PRIMARY KEY AUTOINCREMENT,' 
// 		+ 'scan_date varchar(255),'
// 		+ 'location varchar(255),'
// 		+ 'barcode varchar(255),'
// 		+ 'itemcode varchar(255),'
// 		+ 'scan_qty int,'
// 		+ 'inspector varchar(255),'
// 		+ 'user_id int,'
// 		+ 'created_at DATE DEFAULT (datetime("now","localtime")),'
// 		+ 'updated_at DATE DEFAULT (datetime("now","localtime")))'
//         + ');');

// db.run('Create TRIGGER trigger_tbl_transactions AFTER UPDATE ON tbl_transactions '
// 		+'BEGIN'
// 		+'UPDATE tbl_transactions SET updated_at = strftime( DateTime ("now", "localtime"))'
// 		+'WHERE id=new.id;'
// 		+'END;')

// db.run('INSERT INTO tbl_userlogin'
//         + '(password,username) VALUES'
//         + '("123456","user2")'
//         + ';');
// });







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
// const format = require("date-fns")
const moment = require("moment");
const { request } = require('https');
const port = 3000;
var invalidfilearray = []
var eachfilearray = []
var filesarray = []
var generatedfileindex = 0
var pool;
var uploadfilename;
var currentusername;
var db;

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

app.enable('trust proxy',true);
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
	// proxy: true,
//    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//    saveUninitialized:true,
//    cookie: { maxAge: 'twoDay',secure:false },
//    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

app.get('/', function (request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/HTML/login.html'));
});

app.post("/request", function (req, res) {
	res.status(200);
	res.json([{
		id_recieved: req.body.id,
		user_recieved: req.body.user
	}])
	res.end();
});

app.get('/login', function (request, response) {
	let username = request.query.username;
	let password = request.query.password;
	console.log(username);
	if (username == "admin" && password == "123456") {
		request.session.loggedin = true;
		request.session.username = username;
		// currentusername = username;
		response.send('admin')
		response.end();
	}
	else {
		if (username && password) {
			let sqlQuery = "SELECT * FROM tbl_userlogin WHERE username = ? AND password = ?";
			db1.all(sqlQuery, username, password, function (err, results) {
				if (err) console.log(err);
				if (results.length > 0) {
					request.session.loggedin = true;
					request.session.username = username;
					// currentusername = username;
					console.log("current user : " + request.session.username)
					// const dir = path.resolve(path.join(__dirname, '/uploads/', currentusername));
					// if (!fs.existsSync(dir)) {
					// 	fs.mkdirSync(dir);
					// 	fs.mkdirSync(dir + '/transaction');
					// 	fs.mkdirSync(dir + '/master');
					// }
					db = new sqlite3.Database(`uploads/${request.session.username}/master.db`);
					response.send('Login Successful')
				}
				else {
					response.send('Incorrect Username and/or Password!')
				}
				response.end();
			});
		}
		else {
			response.send('Please enter Username and Password!');
			response.end();
		}
	}
});

app.get('/logout',function(request,response){
		request.session.destroy();
		response.sendFile(__dirname + '/HTML/login.html');
})

app.get('/mainmenu', function (request, response) {
	if (request.session.loggedin) {
		// Output username-
		response.sendFile(__dirname + '/HTML/mainmenu.html');
	} else {
		// Not logged in
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

app.get('/notes', function (request, response) {
	if (request.session.loggedin) {
		res.json({ notes: "This is your notebook. Edit this to start saving your notes!" })
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
})

app.get('/importmenu', function (request, response) {
	if (request.session.loggedin) {
		// Output username
		response.sendFile(__dirname + '/HTML/import.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

app.get('/uploadfiles', function (request, response) {
	if (request.session.loggedin) {
		// Output username
		response.sendFile(__dirname + '/HTML/uploadfiles.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});

app.get('/loadimportdata', function (request, response) {
	let sqlQuery = "SELECT * FROM tbl_userlogin";
	db.all(sqlQuery, function (err, data) {
		if (err) console.log(err);
		else {
			if (data.length > 0) {
				console.log(JSON.stringify(data))
				response.send(JSON.stringify(data))
			}
		}
		response.end();
	});
});

var storageimport = multer.diskStorage({
	destination: (req, file, callBack) => {
		var dest = './uploads/' + req.session.username + '/master/'
		callBack(null, dest)
	},
	filename: (req, file, callBack) => {
		callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
		console.log(file)
		console.log(file.originalname)
	}
})

var storagetransaction = multer.diskStorage({
	destination: (req, file, callBack) => {
		var dest = './uploads/' + req.session.username + '/transaction/'
		callBack(null, dest)
	},
	filename: (req, file, callBack) => {
		callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
		console.log(file)
		console.log(file.originalname)
	}
})

app.post('/create_user', function (request, response) {
	console.log(request.body.username)
	var username = request.body.username
	var password = request.body.password
	var email = request.body.email

	const checkemailquery = `SELECT * FROM tbl_userlogin WHERE email = '${email}'`
	db1.all(checkemailquery, function (err, results) {
		if (err) {
			console.log(err)
			response.send('ERROR');
		}
		else {
			if (results.length == 0) {
				const query = `INSERT INTO tbl_userlogin (username,password,email,status) Values ('${username}','${password}','${email}','t');`
				db1.all(query, function (err, results) {
					if (err) {
						console.log(err);
						response.send('ERROR');
					}
					else {
						const dir = path.resolve(path.join(__dirname, '/uploads/', username));
						if (!fs.existsSync(dir)) {
							fs.mkdirSync(dir);
							fs.mkdirSync(dir + '/transaction');
							fs.mkdirSync(dir + '/master');
						}
						fs.copyFile('master.db', `uploads/${username}/master.db`, (err) => {
							if (err) throw err;
							console.log('master.db was copied');
						  });
						response.sendStatus(200);
					}
				});
			}
			else{
				response.sendStatus(422);
			}
		}
	})
})

app.post('/delete_user',function(request,response){
	const id = request.body.id
	const username = request.body.username
	console.log(id)
	const query = `DELETE FROM tbl_userlogin WHERE id = '${id}'`
	db1.all(query,function(err,results){
		if(err){
			console.log(err)
			response.sendStatus(500);
		}
		else{

			var dir = `uploads/${username}/`
			db1.run("DELETE FROM sqlite_sequence WHERE name='tbl_userlogin'")
			db1.run("VACUUM");
			// fsExtra.emptyDir(dir)
			if (fs.existsSync(dir)) {
				fs.rmSync(dir, {recursive: true})
			  }
			response.sendStatus(200);
		}
	})
})

app.post('/upload', function (request, response) {
	var upload = multer({
		storage: storageimport,
		limits: { fileSize: '50mb' }
	}).single('uploadfile');
	upload(request, response, function (err) {
		console.log(request.file.filename)
		if (err) {
			return response.send("Error upload file")
		}
		uploadfilename = request.file.filename
		response.send("File is uploaded")
		console.log("File uploaded")
	})
});

app.post('/import', function (request, response) {
	var chosenfile = __dirname + '/uploads/' + request.session.username + '/master/' + uploadfilename
	console.log(chosenfile)
	if (fs.existsSync(chosenfile)) {
		uploadCsv(__dirname + '/uploads/' + request.session.username + '/master', chosenfile, request, response);
	}
	else {
		response.sendStatus(404)
	}
});

app.get('/download', function (request, response) {
	// if (request.session.loggedin) {
	const file = `${__dirname}/master.db`;
	response.download(file); // Set disposition and send it.
	// }
	// else{
	// 	response.sendFile(__dirname + '/HTML/login.html');
	// }

});

function uploadCsv(dir, uriFile, request, response) {
	let stream = fs.createReadStream(uriFile);
	let csvDataColl = [];
	let fileStream = csv
		.parse()
		.on("data", function (data) {
			csvDataColl.push(data);
		})
		.on("end", function () {
			if (csvDataColl[0][0] == "barcode" && csvDataColl[0][1] == "itemcode" && csvDataColl[0][2] == "description" && csvDataColl[0][3] == "onhand_qty") {
				db.run('DELETE FROM tbl_masters;');
				db.run('DELETE FROM sqlite_sequence WHERE name="tbl_masters";');
				var query = "VACUUM;"
				db.all(query, function (err, results) {
					if (err) {
						console.log(err);
						response.sendStatus(502);
					}
					else {
						csvDataColl.shift();
						console.log(csvDataColl)
						let query = "INSERT INTO tbl_masters (barcode, itemcode, description, onhand_qty) VALUES ('" + csvDataColl[0][0] + "','" + csvDataColl[0][1] +
							"','" + csvDataColl[0][2] + "','" + csvDataColl[0][3] + "')";
						for (var i = 1; i < csvDataColl.length; i++) {
							console.log(i)
							query = query + ",('" + csvDataColl[i][0] + "','" + csvDataColl[i][1] + "','" + csvDataColl[i][2] + "','" + csvDataColl[i][3] + "')";
						}
						db.all(query, function (err, results) {
							if (err) {
								console.log(err);
								response.send('Error Import');
							}
							else {
								console.log("IMPORT HERE!")
							}
						});
						response.send('Login Successful')
					}
				})
			}
			else {
				response.sendStatus(400)
			}
			fsExtra.emptyDirSync(dir);
		});

	stream.pipe(fileStream);
}

app.post('/upload_api', function (request, response) {
	var dir = __dirname + '/uploads/'
	var upload = multer({
		storage: storageimport,
		limits: { fileSize: '50mb' }
	}).single('file');
	upload(request, response, function (err) {
		console.log(request.file.filename)
		if (err) {
			return response.send("Error upload file")
		}
		uploadfilename = request.file.filename
		response.send("File is uploaded")
	})
});


app.get('/loadimportdata_test', function (request, response) {
	let sqlQuery = "SELECT * FROM tbl_testing";
	db.all(sqlQuery, function (err, data) {
		if (err) console.log(err);
		else {
			if (data.length > 0) {
				console.log(JSON.stringify(data))
				response.send(JSON.stringify(data))
			}
			else {
				response.send([])
				console.log("no data")
			}
		}
		response.end();
	});
});

app.get('/load_user_serverside', function (request, response) {
	var draw = request.query.draw;
	var start = request.query.start;
	var length = request.query.length;
	var order_data = request.query.order;

	if (typeof order_data == 'undefined') {
		var column_name = 'tbl_userlogin.id';

		var column_sort_order = 'asc';
	}
	else {
		var column_index = request.query.order[0]['column'];

		var column_name = request.query.columns[column_index]['data'];

		var column_sort_order = request.query.order[0]['dir'];
	}

	var search_value = request.query.search['value'];

	var search_query = `
     AND (id LIKE '%${search_value}%' 
      OR username LIKE '%${search_value}%' 
      OR password LIKE '%${search_value}%' 
      OR email LIKE '%${search_value}%'
	  OR status LIKE '%${search_value}%'
     )
    `;

	let sqlQuery = "SELECT COUNT(*) AS Total FROM tbl_userlogin";
	db1.all(sqlQuery, function (err, data) {

		var total_records = data[0].Total
		console.log(total_records)
		db1.all("SELECT COUNT(*) AS Total FROM tbl_userlogin WHERE 1 " + search_query + "", function (err, data) {
			var total_records_with_filter = data[0].Total;
			var query = `
            SELECT * FROM tbl_userlogin 
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;
			var data_arr = [];
			db1.all(query, function (err, data) {
				data.forEach(function (row) {
					data_arr.push({
						'id': row.id,
						'username': row.username,
						'password': row.password,
						'email': row.email,
						'status': row.status
					});
				});
				var output = {
					'draw': draw,
					'iTotalRecords': total_records,
					'iTotalDisplayRecords': total_records_with_filter,
					'aaData': data_arr
				};
				response.json(output);
			})

		})
	});
});

app.get('/loadimportdata_serverside', function (request, response) {
	var draw = request.query.draw;
	var start = request.query.start;
	var length = request.query.length;
	var order_data = request.query.order;

	if (typeof order_data == 'undefined') {
		var column_name = 'tbl_masters.id';

		var column_sort_order = 'asc';
	}
	else {
		var column_index = request.query.order[0]['column'];

		var column_name = request.query.columns[column_index]['data'];

		var column_sort_order = request.query.order[0]['dir'];
	}

	var search_value = request.query.search['value'];

	var search_query = `
     AND (id LIKE '%${search_value}%' 
      OR barcode LIKE '%${search_value}%' 
      OR itemcode LIKE '%${search_value}%' 
      OR description LIKE '%${search_value}%'
	  OR onhand_qty LIKE '%${search_value}%'
     )
    `;

	let sqlQuery = "SELECT COUNT(*) AS Total FROM tbl_masters";
	db.all(sqlQuery, function (err, data) {
		console.log(data)
		var total_records = data[0].Total
		console.log(total_records)
		db.all("SELECT COUNT(*) AS Total FROM tbl_masters WHERE 1 " + search_query + "", function (err, data) {
			var total_records_with_filter = data[0].Total;
			var query = `
            SELECT * FROM tbl_masters 
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;

			var data_arr = [];
			db.all(query, function (err, data) {
				data.forEach(function (row) {
					data_arr.push({
						'id': row.id,
						'barcode': row.barcode,
						'itemcode': row.itemcode,
						'description': row.description,
						'onhand_qty': row.onhand_qty
					});
				});
				var output = {
					'draw': draw,
					'iTotalRecords': total_records,
					'iTotalDisplayRecords': total_records_with_filter,
					'aaData': data_arr
				};
				response.json(output);
			})

		})
	});
});

app.post('/upload_multiple_files', function (request, response) {
	var upload = multer({
		storage: storagetransaction,
		limits: { fileSize: '50mb' }
	}).array('userParamName', 10);
	// console.log(request)
	upload(request, response, function (err) {
		// console.log(request.file(0).originalname)
		if (err) {
			response.send("Error upload file")
		}

		response.send("File is uploaded")
	})

});

app.get('/summeryreport', function (request, response) {
	if (request.session.loggedin) {
		// Output username
		response.sendFile(__dirname + '/HTML/summaryreport.html');
	} else {
		// Not logged in
		response.sendFile(__dirname + '/HTML/login.html');
	}
});
const run = asyn => {

}
app.post('/generate_report', function (request, response) {
	var directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	// const directoryPath = path.join(__dirname, 'uploads');
	//passsing directoryPath and callback function
	fs.readdir(directoryPath, function (err, files) {
		//handling error
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		//listing all files using forEach
		var total_files = files.length
		console.log(files)
		try {
			if (total_files != 0) {
				var i = 0
				db.run('DELETE FROM tbl_transactions');
				db.run('DELETE FROM sqlite_sequence WHERE name="tbl_transactions"');
				db.run('VACUUM');
				generatedfileindex = 0
				invalidfilearray = []
				files.forEach(function (file) {
					i++
					var stats = fs.statSync(directoryPath + '/' + file)
					// console.log(stats.size / (1024 ** 2) + 'MB');
					uploadCsvSummaryReport(directoryPath + file, total_files, i, request, response);
				});
			}
			else {
				response.sendStatus(404);
			}
		} catch (e) {
			console.log(e)
		}

	});
});

function uploadCsvSummaryReport(uriFile, total_files, fileindex, request, response) {

	let stream = fs.createReadStream(uriFile);
	let csvDataColl = [];
	let fileStream = csv
		.parse()
		.on("data", function (data) {
			csvDataColl.push(data);
		})
		.on("end", function () {
			if (csvDataColl[0][0] == "location" && csvDataColl[0][1] == "barcode" && csvDataColl[0][2] == "itemcode" && csvDataColl[0][3] == "scan_qty" && csvDataColl[0][4] == "scan_date" && csvDataColl[0][5] == "inspector" && csvDataColl[0][6] == "user_id") {
				csvDataColl.shift();
				let query = "INSERT INTO tbl_transactions (location, barcode, itemcode, scan_qty, scan_date, inspector, user_id) VALUES ('" + csvDataColl[0][0] + "','" + csvDataColl[0][1] +
					"','" + csvDataColl[0][2] + "','" + csvDataColl[0][3] + "','" + csvDataColl[0][4] + "','" + csvDataColl[0][5] + "','" + csvDataColl[0][6] + "')";
				for (var i = 1; i < csvDataColl.length; i++) {
					console.log(i)
					query = query + ",('" + csvDataColl[i][0] + "','" + csvDataColl[i][1] + "','" + csvDataColl[i][2] + "','" + csvDataColl[i][3] + "','" + csvDataColl[i][4] + "','" + csvDataColl[i][5] + "','" + csvDataColl[i][6] + "')";
				}
				db.all(query, function (err, results) {
					if (err) {
						console.log(err);
						response.send('Error Import');
					}
					else {
						fs.unlinkSync(uriFile)
						generatedfileindex++
						console.log(total_files + "/" + generatedfileindex)
						if (total_files == generatedfileindex) {
							response.send(`${invalidfilearray.length}` + "/" + `${total_files}`)
						}
					}
				});
			}
			else {
				console.log(uriFile)
				invalidfilearray.push(uriFile)
				generatedfileindex++
				console.log(total_files + "/" + generatedfileindex)
				if (total_files == generatedfileindex) {
					response.send(`${invalidfilearray.length}` + "/" + `${total_files}`)
				}
			}
		});
	stream.pipe(fileStream);
}

app.get('/load_generate_report_serverside', function (request, response) {
	var draw = request.query.draw;
	var start = request.query.start;
	var length = request.query.length;
	var order_data = request.query.order;

	if (typeof order_data == 'undefined') {
		var column_name = 'm.id';

		var column_sort_order = 'asc';
	}
	else {
		var column_index = request.query.order[0]['column'];
		if (column_index == 1 || column_index == 6 || column_index == 8 || column_index == 9) {
			var column_name = "t." + request.query.columns[column_index]['data'];
		}
		else {
			if (column_index == 7) {
				var column_name = request.query.columns[column_index]['data'];
			}
			else {
				var column_name = "m." + request.query.columns[column_index]['data'];
			}
		}
		console.log(column_name)

		var column_sort_order = request.query.order[0]['dir'];
	}

	var search_value = request.query.search['value'];

	var search_query = `
     AND (m.id LIKE '%${search_value}%'
      OR t.location LIKE '%${search_value}%' 
      OR m.barcode LIKE '%${search_value}%'
	  OR m.itemcode LIKE '%${search_value}%'
	  OR m.description LIKE '%${search_value}%' 
	  OR m.onhand_qty LIKE '%${search_value}%' 
	  OR t.scan_qty LIKE '%${search_value}%'
	  OR (m.onhand_qty-t.scan_qty) LIKE '%${search_value}%' 
	  OR t.scan_date LIKE '%${search_value}%' 
	  OR t.inspector LIKE '%${search_value}%'
     )
    `;

	let sqlQuery = "SELECT COUNT(*)FROM tbl_masters as m LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode";
	db.all(sqlQuery, function (err, data) {
		var total_records = data[0].Total
		console.log(total_records)
		db.all("SELECT COUNT(*) as Total FROM tbl_masters as m LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode WHERE 1 " + search_query + "", function (err, data) {
			var q = "SELECT COUNT(*) as Total FROM tbl_masters as m LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode WHERE 1 " + search_query + ""
			console.log(q)
			var total_records_with_filter = data[0].Total;
			var query = `
            SELECT m.id,t.location,m.barcode,m.itemcode,m.description,m.onhand_qty,t.scan_qty,(m.onhand_qty-t.scan_qty) as diff ,t.scan_date,t.inspector FROM tbl_masters as m
 			LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;
			console.log(query)
			var data_arr = [];
			db.all(query, function (err, data) {
				data.forEach(function (row) {
					data_arr.push({
						"id": row.id,
						"location": row.location,
						"barcode": row.barcode,
						"itemcode": row.itemcode,
						'description': row.description,
						'onhand_qty': row.onhand_qty,
						'scan_qty': row.scan_qty,
						'diff': row.diff,
						'scan_date': row.scan_date,
						'inspector': row.inspector
					});
				});
				var output = {
					'draw': draw,
					'iTotalRecords': total_records,
					'iTotalDisplayRecords': total_records_with_filter,
					'aaData': data_arr
				};
				response.json(output);
			})
		})
	});
});

app.get('/get_files', function (request, response) {
	const directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	// const directoryPath = path.join(__dirname, 'uploads');
	//passsing directoryPath and callback function
	fs.readdir(directoryPath, function (err, files) {
		filesarray.length = 0
		//handling error
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		//listing all files using forEach
		var total_files = files.length
		try {
			var i = 0
			files.forEach(function (file) {
				i++
				var stats = fs.statSync(directoryPath + file)
				eachfilearray.length = 0
				eachfilearray.push(file, filesize(stats.size), stats.birthtime.toUTCString())
				var file_obj = {}
				file_obj.fname = file
				file_obj.fsize = filesize(stats.size)
				try {

					file_obj.ftime = moment(stats.birthtime).format("MMM DD YY, hh:mm a")
				} catch (e) {
					console.log(e)
				}
				filesarray.push(file_obj)

				if (total_files == i) {
					// console.log(filesarray)
					response.send(filesarray)
				}
			});
		} catch (e) {
			console.log(e)
		}

	});
});

app.post('/deletefile', function (request, response) {
	const directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	//passsing directoryPath and callback function

	var reqfilename = request.body.filename
	reqfilename = reqfilename.trim();
	try {
		fs.unlinkSync(directoryPath + reqfilename)
		response.send("200")
	} catch (e) {
		console.log(e)
	}
});

app.get('/downloadfile', function (request, response) {
	// if (request.session.loggedin) {
	const directoryPath = __dirname + '/uploads/' + request.session.username + '/transaction/'
	var reqfilename = request.headers.filename
	// console.log(reqfilename)
	// // reqfilename = reqfilename.trim();
	// console.log(directoryPath + reqfilename)
	// const file = `${__dirname}/master.db`;
	// const file1 = '/Users/admin/Desktop/PBC/node_project/StockCountWeb/uploads/user1/transaction/userParamName-1662974694685.csv'
	// response.download(file1);

	const file = __dirname + '/uploads'
	const filePath = directoryPath + reqfilename
	download(filePath, file).then(() => {
		console.log('Download Completed')
		response.sendStatus(200);
	})

});






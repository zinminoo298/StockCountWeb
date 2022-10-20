const fs = require('fs');
const path = require('path');

function createuser(dir,username,password,email,db1,request,response){
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
			else {
				response.sendStatus(422);
			}
		}
	})
}

function deleteuser(id,username,db1,request,response){
	const query = `DELETE FROM tbl_userlogin WHERE id = '${id}'`
	db1.all(query, function (err, results) {
		if (err) {
			console.log(err)
			response.sendStatus(500);
		}
		else {

			var dir = `uploads/${username}/`
			db1.run("DELETE FROM sqlite_sequence WHERE name='tbl_userlogin'")
			db1.run("VACUUM");
			if (fs.existsSync(dir)) {
				fs.rmSync(dir, { recursive: true })
			}
			response.sendStatus(200);
		}
	})
}

function load_user_serverside(db1,request,response){
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
}

module.exports = { createuser, deleteuser, load_user_serverside };

const fs = require('fs');
const csv = require('fast-csv');
const e = require('express');

function generate(db, directoryPath, request, response) {
	fs.readdir(directoryPath, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		var total_files = files.length
		try {
			if (total_files != 0) {
				db.run('DELETE FROM tbl_transactions');
				db.run('DELETE FROM temp_tbl_transactions');
				db.run('DELETE FROM sqlite_sequence WHERE name="tbl_transactions"');
				db.run('DELETE FROM sqlite_sequence WHERE name="temp_tbl_transactions"');
				db.run('VACUUM');
				importTrans(db, directoryPath, files, total_files, request, response);
			}
			else {
				response.sendStatus(404);
			}
		} catch (e) {
			console.log(e)
		}

	});
}

function importTrans(db, directoryPath, file_array, total_files, request, response) {
	var invalidfilearray = []
	var generatedfileindex = 0
	var id;

	db.all("SELECT id FROM tbl_stocktakeid", function (err, results) {
		if (err) {
			response.send('Error Import');
		}
		else {
			results.forEach(function (row) {
				id = row.id
			})
		}
	})
	for (i in file_array) {
		let uriFile = directoryPath + file_array[i]
		let stream = fs.createReadStream(uriFile);
		let csvDataColl = [];
		let fileStream = csv
			.parse()
			.on("data", function (data) {
				csvDataColl.push(data);
			})
			.on("end", function () {
				console.log(csvDataColl[0])

				if (csvDataColl.length != 0 && csvDataColl[0][0] == "location" && csvDataColl[0][1] == "barcode" && csvDataColl[0][2] == "itemcode" && csvDataColl[0][3] == "scan_qty" && csvDataColl[0][4] == "scan_date" && csvDataColl[0][5] == "inspector" && csvDataColl[0][6] == "user_id" && csvDataColl[0][7] == "stocktakeid") {
					if (csvDataColl[1][7] != id) {
						// stock take id not same
						invalidfilearray.push(uriFile)
						generatedfileindex++
						console.log(total_files + "/" + generatedfileindex)
						if (total_files == generatedfileindex) {
							console.log("HERE")
							let text = `${invalidfilearray.length}` + "/" + `${total_files}`
							let query = "INSERT INTO tbl_transactions(barcode,scan_qty,id,location,itemcode,scan_date,inspector,user_id) SELECT  DISTINCT (barcode) ,SUM(scan_qty),id,location,itemcode,scan_date,inspector,user_id from temp_tbl_transactions  group by barcode"
							db_transfer(db, query, response, text)
						}
					}
					else {
						csvDataColl.shift();
						let query = "INSERT INTO temp_tbl_transactions (location, barcode, itemcode, scan_qty, scan_date, inspector, user_id) VALUES ('" + csvDataColl[0][0] + "','" + csvDataColl[0][1] +
							"','" + csvDataColl[0][2] + "','" + csvDataColl[0][3] + "','" + csvDataColl[0][4] + "','" + csvDataColl[0][5] + "','" + csvDataColl[0][6] + "')";
						for (var i = 1; i < csvDataColl.length; i++) {
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
									console.log("HERE")
									let text = `${invalidfilearray.length}` + "/" + `${total_files}`
									let query = "INSERT INTO tbl_transactions(barcode,scan_qty,id,location,itemcode,scan_date,inspector,user_id) SELECT  DISTINCT (barcode) ,SUM(scan_qty),id,location,itemcode,scan_date,inspector,user_id from temp_tbl_transactions  group by barcode"
									db_transfer(db, query, response, text)
								}
							}
						});
					}
				}
				else {
					invalidfilearray.push(uriFile)
					generatedfileindex++
					console.log(total_files + "/" + generatedfileindex)
					if (total_files == generatedfileindex) {
						console.log("HERE")
						let text = `${invalidfilearray.length}` + "/" + `${total_files}`
						let query = "INSERT INTO tbl_transactions(barcode,scan_qty,id,location,itemcode,scan_date,inspector,user_id) SELECT  DISTINCT (barcode) ,SUM(scan_qty),id,location,itemcode,scan_date,inspector,user_id from temp_tbl_transactions  group by barcode"
						db_transfer(db, query, response, text)
					}
				}
			});
		stream.pipe(fileStream);
	}
}

async function db_transfer(db, query, response, text) {
	return new Promise(function (resolve, reject) {
		db.all(query, function (err, rows) {
			if (err) {
				response.send("ERROR")
				return reject(err);
			}
			else {
				response.send(text)
			}
		});
	});
}


module.exports = { generate };
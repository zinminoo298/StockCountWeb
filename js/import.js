const fsExtra = require('fs-extra');
const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');
const { json } = require('body-parser');

function import_master(db,directoryPath,request,response){
	fs.readdir(directoryPath, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		console.log(files)
		var chosenfile = directoryPath + files[0]
		console.log(chosenfile)
		if (fs.existsSync(chosenfile)) {
			if(path.extname(chosenfile) == ".csv"){
				uploadCsv(db, directoryPath, chosenfile, request, response);
			}
			else{
				response.sendStatus(422)
			}
		}
		else {
			response.sendStatus(404)
		}
	})
}

function uploadCsv(db,dir, uriFile, request, response) {
	let stream = fs.createReadStream(uriFile);
	let csvDataColl = [];
	let fileStream = csv
		.parse()
		.on("data", function (data) {
			csvDataColl.push(data);
		})
		.on("end", function () {
			csvDataColl = JSON.parse(JSON.stringify(csvDataColl).replaceAll("'",""))
			if (csvDataColl.length != 0) {
				if (csvDataColl[0][0] == "barcode" && csvDataColl[0][1] == "itemcode" && csvDataColl[0][2] == "location" && csvDataColl[0][3] == "description" && csvDataColl[0][4] == "onhand_qty") {
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
							let query = "INSERT INTO tbl_masters (barcode, itemcode, location, description, onhand_qty) VALUES ('" + csvDataColl[0][0] + "','" + csvDataColl[0][1] +
								"','" + csvDataColl[0][2] + "','" + csvDataColl[0][3] + "','" + csvDataColl[0][4] + "')";
							for (var i = 1; i < csvDataColl.length; i++) {
								query = query + ",('" + csvDataColl[i][0] + "','" + csvDataColl[i][1] + "','" + csvDataColl[i][2] + "','" + csvDataColl[i][3] + "','" + csvDataColl[i][4] + "')";
							}
							db_import(db,query,response);
						}
					})
				}
				else {
					response.sendStatus(422) //Wrong file format
				}
			}
			else {
				response.sendStatus(400) //Wrong Input (file zero byte)
			}

			fsExtra.emptyDirSync(dir);
		});

	stream.pipe(fileStream);
}

async function db_import(db,query,response){
    return new Promise(function(resolve,reject){
        db.all(query, function(err,rows){
           if(err){
			response.send("ERROR")
			return reject(err);
			}
			else{
				response.send("success")
			}
         });
    });
}

module.exports = { import_master };

const fs = require('fs');
const filesize = require("filesize")
const moment = require("moment");


function getfiles(directoryPath,request,response){
    fs.readdir(directoryPath, function (err, files) {
		var filesarray = []
		var eachfilearray = []
		filesarray.length = 0
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
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
					response.send(filesarray)
				}
			});
		} catch (e) {
			console.log(e)
		}
	});
}

function deletefile(directory,reqfilename,request,response){
    try {
		fs.unlinkSync(directory + reqfilename)
		response.send("200")
	} catch (e) {
		console.log(e)
	}
}

module.exports = { getfiles, deletefile};

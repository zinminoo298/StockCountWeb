const multer = require('multer');
const fs = require('fs');
const path = require('path');


function upload(directoryPath,request,response){
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
	fs.readdir(directoryPath,function (err, files) {
		console.log(files)
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		else{
			if(files.length == 0){
				//do nothing
			}
			else{
				fs.unlinkSync(directoryPath+files[0])
			}
			var upload = multer({
				storage: storageimport,
				limits: { fileSize: '50mb' }
			}).single('uploadfile');
			upload(request, response, function (err) {
				console.log(request.file.filename)
				if (err) {
					return response.send("Error upload file")
				}
				response.send("File is uploaded")
			})
		}
		
	})
}

module.exports = { upload };
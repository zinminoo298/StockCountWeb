const multer = require('multer');
const path = require('path');

var storagetransaction = multer.diskStorage({
	destination: (request, file, callBack) => {
		var dest = './uploads/' + request.session.username + '/transaction/'
		callBack(null, dest)
	},
	filename: (req, file, callBack) => {
		callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
		console.log(file)
		console.log(file.originalname)
	}
})

function uploadtrans_files(request,response){
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
}

function uploadtrans_api(request,response){
	var upload = multer({
		storage: storagetransaction,
		limits: { fileSize: '50mb' }
	}).single('file');
	upload(request, response, function (err) {
		console.log(request.file.filename)
		if (err) {
			return response.send("Error upload file")
		}
		response.send("File is uploaded")
	})
}


module.exports = { uploadtrans_files, uploadtrans_api };
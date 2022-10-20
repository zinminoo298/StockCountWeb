function newcount(db,request,response){
    let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	const stockTakeId = date + month + year + hours + minutes + seconds;
	try {
		db.run("DELETE FROM tbl_stocktakeid");
		db.run("DELETE FROM tbl_masters");
		db.run("DELETE FROM tbl_transactions");
		db.run("DELETE FROM sqlite_sequence");
		db.run("VACUUM");
		db.run(`INSERT INTO tbl_stocktakeid (id) VALUES('${stockTakeId}')`)
		response.status(200).send(stockTakeId);
	}
	catch (error) {
		console.log(error)
		response.sendStatus(400);
	}
}
module.exports = { newcount };
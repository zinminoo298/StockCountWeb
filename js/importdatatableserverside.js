function load_serverside(db,request,response){
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
	  OR location LIKE '%${search_value}%'
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
						'location': row.location,
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
}

module.exports = { load_serverside };
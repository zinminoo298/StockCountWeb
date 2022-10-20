function loadreport(db,request,response){
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

		var column_sort_order = request.query.order[0]['dir'];
	}

	var search_value = request.query.search['value'];

	var search_query = `
     AND (m.id LIKE '%${search_value}%'
      OR m.location LIKE '%${search_value}%' 
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
		db.all("SELECT COUNT(*) as Total FROM tbl_masters as m LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode WHERE 1 " + search_query + "", function (err, data) {
			var q = "SELECT COUNT(*) as Total FROM tbl_masters as m LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode WHERE 1 " + search_query + ""
			var total_records_with_filter = data[0].Total;
			var query = `
            SELECT m.id,m.location,m.barcode,m.itemcode,m.description,m.onhand_qty,t.scan_qty,(m.onhand_qty-t.scan_qty) as diff ,t.scan_date,t.inspector FROM tbl_masters as m
 			LEFT OUTER JOIN tbl_transactions as t ON m.barcode = t.barcode
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;
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
}

module.exports = { loadreport };
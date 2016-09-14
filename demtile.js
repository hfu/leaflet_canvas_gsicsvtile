var tileSource = 'USGS';

/**
 * Parse delimiter separated data
 */
function parseSV(str, delimiter){
  if(!delimiter) delimiter = ","
  return str.split('\n').reduce(function(table,row){
    if(!table) return;
    table.push(
      row.split(delimiter).map(function(d){ return d.trim() })
    );
    return table;
  }, []);
}
/**
 * Parse CSV file and get the array of elevation data
 */
function parseCsv(csv)
{
	return parseSV(csv, ",");
}

/**
 * Callback function to draw on canvas
 */
function drawDemTile(canvas, tilePoint, zoom)
{
	var ctx = canvas.getContext('2d');

	var x = tilePoint.x;
	var y = tilePoint.y;

	var u = '';
	if (tileSource == 'GSI') {
		u = 'https://cyberjapandata.gsi.go.jp/xyz/dem/';
	} else if (tileSource == 'USGS') {
		u = 'http://earthexplorer.usgs.gov/wms/wmts/EPSG3857/srtm/';
	}
	u = u + String(zoom) + "/";
	u = u + String(x) + "/";
	u = u + String(y);

	if (tileSource == 'GSI') {
		u = u + ".txt"
	} else if (tileSource == 'USGS') {
		u = u + ".csv"
	}

	$.ajax({
		type: "GET",
		url: u,
		dataType: 'text',
		success: function(csv){
			var data = parseCsv(csv);
			for (var j = 0; j < data.length; ++j) {
				row = data[j];
				for (var i = 0; i < row.length; ++i) {
					var v = row[i];
					if (v == 'e') {continue;}
					
					var elev = parseFloat(v);
					ctx.fillStyle = colorMap(elev);
					ctx.fillRect(i, j, 1, 1);
				}
			}
		},
		error: function(request, textStatus, errorThrown){}
	});
}

// This is a template for a Node.js scraper on morph.io (https://morph.io)

var cheerio = require("cheerio");
var request = require("request");
var sqlite3 = require("sqlite3").verbose();
var moment = require('moment');

const timezones = {
	'WA': '+0800',
	'NT': '+0930',
	'SA': '+0930',
	'QLD': '+1000',
	'NSW': '+1000',
	'VIC': '+1000',
	'TAS': '+1000',
	'ACT': '+1000'
};

function initDatabase(callback) {
	// Set up sqlite database.
	var db = new sqlite3.Database("data.sqlite");
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data (state TEXT, start TEXT, end TEXT, notes TEXT)");
		callback(db);
	});
}

function fetchPage(url, callback) {
	// Use request to read in pages.
	request(url, function (error, response, body) {
		if (error) {
			console.log("Error requesting page: " + error);
			return;
		}

		callback(body);
	});
}

function run(db) {

	// Use request to read in pages.
	fetchPage("http://www.bom.gov.au/climate/averages/tables/dst_times.shtml", function (body) {

		// Use cheerio to find things in the page with css selectors.
		var $ = cheerio.load(body);
		var data = [[],[],[],[]];
		var rows = $('table[summary="daylight saving implementation dates"] tbody tr').each(function () {

			$(this).find('td').each(function(i){
				var rows = $(this).html().split('<br>')
					.map(function(d){
						return d.trim();
					}).forEach(function(d){
						var notes = null;
						if (i === 0){
							notes = d.match(/\((.*)\)/);
							data[3].push((notes && notes[1] !== 'except WA') ? notes[1] : null);
						}
						if (notes && notes[1] === 'except WA') {
							data[i].push(d.replace(/\s\(.*/,'').replace('Australia','NT,QLD,NSW,ACT,VIC,SA,TAS'));
						} else {
							data[i].push(d.replace(/\s\(.*/,'').replace('Australia','WA,NT,QLD,NSW,ACT,VIC,SA,TAS'));
						}
					});
			});
		});

		data[0].forEach(function(d,i){
			d.split(',').forEach(function(l){
				l = l.trim();
				db.run('INSERT INTO data (state, start, end, notes) VALUES ($location,$start,$end,$notes)', {
					$location: l,
					$start: moment(data[1][i]+' 02:00 '+timezones[l], 'D/M/YYYY HH:mm ZZ').toISOString(),
					$end: moment(data[2][i]+' 03:00 '+timezones[l], 'D/M/YYYY HH:mm ZZ').toISOString(),
					$notes: data[3][i]
				});
			});
		});

		db.close();
	});
}

initDatabase(run);

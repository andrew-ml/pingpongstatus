var express = require('express');
var router = express.Router();
var data = [];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/data', function(req, res, next) {
	const {from, to} = req.query;
	const output = data.filter(el => el.time > from && el.time < to);
  res.json(output);
});

router.post('/data', function(req, res, next) {
	console.log(req.body);
	const item = {
		time: (new Date()).getTime(),
		value: parseInt(req.body)
	}
	data.push(item);
	console.log(data);
  res.sendStatus(200);
});

module.exports = router;


// setInterval(function(){$.ajax({
//   type: "POST",
//   url: 'http://localhost:3004/data',
//   data: JSON.stringify([234,231,233]),
//   contentType: "application/json",
//   dataType: 'json'
// });}, 2000)
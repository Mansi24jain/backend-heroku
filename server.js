var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-headers', 'Origin, X-requested-With,Content-Type,Accept');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	next();
});
var Users = require('./routers/Users');
app.get('/', function (req, res) {
	res.json({ message: 'welcome' });
});

app.get('/D:/Backend/routers/uploads/:pathy', function (req, res) {
	//console.log(req.params.pathy);
	res.sendFile(__dirname + '/routers/uploads/' + req.params.pathy);
});
app.get('/reports/:pathy', function (req, res) {
	console.log(req.params.pathy);
	res.sendFile(__dirname + '/reports/' + req.params.pathy);
});
app.use('/users', Users);

app.listen(port, () => {
	console.log('Server is running on port: ' + port);
});

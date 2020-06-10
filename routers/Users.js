const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const secret = 'super secret';
const jwtDecode = require('jwt-decode');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
//
const { spawn } = require('child_process');

const User = require('../models/User');
const Report = require('../models/Report');

var ct = 0;
users.use(cors());

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var img = path.join(__dirname, '/uploads');
		cb(null, img);
	},
	filename: function (req, file, cb) {
		const authHeader = req.headers['authorization'];
		//console.log(authHeader);
		let token;
		if (authHeader) {
			token = req.headers.authorization.split(' ')[1];
			if (token == null) {
				res.end('Oops you cant create this request!');
			}
		} else {
			res.end('User is not logged in ');
		}
		try {
			let decoded = jwtDecode(token);
			//res.json(decoded);
			cb(null, decoded.number + '-' + Date.now() + '.png');
		} catch (err) {
			return res.end('User is not authenticated');
		}
	},
});

var storage1 = multer.diskStorage({
	destination: function (req, file, cb) {
		//var rp = path.join(__dirname, '/reports');
		cb(null, 'reports');
	},
	filename: function (req, file, cb) {
		var f = file.originalname;
		var str = f.split('.');
		//console.log(str[str.length - 1]);
		cb(null, 'Report' + ' - ' + Date.now() + '.' + str[str.length - 1]);
		ct = ct + 1;
	},
});

var upload = multer({ storage: storage });
var upload1 = multer({ storage: storage1 });

process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
	const today = new Date();
	const userData = {
		name: req.body.name,
		gender: req.body.gender,
		number: req.body.number,
		password: req.body.password,
		age: req.body.age,
		created: today,
	};
	User.findOne({
		where: {
			number: req.body.number,
		},
	})
		.then((user) => {
			if (!user) {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					userData.password = hash;
					User.create(userData)
						.then((user) => {
							res.json({ status: user.name + ' registered successfully' });
							var phn = user.number;
							var pa = path.join(__dirname, '/uploads');
							var fphno = path.join(pa, phn);
							console.log(fphno);
							fs.mkdirSync(fphno);
						})
						.catch((err) => {
							res.send('error: ' + err);
						});
				});
			} else {
				res.json({ error: 'User/Phone_Number already exists' });
			}
		})
		.catch((err) => {
			res.send('error: ' + err);
		});
});

users.post('/login', (req, res) => {
	User.findOne({
		where: {
			number: req.body.number,
		},
	})
		.then((user) => {
			if (user) {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					const accesstoken = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
						expiresIn: '10d',
					});
					console.log(accesstoken);
					//res.send(token);
					res.cookie('jwt', accesstoken, { httpOnly: 'true' });
					res.json({
						status: 'user logged in',
						user,
					});
				}
			} else {
				res.status(400).json({ error: 'User does not exist' });
			}
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
});

users.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
	const file = req.file;
	if (!file) {
		const error = new Error('Please upload a file');
		error.httpStatusCode = 400;
		return next(error);
	}
	// Passing the image to the python process
	//spawn is based on events for completion of tasks and creation of processes
	else {
		const py = spawn('python', [__dirname + '/../scripts/script1.py', file.path]);
		var pyData = '';

		//take input and process output
		py.stdout.on('data', (data) => {
			pyData = pyData + data.toString();
			console.log('Data from python process:\n', data.toString());
		});
		// py.on('close', (code) => {
		// 	console.log('process closed all stdio with code:', code);
		// });
		py.on('exit', function (code) {
			console.log('Process exited with code:', code);
			console.log(file.path);
			var url1 = 'localhost:5000/' + file.path;
			console.log(url1);
			res.json({ url: url1, imageinfo: pyData });
		});
	}
});

users.post('/addreport', upload1.single('imageFile'), (req, res, next) => {
	//console.log(req.file.path);
	var url = 'localhost:5000/' + req.file.path;
	console.log(url);
	const authHeader = req.headers['authorization'];
	//console.log(authHeader);
	const Today = new Date();
	const Data = {
		iv: req.file.path,
		//video: req.body.video,
		location: req.body.location,
		description: req.body.description,
		created: Today,
	};
	let token;
	if (authHeader) {
		token = req.headers.authorization.split(' ')[1];
		if (token == null) {
			res.end('Oops you cant create this request!');
		}
	} else {
		res.end('User is not logged in ');
	}
	try {
		let decoded = jwtDecode(token);
		//res.json(decoded);
		Report.create(Data)
			.then((report) => {
				res.json({ status: ' Report submitted successfully ' + decoded.number, report, url });
			})
			.catch((err) => {
				res.send('error: ' + err);
			});
	} catch (err) {
		return res.end('User is not authenticated');
	}
});

users.get('/reports', (req, res) => {
	//res.json({ status: 'Hiiiiiiii' });
	Report.findAll()
		.then((report) => {
			//console.log(report);
			res.send(report);
		})
		.catch((err) => {
			res.send('error: ' + err);
		});
	// if (!err) {
	// 	res.json({ status: rows });
	// } else {
	// 	console.log(err);
	// }
	//});
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	console.log('Hii');
	console.log(authHeader);
	let token;
	if (authHeader) {
		token = req.headers.authorization.split(' ')[1];
	} else {
		res.end('User is not logged in ');
	}

	//let decode = jwt.verify(token, secret);
	//console.log(decode);
	try {
		let decoded = jwtDecode(token);
		console.log('decoded');
		// // 4. password update
		// // db => ADMIN,User
		req.headers.role = decoded.role;
		req.headers.user = decoded;
		// //user.password = undefined;
		res.user = decoded;
		next();
	} catch (err) {
		return res.end('User is not authenticated');
	}
	// const token = authHeader && authHeader.split('')[1];
	// console.log('Hello again');
	// console.log(token);
	// if (token == null) return res.sendStatus(401);

	// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
	// 	if (err) return res.sendStatus(403);
	// 	console.log('Hello again');
	// 	res.user = user;
	// 	next();
	// });
}

module.exports = users;

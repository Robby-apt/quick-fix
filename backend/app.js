require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3001;

// config of app dependencies
const appUsage = [
	bodyParser.urlencoded({ extended: true }),
	bodyParser.json(),
	cors(),
];

app.use(appUsage);

// nodemailer config
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.SENDER,
		pass: process.env.PASSWORD,
	},
});

// get form data from contact form
app.post('/contact', (req, res) => {
	const { name, email, subject, message } = req.body;

	const mailOptions = {
		from: process.env.SENDER,
		to: process.env.RECEIVER,
		subject: subject,
		html: `<h1>Message from: ${name}</h1>
        <h2>Sender's email: ${email}</h2>
        <p>${message}</p>`,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		let output = err || info.response;
		console.log(output);
		res.send(output);
	});
});

app.listen(port, () => {
	console.log(`Hello from port ${port}`);
});

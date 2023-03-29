const nodemailer = require("nodemailer");
require("dotenv").config();

async function main(subject, htmlContent, mail) {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		service: "yahoo",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: `"Walter Clippers ✂️" <${process.env.EMAIL}>`, // sender address
		to: mail, // list of receivers
		subject: subject, // Subject line
		html: htmlContent, // html body
	});

	console.log("Message sent: %s", info.messageId);
}

const newAppointment = (hairstyle, price, time, date) => ` 

<h1>✂️ NEW HAIRCUT APPOINTMENT</h1>

<h4>Hairstyle: ${hairstyle}</h4>

<h4>Price: ${price}</h4>

<h4>Time: ${time}</h4>

<h4>Date: ${date}</h4>

<h4>❤️ Looking forward to seeing you looking good. </h4>

<h4>Best, </h4> 
<h2>- Walter </h2>

<p>--------------------------------------------------------------------------------</p>

<h3>Walter Clippers Inc.</h3>

`;

const updateAppointment = (hairstyle, price, time, date) => ` 

<h1>✂️ HAIRCUT APPOINTMENT UPDATE</h1>

<h2>Your Appointment Has Been Successfully Rescheduled</h2>

<h4>Hairstyle: ${hairstyle}</h4>

<h4>Price: ${price}</h4>

<h4>Time: ${time}</h4>

<h4>Date: ${date}</h4>

<h4>❤️ Looking forward to seeing you looking good. </h4>

<h4>Best, </h4> 
<h2>- Walter </h2>

<p>--------------------------------------------------------------------------------</p>

<h3>Walter Clippers Inc.</h3>

`;

const deleteAppointment = (date) => ` 

<h1>✂️ HAIRCUT APPOINTMENT DELETED</h1>

<h2>Your Appointment scheduled for ${date} has been successfully deleted!</h2>

<h4>Best, </h4> 
<h2>- Walter </h2>

<p>--------------------------------------------------------------------------------</p>

<h3>Walter Clippers Inc.</h3>

`;

const newCustomer = (customerName) => ` 

<h1>✂️ WELCOME LOVELY CUSTOMER TO WALTERS CLIPPERS</h1>

<h4>❤️ Looking forward to seeing you looking good. <h2>${customerName}</h2> </h4>

<h4>Best, </h4> 
<h2>- Walter </h2>

<p>--------------------------------------------------------------------------------</p>

<h3>Walter Clippers Inc.</h3>

`;

module.exports = {
	emailFunction: main,
	newAppointment,
	newCustomer,
	updateAppointment,
	deleteAppointment,
};

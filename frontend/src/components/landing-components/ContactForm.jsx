import React, { useState } from 'react';
const validator = require('email-validator');

function ContactForm() {
	const [contactData, setContactData] = useState({
		name: ``,
		email: ``,
		subject: ``,
		message: ``,
	});

	async function handleSubmit(event) {
		event.preventDefault();

		if (validator.validate(contactData.email)) {
			let dataBody = JSON.stringify(contactData);

			try {
				const url = process.env.REACT_APP_BACKEND_PORT;
				let res = await fetch(url, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: dataBody,
				});
				// get status code
				if (res.status === 200) {
					alert(`The message has been sent successfully`);
					setContactData({
						name: ``,
						email: ``,
						subject: ``,
						message: ``,
					});
					console.log(contactData);
				} else {
					alert(
						`Sorry, something went wrong when sending the message`
					);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			alert(`Kindly enter a valid email`);
		}
	}

	function handleChange(event) {
		let { name, value } = event.target;

		setContactData((prev) => {
			return { ...prev, [name]: value };
		});
	}

	return (
		<form id="contactForm" className="contactForm" onSubmit={handleSubmit}>
			<div className="nameAndEmail">
				<div className="inputDiv nameInput">
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						name="name"
						id="name"
						autoFocus="true"
						value={contactData.name}
						onChange={handleChange}
						minLength="2"
						required
					/>
				</div>

				<div className="inputDiv emailInput">
					<label htmlFor="email">E-mail:</label>
					<input
						type="email"
						name="email"
						id="email"
						value={contactData.email}
						onChange={handleChange}
						required
					/>
				</div>
			</div>

			<div className="inputDiv subjectInput">
				<label htmlFor="subject">Subject:</label>
				<input
					type="text"
					name="subject"
					id="subject"
					value={contactData.subject}
					onChange={handleChange}
					minLength="5"
					required
				/>
			</div>

			<div className="inputDiv messageInput">
				<label htmlFor="message">Message:</label>
				<textarea
					name="message"
					id="message"
					cols="30"
					rows="10"
					value={contactData.message}
					onChange={handleChange}
					minLength="5"
					required
				/>
			</div>

			<button type="submit">Send Message</button>
		</form>
	);
}

export default ContactForm;

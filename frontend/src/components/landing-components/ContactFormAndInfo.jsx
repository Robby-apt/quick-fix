import React from 'react';
import ContactCard from '../landing-components/ContactCard';
import ContactForm from '../landing-components/ContactForm';
import contactInfo from '../../contact-info';

function ContactFormAndInfo() {
	return (
		<div className="section contactFormAndInfo">
			<div className="contactInfo contactDiv">
				<h3 className="contactHeading">Get In Touch</h3>
				{contactInfo.map((info, index) => (
					<ContactCard
						key={index}
						iconClass={info.iconClass}
						contactHeading={info.contactHeading}
						contactText={info.contactText}
					/>
				))}
			</div>

			<div className="contactFormDiv contactDiv">
				<h3 className="contactHeading">Send Us a Message</h3>

				<ContactForm />
			</div>
		</div>
	);
}

export default ContactFormAndInfo;

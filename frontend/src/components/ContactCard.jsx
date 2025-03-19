import React from 'react';

function ContactCard(props) {
	return (
		<div className="contactCard">
			<i className={`contactIcon ${props.iconClass}`} />

			<div className="contactDetails">
				<h6>{props.contactHeading}</h6>
				{props.contactText.map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
		</div>
	);
}

export default ContactCard;

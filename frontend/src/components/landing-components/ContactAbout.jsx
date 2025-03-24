import React from 'react';

function ContactAbout(props) {
	return (
		<div
			className="section getStarted quickfixAbout"
			onClick={() => {
				props.setResNavShowing(false);
			}}
		>
			<h2 className="sectionTitle">Contact Us</h2>

			<h3 className="sectionSubtitle">
				Have questions or need assistance? We're here to help.
			</h3>
		</div>
	);
}

export default ContactAbout;

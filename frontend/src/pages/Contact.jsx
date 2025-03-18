import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ContactAbout from '../components/ContactAbout';
import Footer from '../components/Footer';

function Contact() {
	let [isResNavShowing, setResNavShowing] = useState(false);

	return (
		<div className="page" id="contactPage">
			<Navbar
				isResNavShowing={isResNavShowing}
				setResNavShowing={setResNavShowing}
			/>

			<ContactAbout setResNavShowing={setResNavShowing} />

			<Footer />
		</div>
	);
}

export default Contact;

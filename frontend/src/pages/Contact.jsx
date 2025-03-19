import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ContactAbout from '../components/ContactAbout';
import ContactFormAndInfo from '../components/ContactFormAndInfo';
import MapLocation from '../components/MapLocation';
import FAQ from '../components/FAQ'
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

			<ContactFormAndInfo />

			<MapLocation />

            <FAQ />

			<Footer />
		</div>
	);
}

export default Contact;

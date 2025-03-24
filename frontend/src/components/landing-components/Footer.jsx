import React from 'react';
import SocialsCol from './SocialsCol';
import QuickLinksCol from './QuickLinksCol';
import ServicesCol from './ServicesCol';
import ContactCol from './ContactCol';

function Footer() {
	let fullDate = new Date();
	let year = fullDate.getFullYear();

	return (
		<footer className="globalFooter">
			<div className="columnDisplay">
				<SocialsCol />

				<QuickLinksCol />

				<ServicesCol />

				<ContactCol />
			</div>

			<div className="copyright">
				&#169; {year} QuickFix. All rights reserved.
			</div>
		</footer>
	);
}

export default Footer;

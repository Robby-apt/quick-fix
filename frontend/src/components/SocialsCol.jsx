import React from 'react';
import Branding from './Branding';
import SocialMediaIcons from './SocialMediaIcons';

function SocialsCol() {
	return (
		<div className="footerCol socialsCol">
			<Branding />

			<p>
				Connecting clients with skilled handymen for all your home
				repair and maintenance needs.
			</p>

			<SocialMediaIcons />
		</div>
	);
}

export default SocialsCol;

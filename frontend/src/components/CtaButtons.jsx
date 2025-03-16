import React from 'react';
import { Link } from 'react-router-dom';

function CtaButtons() {
	return (
		<div className="ctaButtons">
			<Link to={'/signup'} className="secondaryCTA">
				Hire a Professional
			</Link>
			<Link to={'/login'} className="primaryCTA">
				Join as a Professional
			</Link>
		</div>
	);
}

export default CtaButtons;

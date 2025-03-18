import React from 'react';
import { Link } from 'react-router-dom';

function Branding() {
	return (
		<div className="branding brandingFooter">
			<Link to="/">
				<img
					src={`${process.env.PUBLIC_URL}/images/quick-fix.svg`}
					alt="Quick Fix logo"
				/>
				<h1>Quick Fix</h1>
			</Link>
		</div>
	);
}

export default Branding;

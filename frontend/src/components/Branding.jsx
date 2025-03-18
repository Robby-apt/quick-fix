import React from 'react';
import { Link } from 'react-router-dom';

function Branding() {
	return (
		<div className="branding brandingFooter">
			<Link to="/">
				<img
					src={`${process.env.PUBLIC_URL}/images/quick-fix.svg`}
					alt="QuickFix logo"
				/>
				<h1>QuickFix</h1>
			</Link>
		</div>
	);
}

export default Branding;

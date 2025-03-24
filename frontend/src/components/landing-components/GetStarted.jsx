import React from 'react';
import CtaButtons from './CtaButtons';

function GetStarted() {
	return (
		<div className="section getStarted">
			<h2 className="sectionTitle">Ready to Get Started?</h2>

			<h3 className="sectionSubtitle">
				Join thousands of satisfied customers who have found reliable
				<br />
				handymen through QuickFix.
			</h3>

			<CtaButtons />
		</div>
	);
}

export default GetStarted;

import React from 'react';

function QuickfixAbout(props) {
	return (
		<div
			className="section getStarted quickfixAbout"
			onClick={() => {
				props.setResNavShowing(false);
			}}
		>
			<h2 className="sectionTitle">About QuickFix</h2>

			<h3 className="sectionSubtitle">
				We're on a mission to make home repairs and maintenance simple,
				reliable, and stress-free.
			</h3>
		</div>
	);
}

export default QuickfixAbout;

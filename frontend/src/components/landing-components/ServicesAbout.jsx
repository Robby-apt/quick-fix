import React from 'react'

function ServicesAbout(props) {
  return (
		<div
			className="section getStarted quickfixAbout"
			onClick={() => {
				props.setResNavShowing(false);
			}}
		>
			<h2 className="sectionTitle">Our Services</h2>

			<h3 className="sectionSubtitle">
				Find skilled professionals for all your home repair and
				maintenance needs
			</h3>
		</div>
  );
}

export default ServicesAbout
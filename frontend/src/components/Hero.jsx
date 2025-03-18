import React from 'react';
import CtaButtons from './CtaButtons';

function Hero(props) {
	return (
		<div
			className="landingHero heroSection"
			onClick={() => props.setResNavShowing(false)}
		>
			<div className="callToAction">
				<h1>Find Skilled Handymen In Your Area</h1>

				<p>
					Connect with trusted professionals for plumbing, electrical,
					roofing and more
				</p>

				<CtaButtons />
			</div>

			<div className="heroImg heroSection">
				<img
					src={`${process.env.PUBLIC_URL}/images/hero-img.jpg`}
					alt="Repair specialist at work"
				/>
			</div>
		</div>
	);
}

export default Hero;

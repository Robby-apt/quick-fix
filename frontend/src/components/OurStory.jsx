import React from 'react';

function OurStory() {
	return (
		<div className="landingHero heroSection ourStory">
			<div className="callToAction">
				<h2>Our Story</h2>

				<p>
					Quick Fix was founded in 2024 with a simple idea: connecting
					homeowners with skilled handymen shouldn't be complicated.
					<br />
					<br />
					After experiencing the frustration of finding reliable
					professionals for home repairs, our founders decided to
					create a platform that makes the process seamless and
					trustworthy.
					<br />
					<br />
					Today, Quick Fix has grown into a nationwide network of
					verified professionals, serving thousands of satisfied
					customers every month.
				</p>
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

export default OurStory;

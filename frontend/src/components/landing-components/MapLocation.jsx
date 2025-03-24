import React from 'react';

function MapLocation() {
	return (
		<div className="section workingsSection grayBg">
			<h2 className="sectionTitle">Find Us On The Map</h2>

			<iframe
				title="QuickFix Office Location"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1185.8554144299753!2d36.749747285672214!3d-1.340681042600707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1befacb1cd57%3A0x56f2afea28bfabc4!2sOne%20Stop%20Arcade%20-%20Langata%20Road!5e0!3m2!1sen!2ske!4v1742390659731!5m2!1sen!2ske"
				allowFullScreen="true"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			/>
		</div>
	);
}

export default MapLocation;

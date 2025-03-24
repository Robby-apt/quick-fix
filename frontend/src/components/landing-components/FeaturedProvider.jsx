import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import serviceProviders from '../../service-providers';

function FeaturedProvider() {
	return (
		<div className="section featuredProviders">
			<h2 className="sectionTitle">Featured Service Providers</h2>

			<h3 className="sectionSubtitle">
				Meet some of our top-rated professionals ready to help with your
				home projects
			</h3>

			<div className="professionalsDisplay">
				{serviceProviders.map((provider, key) => (
					<ProfessionalCard
						index={key}
						providerRating={provider.providerRating}
						providerReviews={provider.providerReviews}
						providerImg={provider.providerImg}
						providerName={provider.providerName}
						providerSpecialty={provider.providerSpecialty}
						providerDescription={provider.providerDescription}
					/>
				))}
			</div>
		</div>
	);
}

export default FeaturedProvider;

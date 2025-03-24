import React from 'react';
import LandingStatComp from './LandingStatComp';
import landingStats from '../../landingStats';

function LandingStats() {
	return (
		<div className="section getStarted landingStats">
			{landingStats.map((stat, index) => (
				<LandingStatComp
					key={index}
					iconClass={stat.iconClass}
					title={stat.title}
					description={stat.description}
				/>
			))}
		</div>
	);
}

export default LandingStats;

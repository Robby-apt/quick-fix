import React from 'react';
import Card from './Card';
import qfWorking from '../../qf-working';

function Workings() {
	return (
		<div className="section workingsSection">
			<h2 className="sectionTitle">How QuickFix Works</h2>

			<div className="cardDisplay">
				{qfWorking.map((working, index) => (
					<Card
						key={index}
						iconClass={working.iconClass}
						title={working.title}
						description={working.description}
					/>
				))}
			</div>
		</div>
	);
}

export default Workings;

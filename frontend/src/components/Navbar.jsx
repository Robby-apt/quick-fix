import React from 'react';
import { Link } from 'react-router-dom';
function Navbar() {
	return (
		<nav className="globalNav">
			<div className="branding">
				<img src="" alt="Quick Fix logo" />
				<h1>Quick Fix</h1>
			</div>
			<div className="navLinks">
				<Link to="/">Home</Link>
				<Link to="/about">About Us</Link>
				<Link to="/services">Services</Link>
				<Link to="/contact">Contact</Link>
			</div>
			<div className="navLinksResponsive">
				<Link to="/">Home</Link>
				<Link to="/about">About Us</Link>
				<Link to="/services">Services</Link>
				<Link to="/contact">Contact</Link>
			</div>
			<div className="regAndLogin">
				<Link to="/login">Login</Link>
				<Link to="/signup">Sign Up</Link>
			</div>
		</nav>
	);
}

export default Navbar;

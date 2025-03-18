import React from 'react';
import { Link } from 'react-router-dom';
import Branding from './Branding';

function Navbar(props) {
	return (
		<nav className="globalNav">
			<Branding/>

			<div className="navLinks">
				<Link to="/">Home</Link>
				<Link to="/about">About Us</Link>
				<Link to="/services">Services</Link>
				<Link to="/contact">Contact</Link>
			</div>

			<div className="navIcons">
				{props.isResNavShowing ? (
					<i
						className="fa-solid fa-xmark"
						onClick={() => props.setResNavShowing(false)}
					/>
				) : (
					<i
						className="fa-solid fa-bars"
						onClick={() => props.setResNavShowing(true)}
					/>
				)}
			</div>

			<div
				className="navLinksResponsive"
				style={
					props.isResNavShowing
						? { display: 'flex' }
						: { display: 'none' }
				}
			>
				<Link to="/">Home</Link>
				<Link to="/about">About Us</Link>
				<Link to="/services">Services</Link>
				<Link to="/contact">Contact</Link>
				<div className="regAndLogin">
					<Link to="/login" className="loginBtn">
						Login
					</Link>
					<Link to="/signup" className="signupBtn">
						Sign Up
					</Link>
				</div>
			</div>

			<div className="regAndLoginDiv">
				<Link to="/login" className="loginBtn">
					Login
				</Link>
				<Link to="/signup" className="signupBtn">
					Sign Up
				</Link>
			</div>
		</nav>
	);
}

export default Navbar;

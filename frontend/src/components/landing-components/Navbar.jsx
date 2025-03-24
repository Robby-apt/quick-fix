import React from 'react';
import { Link } from 'react-router-dom';
import Branding from './Branding';

function Navbar(props) {
	return (
		<nav className="globalNav">
			<Branding />

			<div className="navLinks">
				<Link
					to="/"
					style={{
						color:
							props.currentPage === 'home' ? '#2563eb' : 'inherit',
					}}
				>
					Home
				</Link>
				<Link
					to="/about"
					style={{
						color:
							props.currentPage === 'about' ? '#2563eb' : 'inherit',
					}}
				>
					About
				</Link>
				<Link
					to="/services"
					style={{
						color:
							props.currentPage === 'services'
								? '#2563eb'
								: 'inherit',
					}}
				>
					Services
				</Link>
				<Link
					to="/contact"
					style={{
						color:
							props.currentPage === 'contact'
								? '#2563eb'
								: 'inherit',
					}}
				>
					Contact
				</Link>
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
				<Link
					to="/"
					style={{
						color:
							props.currentPage === 'home' ? '#2563eb' : 'inherit',
					}}
				>
					Home
				</Link>
				<Link
					to="/about"
					style={{
						color:
							props.currentPage === 'about' ? '#2563eb' : 'inherit',
					}}
				>
					About
				</Link>
				<Link
					to="/services"
					style={{
						color:
							props.currentPage === 'services'
								? '#2563eb'
								: 'inherit',
					}}
				>
					Services
				</Link>
				<Link
					to="/contact"
					style={{
						color:
							props.currentPage === 'contact'
								? '#2563eb'
								: 'inherit',
					}}
				>
					Contact
				</Link>

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

import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
// if minimized = True, then header should appear small in top left corner

interface HeaderProps {
	minimized?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimized = false }) => (
	<header className={minimized ? "header minimized" : "header"}>
		<h1 className="header-title">
			<Link
				to="/"
				style={{
					textDecoration: minimized ? "underline" : "none",
					color: "black",
				}}
			>
				First Principles
			</Link>
		</h1>
	</header>
);

export default Header;

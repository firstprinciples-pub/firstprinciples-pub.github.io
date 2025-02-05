import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
	minimized?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimized = false }) => (
	<header className={minimized ? "header minimized" : "header"}>
		<h1 className="header-title">
			<Link to="/">First Principles</Link>
		</h1>
	</header>
);

export default Header;

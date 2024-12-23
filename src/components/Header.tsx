import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
	<header>
		<h1>
			<Link to="/" style={{ textDecoration: "none", color: "black" }}>
				First Principles
			</Link>
		</h1>
	</header>
);

export default Header;

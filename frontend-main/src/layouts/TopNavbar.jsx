import { Link } from "react-router-dom";

import "../components/navbar.css";

const TopNavbar = () => {
  return (
    <header className="top-navbar">

      <div className="top-navbar-left">

        <Link to="/">
          <h2>GitHub</h2>
        </Link>

      </div>

      <div className="top-navbar-center">

        <input
          type="text"
          placeholder="Search repositories..."
        />

      </div>

      <div className="top-navbar-right">

        <Link to="/create">
          Create Repo
        </Link>

        <Link to="/profile">
          Profile
        </Link>

      </div>

    </header>
  );
};

export default TopNavbar;
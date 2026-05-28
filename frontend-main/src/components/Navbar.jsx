import "./navbar.css";

import { Link } from "react-router-dom";

import logo from "../assets/github-mark-white.svg";

const Navbar = () => {
  return (
    <nav className="navbar">

      <div className="nav-left">

        <Link to="/">
          <div className="nav-logo">

            <img
              src={logo}
              alt="GitHub Logo"
            />

            <h3>GitHub</h3>

          </div>
        </Link>

      </div>

      <div className="nav-center">

        <input
          type="text"
          placeholder="Search repositories..."
        />

      </div>

      <div className="nav-links">

        <span>Explore</span>

        <span>Repositories</span>

        <span>Issues</span>

        <span>Pull Requests</span>

      </div>

      <div className="nav-right">

        <Link to="/create">
          <button className="create-btn">
            Create Repository
          </button>
        </Link>

        <Link to="/profile">
          <button className="profile-btn">
            Profile
          </button>
        </Link>

      </div>

    </nav>
  );
};

export default Navbar;
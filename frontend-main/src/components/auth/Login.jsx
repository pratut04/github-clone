import { useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import { useAuth } from "../../authContext";

import "./auth.css";

import logo from "../../assets/github-mark-white.svg";

const Login = () => {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:3002/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "userId",
        res.data.userId
      );

      setCurrentUser(res.data.userId);

      window.location.href = "/";

    } catch (err) {

      console.error(err);

      alert("Invalid Credentials");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-logo">

        <img
          src={logo}
          alt="GitHub"
        />

        <h1>GitHub</h1>

      </div>

      <form
        className="auth-box"
        onSubmit={handleLogin}
      >

        <h2>Sign In</h2>

        <div className="auth-input-group">

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <div className="auth-input-group">

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        <button
          className="auth-btn"
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Sign In"}
        </button>

        <p className="auth-footer">

          New to GitHub?

          <Link to="/signup">
            Create account
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;
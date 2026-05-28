import { useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import { useAuth } from "../../authContext";

import "./auth.css";

import logo from "../../assets/github-mark-white.svg";

const Signup = () => {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:3002/signup",
        {
          username,
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

      alert("Signup Failed!");

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
        onSubmit={handleSignup}
      >

        <h2>Create Account</h2>

        <div className="auth-input-group">

          <label>Username</label>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

        </div>

        <div className="auth-input-group">

          <label>Email</label>

          <input
            type="email"
            placeholder="Email"
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
            placeholder="Password"
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
            : "Create Account"}
        </button>

        <p className="auth-footer">

          Already have an account?

          <Link to="/auth">
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Signup;
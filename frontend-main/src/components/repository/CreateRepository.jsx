import { useState } from "react";

import Navbar from "../Navbar";

import {
  createRepository
} from "../../services/repoService";

import "./repository.css";

const CreateRepository = () => {

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [visibility,
    setVisibility] =
    useState(true);

  const [loading,
    setLoading] =
    useState(false);

  const handleCreateRepo =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const owner =
          localStorage.getItem(
            "userId"
          );

        await createRepository({

          owner:
            localStorage.getItem(
              "userId"
            ),

          name,

          description,

          visibility,

        });

        alert(
          "Repository Created!"
        );

        window.location.href = "/";

      } catch (err) {

        console.error(err);

        alert(
          "Failed to create repository"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <>
      <Navbar />

      <div className="create-repo-page">

        <form
          className="create-repo-box"
          onSubmit={handleCreateRepo}
        >

          <h1>
            Create Repository
          </h1>

          <div className="repo-input-group">

            <label>
              Repository Name
            </label>

            <input
              type="text"
              placeholder="repository-name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="repo-input-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe your repository..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>

          <div className="visibility-box">

            <label>
              Visibility
            </label>

            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(
                  e.target.value ===
                  "true"
                )
              }
            >

              <option value="true">
                Public
              </option>

              <option value="false">
                Private
              </option>

            </select>

          </div>

          <button
            className="repo-btn"
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Repository"}

          </button>

        </form>

      </div>
    </>
  );
};

export default CreateRepository;
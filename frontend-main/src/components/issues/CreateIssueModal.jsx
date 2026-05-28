import {
  useState
} from "react";

import {
  createIssue
} from "../../services/issueService";

import "./issues.css";

const CreateIssueModal = ({
  repoId,
  onCreated,
}) => {

  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await createIssue({

          title,

          description,

          repository:
            repoId,

          creator:
            localStorage.getItem(
              "userId"
            ),

        });

        setTitle("");

        setDescription("");

        onCreated();

      } catch (err) {

        console.error(err);

      }
    };

  return (
    <form
      className="issue-form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Issue title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
        required
      />

      <textarea
        placeholder="Describe issue..."
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <button type="submit">

        Create Issue

      </button>

    </form>
  );
};

export default CreateIssueModal;
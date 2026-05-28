import {
  Link
} from "react-router-dom";

import "./ui.css";

const RepoCard = ({
  repo
}) => {

  return (

    <Link
      to={`/repository/${repo._id}`}
      className="repo-card"
    >

      <div className="repo-card-top">

        <h3>
          {repo.name}
        </h3>

        <span>
          {repo.visibility
            ? "Public"
            : "Private"}
        </span>

      </div>

      <p>
        {repo.description ||
          "No description"}
      </p>

      <div className="repo-card-footer">

        <span>
          ⭐ {repo.stars || 0}
        </span>

        <span>
          🍴 {repo.forks || 0}
        </span>

      </div>

    </Link>
  );
};

export default RepoCard;
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

        <div>

          <div className="repo-owner">
            {repo.owner?.username}
          </div>

          <h3 className="repo-name">
            {repo.name}
          </h3>

        </div>

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
          ⭐ {repo.stars?.length || 0}
        </span>

        <span>
        🍴 {repo.forkCount || 0}
        </span>

      </div>

    </Link>
  );
};

export default RepoCard;

import RepoCard from "../ui/RepoCard";

import "./dashboard.css";

const RepositoryFeed = ({
  repositories,
}) => {

  if (repositories.length === 0) {

    return (
      <div className="empty-state">

        <h3>No repositories found</h3>

      </div>
    );
  }

  return (
    <div className="repo-grid">

      {repositories.map((repo) => (
        <RepoCard
          key={repo._id}
          repo={repo}
        />
      ))}

    </div>
  );
};

export default RepositoryFeed;
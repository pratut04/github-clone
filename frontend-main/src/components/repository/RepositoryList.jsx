import RepoCard from "../ui/RepoCard";

const RepositoryList = ({
  repositories,
}) => {

  if (repositories.length === 0) {

    return (
      <div className="repo-empty">

        <h3>No repositories found</h3>

      </div>
    );
  }

  return (
    <div className="repository-list">

      {repositories.map((repo) => (

        <RepoCard
          key={repo._id}
          repo={repo}
        />

      ))}

    </div>
  );
};

export default RepositoryList;
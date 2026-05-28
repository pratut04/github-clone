import RepoCard from "../ui/RepoCard";

const ProfileRepositories = ({
  repositories,
}) => {

  return (
    <div className="profile-repositories">

      {repositories.map((repo) => (

        <RepoCard
          key={repo._id}
          repo={repo}
        />

      ))}

    </div>
  );
};

export default ProfileRepositories;
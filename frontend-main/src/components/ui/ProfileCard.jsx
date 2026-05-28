import "./ui.css";

const ProfileCard = ({
  username,
  email,
}) => {
  return (
    <div className="profile-card">

      <div className="profile-avatar">
        {username?.charAt(0)}
      </div>

      <h2>{username}</h2>

      <p>{email}</p>

      <button>
        Edit Profile
      </button>

    </div>
  );
};

export default ProfileCard;
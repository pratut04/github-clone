const ProfileHeader = ({
  username,
  email,
}) => {
  return (
    <div className="profile-header">

      <div className="profile-avatar-large">
        {username?.charAt(0)}
      </div>

      <div>

        <h1>{username}</h1>

        <p>{email}</p>

      </div>

    </div>
  );
};

export default ProfileHeader;
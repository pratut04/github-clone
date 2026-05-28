const ProfileTabs = ({
  activeTab,
  setActiveTab
}) => {

  const tabs = [
    "Overview",
    "Repositories",
    "Stars",
    "Followers"
  ];

  return (
    <div className="profile-tabs">

      {tabs.map((tab) => (

        <button
          key={tab}
          className={
            activeTab === tab
              ? "active-profile-tab"
              : ""
          }
          onClick={() =>
            setActiveTab(tab)
          }
        >

          {tab}

        </button>

      ))}

    </div>
  );
};

export default ProfileTabs;
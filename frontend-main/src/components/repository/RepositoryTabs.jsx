import "./repository.css";

const RepositoryTabs = ({
  activeTab,
  setActiveTab,
  issueCount,
}) => {

  const tabs = [
    "Code",
    "Issues",
    "Pull Requests",
    "Actions",
    "Settings",
  ];

  return (
    <div className="repository-tabs">

      {tabs.map((tab) => (

        <button
          key={tab}
          onClick={() =>
            setActiveTab(tab)
          }
          className={
            activeTab === tab
              ? "active-tab"
              : ""
          }
        >

          {tab}

          {tab === "Issues" && (
            <span className="issue-count">

              {issueCount}

            </span>
          )}

        </button>

      ))}

    </div>
  );
};

export default RepositoryTabs;
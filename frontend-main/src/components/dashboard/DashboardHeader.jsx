import "./dashboard.css";

const DashboardHeader = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="dashboard-header">

      <h1>Your Repositories</h1>

      <input
        type="text"
        placeholder="Search repositories..."
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(e.target.value)
        }
      />

    </div>
  );
};

export default DashboardHeader;
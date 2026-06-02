import "./issues.css";

const IssueCard = ({
  issue,
  onClose,
  onDelete,
}) => {

  return (

    <div className="issue-card">

      <div className="issue-content">

        <div className="issue-header">

          <span
            className={
              issue.status === "open"
                ? "issue-status-open"
                : "issue-status-closed"
            }
          >
            ●
          </span>

          <h3 className="issue-title">
            {issue.title}
          </h3>

        </div>

        <p className="issue-description">
          {issue.description}
        </p>

        <div className="issue-meta">

          <span>
            {issue.status}
          </span>

          <span>
            •
          </span>

          <span>
            {new Date(
              issue.createdAt
            ).toLocaleDateString()}
          </span>

        </div>

      </div>

      <div className="issue-actions">

        {issue.status === "open" && (

          <button
            className="close-btn"
            onClick={() =>
              onClose(issue._id)
            }
          >
            Close
          </button>

        )}

        <button
          className="delete-issue-btn"
          onClick={() =>
            onDelete(issue._id)
          }
        >
          Delete
        </button>

      </div>

    </div>

  );
};

export default IssueCard;

import "./issues.css";

const IssueCard = ({
  issue,
  onClose,
  onDelete,
}) => {

  return (
    <div className="issue-card">

      <div className="issue-left">

        <div className="issue-top">

          <h3>
            {issue.title}
          </h3>

          <span
            className={
              issue.status === "open"
                ? "issue-open"
                : "issue-closed"
            }
          >

            {issue.status}

          </span>

        </div>

        <p>
          {issue.description}
        </p>

      </div>

      <div className="issue-actions">

        {issue.status ===
          "open" && (

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
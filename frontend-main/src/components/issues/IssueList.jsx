import IssueCard
  from "./IssueCard";

const IssueList = ({
  issues,
  onClose,
  onDelete,
}) => {

  if (
    issues.length === 0
  ) {

    return (
      <div className="issues-empty">

        No issues found.

      </div>
    );
  }

  return (
    <div className="issue-list">

      {issues.map((issue) => (

        <IssueCard
          key={issue._id}
          issue={issue}
          onClose={onClose}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
};

export default IssueList;
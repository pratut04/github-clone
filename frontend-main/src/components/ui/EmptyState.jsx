import "./ui.css";

const EmptyState = ({
  title,
  subtitle,
}) => {
  return (
    <div className="empty-state-ui">

      <h2>{title}</h2>

      <p>{subtitle}</p>

    </div>
  );
};

export default EmptyState;
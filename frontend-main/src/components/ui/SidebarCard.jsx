import "./ui.css";

const SidebarCard = ({
  title,
  children,
}) => {
  return (
    <div className="sidebar-card">

      <h3>{title}</h3>

      <div>
        {children}
      </div>

    </div>
  );
};

export default SidebarCard;
import "./ui.css";

const PrimaryButton = ({
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      className="primary-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
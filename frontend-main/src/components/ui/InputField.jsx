import "./ui.css";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="input-field">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />

    </div>
  );
};

export default InputField;
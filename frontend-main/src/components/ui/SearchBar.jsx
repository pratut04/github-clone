import "./ui.css";

const SearchBar = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default SearchBar;
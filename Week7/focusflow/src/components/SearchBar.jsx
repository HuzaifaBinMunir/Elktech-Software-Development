export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <input
        type="text"
        placeholder="Search posts by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}
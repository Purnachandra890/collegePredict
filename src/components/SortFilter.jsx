// SortFilter.js
function SortFilter({ sortBy, setSortBy, searchText, setSearchText }) {
  return (
    <div className="sort-filter">
      <label>
        Sort By:
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="instituteName">Institute Name</option>
          <option value="branchName">Branch Name</option>
        </select>
      </label>

      <label>
        Search:
        <input
          type="text"
          placeholder="Search by college name or branch"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </label>
    </div>
  );
}

export default SortFilter;

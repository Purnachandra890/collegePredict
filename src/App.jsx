import { useState } from "react";
import collegeData from "./collegeData";
import SortFilter from "./components/SortFilter";
import LoadingSpinner from "./components/LoadingSpinner";
import ResultSummary from "./components/ResultSummary";
import "./App.css"; // Import the CSS file

function App() {
  const [formData, setFormData] = useState({
    phase: "first",
    rank: "",
    gender: "boys",
    caste: "oc",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const { phase, rank, gender, caste } = formData;
      const userRank = parseInt(rank);

      let matched = collegeData.filter((college) => {
        if (college.phase !== phase) return false;
        const casteRanks = college.ranks[caste];
        if (!casteRanks) return false;

        if (caste === "ews") {
          return (
            userRank <=
            (gender === "girls" ? casteRanks.girlsOu : casteRanks.genOu)
          );
        }

        return userRank <= casteRanks[gender];
      });

      // Apply text search
      if (searchText.trim() !== "") {
        matched = matched.filter(
          (college) =>
            college.instituteName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            college.branchName.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Sort if selected
      if (sortBy) {
        matched.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      }

      setResults(matched);
      setLoading(false);
    }, 500); // Simulate load delay
  };

  return (
    <div className="container">
      <h1>🎓 College Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Phase:
          <select name="phase" value={formData.phase} onChange={handleChange}>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="final">Final</option>
          </select>
        </label>

        <label>
          Rank:
          <input
            type="number"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="boys">Male</option>
            <option value="girls">Female</option>
          </select>
        </label>

        <label>
          Caste:
          <select name="caste" value={formData.caste} onChange={handleChange}>
            <option value="oc">OC</option>
            <option value="bc_a">BC-A</option>
            <option value="bc_b">BC-B</option>
            <option value="bc_c">BC-C</option>
            <option value="bc_d">BC-D</option>
            <option value="bc_e">BC-E</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
          </select>
        </label>

        <div className="button-container">
          <button type="submit">Check Colleges</button>
        </div>
      </form>

      <SortFilter
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ResultSummary results={results} formData={formData} />

          <h2>Eligible Colleges:</h2>
          {results.length === 0 ? (
            <p>No colleges found for your criteria.</p>
          ) : (
            <ul className="college-list">
              {results.map((college, idx) => {
                const casteRanks = college.ranks[formData.caste];
                const rankForGender = casteRanks
                  ? formData.gender === "girls"
                    ? casteRanks.girlsOu
                    : casteRanks.genOu
                  : null;
                return (
                  <li key={idx}>
                    <strong>{college.instituteName}</strong> —{" "}
                    {college.branchName}
                    {rankForGender && <span> (Rank: {rankForGender})</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;

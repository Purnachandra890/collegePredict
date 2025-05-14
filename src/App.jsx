import { useState } from "react";
import collegeData from "./collegeData";
import SortFilter from "./components/SortFilter";
import LoadingSpinner from "./components/LoadingSpinner";
import ResultSummary from "./components/ResultSummary";
import "./App.css";

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
  const [expandedIndex, setExpandedIndex] = useState(null);

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

      if (searchText.trim() !== "") {
        matched = matched.filter(
          (college) =>
            college.instituteName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            college.branchName.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      if (sortBy) {
        matched.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      }

      setResults(matched);
      setExpandedIndex(null);
      setLoading(false);
    }, 500);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="container">
      <h1>
        <img
          src="/logo.png"
          alt="College Predictor Logo"
          width="50"
          height="50"
          style={{ verticalAlign: "middle", marginRight: 8 }}
        />
        College Predictor
      </h1>

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
      <p style={{ color: "gray", fontSize: "0.9rem", marginTop: "0.5rem" }}>
        ℹ️ After changing sort or search options, please click{" "}
        <strong>"Check Colleges"</strong> again to see updated results.
      </p>

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
                const rankForGender =
                  formData.caste === "ews"
                    ? formData.gender === "girls"
                      ? casteRanks?.girlsOu
                      : casteRanks?.genOu
                    : casteRanks?.[formData.gender];

                return (
                  // <li key={idx}>
                  //   <div
                  //     onClick={() => toggleExpand(idx)}
                  //     title="Click to view more details"
                  //     style={{
                  //       cursor: "pointer",
                  //       padding: "12px",
                  //       border: "1px solid #ccc",
                  //       borderRadius: "8px",
                  //       background: "#f9f9f9",
                  //       marginBottom: "8px",
                  //       position: "relative",
                  //     }}
                  //   >
                  //     <div>
                  //       <strong>{college.instituteName}</strong> —{" "}
                  //       {college.branchName}
                  //     </div>
                  //     <div
                  //       style={{
                  //         position: "absolute",
                  //         right: 12,
                  //         bottom: 10,
                  //         color: "#555",
                  //         fontSize: "0.9rem",
                  //       }}
                  //     >
                  //       {expandedIndex === idx ? "▲ Hide Details" : "▼ Details"}
                  //     </div>
                  //   </div>

                  //   {expandedIndex === idx && (
                  //     <div
                  //       style={{
                  //         background: "#f0f8ff",
                  //         border: "1px solid #d0d0d0",
                  //         borderRadius: "6px",
                  //         padding: "12px",
                  //         marginTop: "6px",
                  //         marginBottom: "12px",
                  //       }}
                  //     >
                  //       <p><strong>Tuition Fee:</strong> ₹{college.tuitionFee}</p>
                  //       <p><strong>Affiliated To:</strong> {college.affiliatedTo}</p>
                  //       <p><strong>Place:</strong> {college.place}</p>
                  //       <p><strong>District Code:</strong> {college.distCode}</p>
                  //       <p><strong>Co-Education:</strong> {college.coEducation}</p>
                  //       <p><strong>College Type:</strong> {college.collegeType}</p>
                  //       <p><strong>Year of Establishment:</strong> {college.yearOfEstab}</p>
                  //       <p><strong>Branch Code:</strong> {college.branchCode}</p>
                  //       <p><strong>Eligible Rank:</strong> {rankForGender}</p>
                  //     </div>
                  //   )}
                  // </li>
                  <li key={idx} className="college-item">
                    <div
                      className="college-header"
                      onClick={() => toggleExpand(idx)}
                      title="Click to view more details"
                    >
                      <strong>{college.instituteName}</strong>
                      {" — "}
                      {college.branchName}
                    </div>

                    <div
                      className="college-toggle"
                      onClick={() => toggleExpand(idx)}
                      title="Click to view more details"
                    >
                      <span className="toggle-icon">
                        {expandedIndex === idx ? "▲" : "▼"}
                      </span>
                      <span className="toggle-text"></span>
                      {expandedIndex === idx ? "Hide Details" : "Details"}
                    </div>

                    {expandedIndex === idx && (
                      <div
                        style={{
                          background: "#f0f8ff",
                          border: "1px solid #d0d0d0",
                          borderRadius: "6px",
                          padding: "12px",
                          marginTop: "6px",
                          marginBottom: "12px",
                        }}
                      >
                        <p>
                          <strong>Tuition Fee:</strong> ₹{college.tuitionFee}
                        </p>
                        <p>
                          <strong>Affiliated To:</strong> {college.affiliatedTo}
                        </p>
                        <p>
                          <strong>Place:</strong> {college.place}
                        </p>
                        <p>
                          <strong>District Code:</strong> {college.distCode}
                        </p>
                        <p>
                          <strong>Co-Education:</strong> {college.coEducation}
                        </p>
                        <p>
                          <strong>College Type:</strong> {college.collegeType}
                        </p>
                        <p>
                          <strong>Year of Establishment:</strong>{" "}
                          {college.yearOfEstab}
                        </p>
                        <p>
                          <strong>Branch Code:</strong> {college.branchCode}
                        </p>
                        <p>
                          <strong>Eligible Rank:</strong> {rankForGender}
                        </p>
                      </div>
                    )}
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

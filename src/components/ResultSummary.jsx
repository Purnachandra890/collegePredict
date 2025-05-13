// components/ResultSummary.jsx
function ResultSummary({ results, formData }) {
  if (results.length === 0) return null;

  return (
    <p style={{ fontWeight: 'bold' }}>
      🎯 Found {results.length} colleges for {formData.caste.toUpperCase()} {formData.gender === 'girls' ? "Girls" : "Boys"}  in {formData.phase} phase.
    </p>
  );
}

export default ResultSummary;

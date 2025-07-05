import React from "react";

const FilterSidebar = ({ filters, setFilters }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div
      style={{
        width: "250px",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #dee2e6",
        height: "100vh",
        position: "sticky",
        top: "80px",
        overflowY: "auto",
      }}
    >
      <h5>Filtrele</h5>

      <div className="mb-4">
        <h6>Platform</h6>
        {["Trendyol", "Hepsiburada", "N11"].map((platform) => (
          <div key={platform} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name={platform.toLowerCase()}
              id={platform}
              checked={filters[platform.toLowerCase()] || false}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor={platform}>
              {platform}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h6>RAM</h6>
        {["4GB", "6GB", "8GB", "12GB"].map((ram) => (
          <div key={ram} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name={ram}
              id={ram}
              checked={filters[ram] || false}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor={ram}>
              {ram}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;

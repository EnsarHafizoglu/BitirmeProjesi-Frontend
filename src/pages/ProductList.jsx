import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductList = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const defaultFilters = {
    brands: [],
    ram: [],
    storage: [],
    color: [],
    price: { min: "", max: "" }
  };
  const [pendingFilters, setPendingFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Ürünler çekilirken hata oluştu:", error);
      }
    }
    fetchProducts();
  }, []);

  const uniqueBrands = [...new Set(products.map(p => p.brandName))];
  const uniqueRAMs = [...new Set(products.map(p => p.ramCapacity))];
  const uniqueStorages = [...new Set(products.map(p => p.storage))];
  const uniqueColors = [...new Set(products.map(p => p.color))];

  const handleCheckboxChange = (field, value) => {
    setPendingFilters((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((item) => item !== value)
          : [...arr, value],
      };
    });
  };

  const filtered = products.filter((product) => {
    const matchesSearch =
      (product.brandName + " " + product.modelName + " " + product.productName)
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase());

    const matchesBrand =
      activeFilters.brands.length === 0 || activeFilters.brands.includes(product.brandName);

    const matchesRAM =
      activeFilters.ram.length === 0 || activeFilters.ram.includes(product.ramCapacity);

    const matchesStorage =
      activeFilters.storage.length === 0 || activeFilters.storage.includes(product.storage);

    const matchesColor =
      activeFilters.color.length === 0 || activeFilters.color.includes(product.color);

    const price = product.discountedPrice || product.normalPrice || 0;
    const minOk = activeFilters.price.min === "" || price >= parseFloat(activeFilters.price.min);
    const maxOk = activeFilters.price.max === "" || price <= parseFloat(activeFilters.price.max);

    return matchesSearch && matchesBrand && matchesRAM && matchesStorage && matchesColor && minOk && maxOk;
  });

  return (
    <div className="product-list-container container-fluid mt-4">
      <div className="row">
        {/* Sol Filtre Paneli */}
        <div className="col-md-3 mb-4">
          <div className="product-filter-panel shadow-sm rounded-4 p-3 bg-white">
            <h5 className="filter-title border-bottom pb-2">🎯 Filtrele</h5>

            <FilterSection label="Marka" options={uniqueBrands} field="brands" selected={pendingFilters.brands} onChange={handleCheckboxChange} />
            <FilterSection label="RAM" options={uniqueRAMs} field="ram" selected={pendingFilters.ram} onChange={handleCheckboxChange} />
            <FilterSection label="Depolama" options={uniqueStorages} field="storage" selected={pendingFilters.storage} onChange={handleCheckboxChange} />
            <FilterSection label="Renk" options={uniqueColors} field="color" selected={pendingFilters.color} onChange={handleCheckboxChange} />

            <strong className="d-block mt-3">Fiyat</strong>
            <div className="d-flex gap-2 mb-3">
              <input type="number" className="form-control form-control-sm" placeholder="Min"
                value={pendingFilters.price.min}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    price: { ...pendingFilters.price, min: e.target.value },
                  })
                }
              />
              <input type="number" className="form-control form-control-sm" placeholder="Max"
                value={pendingFilters.price.max}
                onChange={(e) =>
                  setPendingFilters({
                    ...pendingFilters,
                    price: { ...pendingFilters.price, max: e.target.value },
                  })
                }
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button
                className="btn btn-primary fw-bold py-2 rounded-3 shadow-sm"
                onClick={() => setActiveFilters({ ...pendingFilters })}
              >
                🔍 Filtrele
              </button>

              <button
                className="btn btn-outline-dark py-2 rounded-3"
                onClick={() => {
                  setPendingFilters(defaultFilters);
                  setActiveFilters(defaultFilters);
                }}
              >
                ♻️ Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Ürün Kartları */}
        <div className="col-md-9">
          <h2 className="product-title">📱 Ürünler</h2>
          <div className="row">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.productID}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
                  onClick={() => navigate(`/product/${product.productID}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-card shadow-sm rounded-4 p-2 h-100">
                    <div className="product-image-wrapper text-center">
                      <img
                        src={product.productImageURL || "/logos/default.png"}
                        alt={`${product.brandName} ${product.modelName}`}
                        className="product-image img-fluid"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/img/default-image.png";
                        }}
                      />
                    </div>

                    <div className="product-card-body text-center mt-2">
                      <h6 className="fw-bold">{product.brandName} {product.modelName}</h6>
                      <p className="text-muted small mb-1">{product.productName}</p>
                      <p className="text-secondary small mb-2">
                        {product.ramCapacity} • {product.storage} • {product.batteryCapacity}
                      </p>
                    </div>

            
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted mt-4">Aradığınız kriterlere uygun ürün bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ label, options, field, selected, onChange }) => (
  <>
    <strong className="d-block mt-3">{label}</strong>
    {options.map((val) => (
      <div key={val} className="form-check mb-1">
        <input
          className="form-check-input"
          type="checkbox"
          id={`${field}-${val}`}
          checked={selected.includes(val)}
          onChange={() => onChange(field, val)}
        />
        <label className="form-check-label" htmlFor={`${field}-${val}`}>{val}</label>
      </div>
    ))}
  </>
);

export default ProductList;
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Arama verisi

  return (
    <Router>
      <Header setSearchTerm={setSearchTerm} />

      <Routes>
        <Route path="/" element={<ProductList searchTerm={searchTerm} />} />
        <Route path="/product/:productId" element={<ProductDetail />} /> {/* 🔥 Doğru */}
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;

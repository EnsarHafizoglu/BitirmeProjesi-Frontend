import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ setSearchTerm }) => {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo ve Başlık */}
        <div className="header-left">
          <img src="/logos/logo.png" alt="Logo" className="header-logo" />
          <h1 className="header-title">Sihirli Puanlar, Kolay Kararlar!</h1>
        </div>

        {/* Arama Çubuğu */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Ürün ara..."
            onChange={handleInputChange}
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
      </div>

      {/* Menü */}
      <nav className="header-nav">
        <Link to="/">Anasayfa</Link>
        <Link to="/">Ürünler</Link>
        <a href="#about">Hakkımızda</a>
        <a href="#contact">İletişim</a>
      </nav>
    </header>
  );
};

export default Header;

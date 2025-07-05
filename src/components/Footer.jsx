import React from "react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#f8f9fa", padding: "20px 0", marginTop: "40px" }}>
      <div className="container text-center">
        <p style={{ margin: 0, color: "#6c757d" }}>
          © {new Date().getFullYear()} Bitirme Projesi. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

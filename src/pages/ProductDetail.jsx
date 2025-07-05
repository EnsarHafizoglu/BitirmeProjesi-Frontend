import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import "./ProductDetail.css";
import {
  getPlatformScores,
  getProductDetails,
  getSellerScores
} from "../api/productApi";

const getLogo = (platform) => {
  switch (platform.toLowerCase()) {
    case "trendyol": return "/logos/trendyol.png";
    case "hepsiburada": return "/logos/hepsiburada.png";
    case "n11": return "/logos/n11.png";
    default: return "/logos/default.png";
  }
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [scores, setScores] = useState([]);
  const [sellerScores, setSellerScores] = useState([]);
  const [showAllSellers, setShowAllSellers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scoreData, productData, sellerData] = await Promise.all([
          getPlatformScores(productId),
          getProductDetails(productId),
          getSellerScores(productId)
        ]);
        setScores(scoreData);
        setSellerScores(sellerData);
        if (productData) {
          setProduct({
            name: productData.productName,
            image: productData.productImageURL,
            ram: productData.ramCapacity,
            storage: productData.storage,
            battery: productData.batteryCapacity,
            color: productData.color,
            cpu: productData.cpuFrequency,
            screen: productData.screenSize
          });
        }
      } catch (err) {
        console.error("Veri alınamadı:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  return (
    <div className="product-detail-container">
      <h2 className="product-detail-title text-center mb-4">{product.name}</h2>

      {/* Ürün Özellikleri + Görsel */}
      <div className="container mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="row text-center fw-semibold mb-2">
              <div className="col">RAM</div>
              <div className="col">Depolama</div>
              <div className="col">Batarya</div>
            </div>
            <div className="row text-center mb-5">
              <div className="col">{product.ram || "-"}</div>
              <div className="col">{product.storage || "-"}</div>
              <div className="col">{product.battery || "-"}</div>
            </div>
            <div className="row text-center fw-semibold mb-2">
              <div className="col">Renk</div>
              <div className="col">Ekran</div>
              <div className="col">CPU</div>
            </div>
            <div className="row text-center">
              <div className="col">{product.color || "-"}</div>
              <div className="col">{product.screen || "-"}</div>
              <div className="col">{product.cpu || "-"}</div>
            </div>
          </div>

          <div className="col-lg-4 text-center">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded shadow"
              style={{ maxWidth: 300 }}
            />
          </div>
        </div>
      </div>

      {/* Skor Kartları */}
      <div className="container platform-scores">
        {loading ? (
          <p className="text-center">Yükleniyor...</p>
        ) : scores.length === 0 ? (
          <p className="text-center text-danger">Skor verisi bulunamadı.</p>
        ) : (
          <div className="row">
            {scores.map((score, index) => (
              <div key={index} className="col-xl-4 col-md-6 col-sm-12 mb-4">
                <div className="card h-100 p-3 shadow-sm border-0 rounded-4 text-center">
                  <img
                    src={getLogo(score.platform)}
                    alt={score.platform}
                    style={{ height: 50 }}
                    className="mb-2 mx-auto"
                  />
                  <h5>{score.platform}</h5>

                  <div className="my-3" style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <RadialBarChart
                        cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" barSize={10}
                        data={[{
                          name: "Memnuniyet",
                          value: score.memnuniyet ?? 0,
                          fill: "#00C49F"
                        }]}
                        startAngle={90} endAngle={-270}
                      >
                        <RadialBar dataKey="value" />
                        <text
                          x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                          style={{ fontSize: "18px", fill: "#333" }}
                        >
                          {`${(score.memnuniyet ?? 0).toFixed(1)}%`}
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ width: "100%", height: 150 }}>
                    <ResponsiveContainer>
                      <BarChart
                        layout="vertical"
                        data={[
                          { name: "Kalite", puan: score.kalite ?? 0 },
                          { name: "Fiyat/Performans", puan: score.fiyatPerformans ?? 0 },
                          { name: "Kargolama", puan: score.kargolama ?? 0 }
                        ]}
                      >
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Bar dataKey="puan" fill="#007bff" radius={[4, 4, 4, 4]} />
                      </BarChart>
                    </ResponsiveContainer>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Satıcılar Alanı */}
      {sellerScores.length > 0 && (
        <div className="container mt-5">
  <h4 className="text-center mb-4">Satıcı Performansları</h4>

  <div className="row">
    {(showAllSellers ? sellerScores : sellerScores.slice(0, 5)).map((seller, idx) => (
      <div className="col-lg-6 col-xl-4 mb-4" key={idx}>
        <div className="card h-100 shadow-sm p-3 rounded-4">
          <h5 className="text-primary text-center">{seller.seller}</h5>

          <div className="d-flex justify-content-between align-items-center my-3">
            <div style={{ width: 80, height: 80 }}>
              <ResponsiveContainer>
                <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ value: seller.memnuniyet ?? 0 }]}>
                  <RadialBar background dataKey="value" fill="#00C49F" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="fs-6 fw-semibold text-center">
              Memnuniyet <br />
              {seller.memnuniyet?.toFixed(1) ?? 0}%
            </div>
          </div>

          <div style={{ width: "100%", height: 120 }}>
            <ResponsiveContainer>
              <BarChart layout="vertical" data={[
                { name: "Kalite", puan: seller.kalite ?? 0 },
                { name: "Fiyat/Performans", puan: seller.fiyatPerformans ?? 0 },
                { name: "Kargolama", puan: seller.kargolama ?? 0 }
              ]}>
                <XAxis type="number" domain={[0, 1]} hide />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="puan" fill="#007bff" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-muted text-end mt-2 mb-0">Platform: {seller.platform}</p>
        </div>
      </div>
    ))}
  </div>

  {sellerScores.length > 5 && (
    <div className="text-center mt-3">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => setShowAllSellers(!showAllSellers)}
      >
        {showAllSellers ? "Daha Az Göster" : "Tüm Satıcıları Göster"}
      </button>
    </div>
  )}
</div>

      )}
    </div>
  );
};

export default ProductDetail;

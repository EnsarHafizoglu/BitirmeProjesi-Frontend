import axios from 'axios';

const BASE_URL = 'https://localhost:44365/api/product';

export const getProducts = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

export const getPlatformScores = async (productId) => {z
  const response = await axios.get(`${BASE_URL}/${productId}/platform-scores`);
  return response.data;
};

export const getFilteredProducts = async (filters) => {
  const response = await axios.post(`${BASE_URL}/filter`, filters);
  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await axios.get(`${BASE_URL}/${productId}`);
  return response.data;
};
export const getSellerScores = async (productId) => {
  const response = await fetch(`https://localhost:44365/api/product/${productId}/seller-scores`);
  if (!response.ok) {
    throw new Error("Satıcı verileri alınamadı");
  }
  return await response.json();
};


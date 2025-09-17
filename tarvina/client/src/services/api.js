// src/services/api.js
import axios from "axios";

const api = axios.create({
  // Proxy kullandığınız için sadece /api yazıyorsunuz
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor → her isteğe token ekler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → 401 (Unauthorized) hatasını yakalar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Yetkilendirme hatası: Token geçersiz veya eksik. Kullanıcı çıkışa yönlendiriliyor.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Kullanıcıyı giriş sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

export default api;
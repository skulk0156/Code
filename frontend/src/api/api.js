import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const testConnection = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/test`);
    return res.data;
  } catch (err) {
    console.error("API Error:", err);
    return { message: "Error connecting to backend" };
  }
};

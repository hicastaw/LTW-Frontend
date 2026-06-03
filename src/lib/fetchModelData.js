export const BASE_URL = "http://localhost:8081";

/**
 * Helper fetch có gắn JWT token từ localStorage.
 * Có thể dùng cho cả GET, POST, PUT, DELETE.
 */
export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const fullUrl = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  
  const headers = {
    ...(options.headers || {}),
  };

  // Chỉ thêm Content-Type nếu không phải FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(fullUrl, {
    ...options,
    credentials: "include", // gửi cookie session
    headers,
  });
}

/**
 * fetchModel - Dành riêng cho request GET và tự động parse JSON (kế thừa logic cũ của đồ án).
 */
async function fetchModel(url) {
  const response = await authFetch(url);

  if (!response.ok) {
    try {
      const err = await response.json();
      throw new Error(err.error || response.statusText);
    } catch {
      throw new Error(response.statusText);
    }
  }

  return await response.json();
}

export default fetchModel;

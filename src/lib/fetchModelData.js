export const BASE_URL = "https://tj4q68-8081.csb.app";

// Core fetch with JWT
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
    headers,
  });
}

// GET fetch wrapper
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

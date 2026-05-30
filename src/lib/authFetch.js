/**
 * Helper fetch có gắn JWT token từ localStorage.
 * Dùng thay cho fetch() thông thường ở mọi nơi cần xác thực.
 */
const BASE_URL = "http://localhost:8081";

export function authFetch(path, options = {}) {
  const token = localStorage.getItem("authToken");
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

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export { BASE_URL };

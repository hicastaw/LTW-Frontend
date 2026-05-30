const BASE_URL = "http://localhost:8081";

/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url  The URL path to issue the GET request (relative to BASE_URL).
 * @returns {Promise}   A promise that resolves to the JSON response data,
 *                      or rejects with an Error object.
 */
function fetchModel(url) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  return fetch(fullUrl, {
    credentials: "include", // gửi cookie session
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.error || response.statusText);
      });
    }
    return response.json();
  });
}

export default fetchModel;

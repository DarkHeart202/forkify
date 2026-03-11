import { TIMEOUT_SEC } from './config';

export const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} Seconds`));
    }, 1000 * s);
  });
};
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/* export const getJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const sendJson = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/

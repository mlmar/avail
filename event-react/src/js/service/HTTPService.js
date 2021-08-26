import { SERVER_URL } from '../util/System.js';

export const post = async (endpoint, data) => {
  try {
    const response = await fetch(SERVER_URL + "/" + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch(error) {
    console.error("Error posting to server");
    return null;
  }
}

export const get = async (endpoint) => {
  try {
    const response = await fetch(SERVER_URL + "/" + endpoint, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json();
  } catch(error) {
    console.error("Error getting from server");
    return null;
  }
}

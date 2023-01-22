export const REST_API_URL = "http://localhost:8000/api/v1"

export async function GET(endpoint: string, limit: number, offset: number) {
  return fetch(`${REST_API_URL}/${endpoint}?limit=${limit}&offset=${offset}`);
};
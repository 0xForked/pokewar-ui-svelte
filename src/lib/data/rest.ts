export const REST_API_URL = "http://localhost:8000/api/v1"

export async function GET(endpoint: string) {
  return fetch(`${REST_API_URL}/${endpoint}`);
};
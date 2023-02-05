export const REST_API_URL = "https://pokewar.azurewebsites.net/api/v1"

export async function GET(endpoint: string) {
  return fetch(`${REST_API_URL}/${endpoint}`);
};
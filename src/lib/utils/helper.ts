export function generateRandomId(): string {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return  randLetter + Date.now();
}

export function isJsonString(str: string) {
  try {
      JSON.parse(str)
      return true
  } catch (e) {
      return false
  }
}
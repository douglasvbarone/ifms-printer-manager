const LOCAL_STORAGE_KEY = "token"

export function saveJwtToken(token: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY, token)
}

export function getJwtToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEY)
}

export function removeJwtToken() {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

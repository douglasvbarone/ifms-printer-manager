const BASE_URL = process.env.BASE_URL || "http://localhost:8000/api/"

export async function api<T>(endpoint: string, options: any): Promise<T> {
  const token = localStorage.getItem("token")

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: token,
    }
  }

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
  }

  const response = await fetch(BASE_URL + endpoint, options)

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.error)
}

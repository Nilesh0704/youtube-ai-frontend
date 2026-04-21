export function getToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");

  console.log("GET TOKEN:", token); // 🔥 DEBUG

  return token;
}

export function setToken(token: string) {
    localStorage.setItem("token", token);
}

export function removeToken() {
    localStorage.removeItem("token");
}

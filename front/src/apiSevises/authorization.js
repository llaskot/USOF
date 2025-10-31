export const login = async (username, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({login: username, password:password }),
  });
  if (res.status === 401 || res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
};

export const registration = async (payload) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 400 || res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
};

export const confirmEmail = async (payload) => {
  const res = await fetch("/api/auth/register/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 400 || res.status === 401 || res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
};

export const logoutUser = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (res.status === 400 || res.status === 401 || res.ok) {
    return await res.json();
  }
  throw new Error(res.statusText);
};



export async function refreshToken() {
  const res = await fetch("/api/auth/refresh");
  if (!res.ok) throw new Error(res.message);
  return res.json();
}

export const estaAutenticado = () => {
  const data = localStorage.getItem("usuario");
  if (!data) return false;
  try {
    const { token } = JSON.parse(data);
    if (!token) return false;
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem("usuario");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("usuario");
    return false;
  }
};


export const estaAutenticado = () => {
  return !!localStorage.getItem("usuario");
};

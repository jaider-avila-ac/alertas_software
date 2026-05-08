import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook personalizado que agrega automáticamente el slug a las rutas
 * Ejemplo: navigate("/estudiantes") → navega a "/mi-colegio/estudiantes"
 */
export function useNavigateWithSlug() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const navigateWithSlug = useCallback(
    (to, options) => {
      // Si es una ruta externa o empezar con http, no modificar
      if (to.startsWith("http") || to.startsWith("//") || to.startsWith("mailto:")) {
        return navigate(to, options);
      }
      
      // Si ya incluye el slug al inicio, no duplicar
      if (slug && to.startsWith(`/${slug}`)) {
        return navigate(to, options);
      }
      
      // Si es una ruta que NO debe incluir slug (como login, registro)
      const rutasPublicas = ["/login", "/registro", "/", "/super-admin"];
      if (rutasPublicas.some(r => to.startsWith(r))) {
        return navigate(to, options);
      }
      
      // Si no hay slug, navegar normalmente
      if (!slug) {
        return navigate(to, options);
      }
      
      // Agregar el slug al inicio de la ruta
      const newPath = to === "/" || to === "" ? `/${slug}` : `/${slug}${to}`;
      navigate(newPath, options);
    },
    [navigate, slug]
  );

  return navigateWithSlug;
}
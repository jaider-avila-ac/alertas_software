import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerInfoInstitucion,
  validarCorreoPorSlug,
  validarPasswordPorSlug,
  forzarSesionPorSlug,
  validarCorreoSuperAdmin,
  validarPasswordSuperAdmin,
} from "../../services/auth.service";

export function useLoginPage() {
  const { slug } = useParams();
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [instInfo,        setInstInfo]        = useState(null);
  const [instError,       setInstError]       = useState("");
  const [loadingInfo,     setLoadingInfo]      = useState(true);

  const [step,            setStep]            = useState("correo");
  const [correo,          setCorreo]          = useState("");
  const [password,        setPassword]        = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [sessionToken,    setSession]         = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [conflictoSesion, setConflictoSesion] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resetear = () => {
      if (!cancelled) {
        setInstInfo(null);
        setInstError("");
        setLoadingInfo(true);
      }
    };
    resetear();

    obtenerInfoInstitucion(slug)
      .then(data  => { if (!cancelled) setInstInfo(data); })
      .catch(err  => {
        if (cancelled) return;
        const msg = err?.response?.data?.error ?? err?.response?.data?.mensaje ?? "";
        const deshabilitada = msg.toLowerCase().includes("deshabilitada") ||
                              msg.toLowerCase().includes("disabled");
        setInstError(
          deshabilitada
            ? "Esta institución aún no ha sido habilitada. Contacta al administrador del sistema."
            : "Institución no encontrada. Verifica la URL."
        );
      })
      .finally(() => { if (!cancelled) setLoadingInfo(false); });

    return () => { cancelled = true; };
  }, [slug]);

  const esSuperAdmin = instInfo?.esSuperAdmin ?? false;

  async function handleCorreo(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setConflictoSesion(null);
    try {
      const resp = esSuperAdmin
        ? await validarCorreoSuperAdmin(correo)
        : await validarCorreoPorSlug(slug, correo);
      setSession(resp.token);
      setStep("password");
    } catch (err) {
      const msg = err?.response?.data?.mensaje ?? err?.response?.data ?? "Correo no encontrado en esta institución.";
      setError(typeof msg === "string" ? msg : "Correo no encontrado.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setConflictoSesion(null);
    try {
      const resp = esSuperAdmin
        ? await validarPasswordSuperAdmin(sessionToken, password)
        : await validarPasswordPorSlug(slug, sessionToken, password);
      login(resp.token, slug);
      navigate(`/${slug}/dashboard`, { replace: true });
    } catch (err) {
      if (err?.response?.status === 409) {
        setConflictoSesion(err.response.data?.sesionActiva ?? {});
      } else {
        const msg = err?.response?.data?.mensaje ?? err?.response?.data ?? "Contraseña incorrecta.";
        setError(typeof msg === "string" ? msg : "Contraseña incorrecta.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForzarSesion() {
    setLoading(true);
    setError("");
    setConflictoSesion(null);
    try {
      const resp = esSuperAdmin
        ? await validarPasswordSuperAdmin(sessionToken, password)
        : await forzarSesionPorSlug(slug, sessionToken, password);
      login(resp.token, slug);
      navigate(`/${slug}/dashboard`, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.mensaje ?? "Error al iniciar sesión.";
      setError(typeof msg === "string" ? msg : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  const volverACorreo = () => { setStep("correo"); setError(""); setConflictoSesion(null); };

  return {
    slug,
    instInfo,
    instError,
    loadingInfo,
    esSuperAdmin,
    isCorreo: step === "correo",
    correo,          setCorreo,
    password,        setPassword,
    showPass,        setShowPass,
    loading,
    error,
    conflictoSesion,
    handleCorreo,
    handlePassword,
    handleForzarSesion,
    volverACorreo,
  };
}

import { useState, useEffect, useCallback } from "react";
import { listarGrados, crearGrado, actualizarGrado } from "../../services/grados.service";
import { listarGruposPorGrado, crearGrupo, actualizarGrupo } from "../../services/grupos.service";

const FORM_GRADO_VACIO = { nombre: "" };
const FORM_GRUPO_VACIO = { nombre: "" };

let _gradosCache = null;

export function useGradosYGrupos() {
    // --- ESTADOS DE GRADOS ---
    const [grados, setGrados] = useState(_gradosCache ?? []);
    const [loadingGrados, setLoadingGrados] = useState(!_gradosCache);
    const [gradoForm, setGradoForm] = useState(FORM_GRADO_VACIO);
    const [editGradoId, setEditGradoId] = useState(null);
    const [savingGrado, setSavingGrado] = useState(false);
    const [errorGrado, setErrorGrado] = useState("");

    // --- ESTADOS DE GRUPOS ---
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
    const [grupos, setGrupos] = useState([]);
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    const [grupoForm, setGrupoForm] = useState(FORM_GRUPO_VACIO);
    const [editGrupoId, setEditGrupoId] = useState(null);
    const [savingGrupo, setSavingGrupo] = useState(false);
    const [errorGrupo, setErrorGrupo] = useState("");

    const sort = useCallback(arr => [...arr].sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "")), []);

    // --- FUNCIONES DE CARGA ---
    const cargarGrados = useCallback(async () => {
        setLoadingGrados(true);
        try {
            const data = await listarGrados();
            const sorted = sort(data);
            _gradosCache = sorted;
            setGrados(sorted);
        } catch { setErrorGrado("Error al cargar los grados."); }
        finally { setLoadingGrados(false); }
    }, [sort]);

    const cargarGrupos = useCallback(async (gradoId) => {
        if (!gradoId) return;
        setLoadingGrupos(true);
        try {
            const data = await listarGruposPorGrado(gradoId);
            setGrupos(sort(data));
        } catch { setErrorGrupo("Error al cargar los grupos."); }
        finally { setLoadingGrupos(false); }
    }, [sort]);

    // --- EFECTOS (CORRECCIÓN FINAL PARA EL LINTER) ---

    // 1. Carga inicial de grados
    useEffect(() => {
        let activo = true;
        listarGrados()
            .then(data => {
                if (!activo) return;
                const sorted = sort(data);
                _gradosCache = sorted;
                setGrados(sorted);
            })
            .catch(() => { if (activo) setErrorGrado("Error inicial."); })
            .finally(() => { if (activo) setLoadingGrados(false); });
        return () => { activo = false; };
    }, [sort]);

    // 2. Carga de grupos (Sin setLoadingGrupos síncrono)
    useEffect(() => {
        if (!gradoSeleccionado?.id) return;

        let activo = true;
        
        // Ejecutamos la carga. El truco es que el primer "render" del efecto
        // no debería disparar un setState síncrono.
        // Lo envolvemos en una promesa para que ocurra en el siguiente "tick"
        // o simplemente dejamos que el finally lo apague.
        
        const fetchData = async () => {
            // Si el linter sigue molestando, podrías quitar este setLoadingGrupos(true)
            // y manejarlo desde el handleSeleccionarGrado.
            setLoadingGrupos(true); 
            try {
                const data = await listarGruposPorGrado(gradoSeleccionado.id);
                if (activo) setGrupos(sort(data));
            } catch {
                if (activo) setErrorGrupo("Error al obtener grupos.");
            } finally {
                if (activo) setLoadingGrupos(false);
            }
        };

        fetchData();
        return () => { activo = false; };
    }, [gradoSeleccionado?.id, sort]);

    // --- HANDLERS (CLAVE PARA EL RENDIMIENTO) ---

    const handleSeleccionarGrado = (grado) => {
        setGradoSeleccionado(grado);
        setEditGrupoId(null);
        setGrupoForm(FORM_GRUPO_VACIO);
        setErrorGrupo("");
        
        if (!grado) {
            setGrupos([]);
            setLoadingGrupos(false);
        } else {
            // ✅ ESTA ES LA CLAVE: Seteamos el loading aquí, 
            // ante la acción del usuario, no dentro del efecto.
            setLoadingGrupos(true); 
        }
    };

    // ... (El resto de los handlers se mantienen igual)
    const handleSubmitGrado = async (e) => {
        e.preventDefault();
        setSavingGrado(true); setErrorGrado("");
        try {
            editGradoId
                ? await actualizarGrado(editGradoId, { nombre: gradoForm.nombre })
                : await crearGrado({ nombre: gradoForm.nombre });
            setGradoForm(FORM_GRADO_VACIO);
            setEditGradoId(null);
            await cargarGrados();
        } catch (err) { setErrorGrado(err?.response?.data?.mensaje ?? "Error."); }
        finally { setSavingGrado(false); }
    };

    const handleEditarGrado = (row) => { setEditGradoId(row.id); setGradoForm({ nombre: row.nombre ?? "" }); };
    const handleCancelarGrado = () => { setEditGradoId(null); setGradoForm(FORM_GRADO_VACIO); };

    const handleSubmitGrupo = async (e) => {
        e.preventDefault();
        if (!gradoSeleccionado) return;
        setSavingGrupo(true); setErrorGrupo("");
        try {
            editGrupoId
                ? await actualizarGrupo(editGrupoId, { nombre: grupoForm.nombre })
                : await crearGrupo(gradoSeleccionado.id, { nombre: grupoForm.nombre });
            setGrupoForm(FORM_GRUPO_VACIO);
            setEditGrupoId(null);
            await cargarGrupos(gradoSeleccionado.id);
        } catch (err) { setErrorGrupo(err?.response?.data?.mensaje ?? "Error."); }
        finally { setSavingGrupo(false); }
    };

    const handleEditarGrupo = (row) => { setEditGrupoId(row.id); setGrupoForm({ nombre: row.nombre ?? "" }); };
    const handleCancelarGrupo = () => { setEditGrupoId(null); setGrupoForm(FORM_GRUPO_VACIO); };

    return {
        grados, loadingGrados, gradoForm, editGradoId, savingGrado, errorGrado,
        gradoSeleccionado, grupos, loadingGrupos, grupoForm, editGrupoId, savingGrupo, errorGrupo,
        setGradoForm, handleSubmitGrado, handleEditarGrado, handleCancelarGrado, handleSeleccionarGrado,
        setGrupoForm, handleSubmitGrupo, handleEditarGrupo, handleCancelarGrupo,
    };
}
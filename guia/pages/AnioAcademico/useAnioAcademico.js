import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    listarAnios, crearAnio, activarAnio, cerrarAnio,
    obtenerConfigEval, guardarConfigEval,
    listarNotas, reemplazarNotas, obtenerAnioActivo,
} from "../../services/anio-academico.service";

function generarPlantilla(numNotas) {
    const count = parseInt(numNotas || 1, 10);
    const pct = Math.round((100 / count) * 100) / 100;
    return Array.from({ length: count }, (_, i) => ({ nombre: `Nota ${i + 1}`, porcentaje: pct }));
}

function expandirParaCortes(plantilla, numCortes) {
    const res = [];
    for (let corte = 1; corte <= parseInt(numCortes || 1, 10); corte++) {
        plantilla.forEach(n => res.push({ corte, nombre: n.nombre, porcentaje: n.porcentaje }));
    }
    return res;
}

export function useAnioAcademico() {
    const { refreshAnioActivo } = useAuth();

    const [anios, setAnios]               = useState([]);
    const [loadingAnios, setLoadingAnios] = useState(true);
    const [nuevoAnio, setNuevoAnio]       = useState("");
    const [creando, setCreando]           = useState(false);
    const [activando, setActivando]       = useState(null);
    const [cerrando, setCerrando]         = useState(null);

    const [activoId, setActivoId]         = useState(null);
    const [activoNombre, setActivoNombre] = useState("—");
    const [numCortes, setNumCortes]       = useState(1);
    const [numNotas, setNumNotas]         = useState(1);
    const [plantilla, setPlantilla]       = useState([]);
    const [loadingCfg, setLoadingCfg]     = useState(true);
    const [savingCfg, setSavingCfg]       = useState(false);
    const [msgCfg, setMsgCfg]             = useState("");
    const [errCfg, setErrCfg]             = useState("");

    function cargarAnios() {
        setLoadingAnios(true);
        return listarAnios().then(setAnios).finally(() => setLoadingAnios(false));
    }

    function cargarActivoYConfig() {
        setLoadingCfg(true);
        return obtenerAnioActivo()
            .then(a => {
                setActivoId(a.id);
                setActivoNombre(a.anio);
                return obtenerConfigEval(a.id).then(cfg => ({ a, cfg }));
            })
            .then(({ a, cfg }) => {
                const nc = cfg.numeroCortes || 1;
                const nn = cfg.numeroNotas || 1;
                setNumCortes(nc);
                setNumNotas(nn);
                return listarNotas(a.id).then(resp => ({ nn, resp }));
            })
            .then(({ nn, resp }) => {
                const notas = Array.isArray(resp?.notas) ? resp.notas : [];
                const corte1 = notas.filter(x => x.corte === 1)
                    .map(x => ({ nombre: x.nombre, porcentaje: x.porcentaje }));
                setPlantilla(corte1.length ? corte1 : generarPlantilla(nn));
            })
            .catch(() => {
                setActivoId(null);
                setActivoNombre("—");
                setPlantilla([]);
            })
            .finally(() => setLoadingCfg(false));
    }

    useEffect(() => {
        listarAnios()
            .then(setAnios)
            .finally(() => setLoadingAnios(false));

        obtenerAnioActivo()
            .then(a => {
                setActivoId(a.id);
                setActivoNombre(a.anio);
                return obtenerConfigEval(a.id).then(cfg => ({ a, cfg }));
            })
            .then(({ a, cfg }) => {
                const nc = cfg.numeroCortes || 1;
                const nn = cfg.numeroNotas || 1;
                setNumCortes(nc);
                setNumNotas(nn);
                return listarNotas(a.id).then(resp => ({ nn, resp }));
            })
            .then(({ nn, resp }) => {
                const notas = Array.isArray(resp?.notas) ? resp.notas : [];
                const corte1 = notas.filter(x => x.corte === 1)
                    .map(x => ({ nombre: x.nombre, porcentaje: x.porcentaje }));
                setPlantilla(corte1.length ? corte1 : generarPlantilla(nn));
            })
            .catch(() => {
                setActivoId(null);
                setPlantilla([]);
            })
            .finally(() => setLoadingCfg(false));
    }, []);

    async function handleCrearAnio(e) {
        e.preventDefault();
        const n = parseInt(nuevoAnio, 10);
        if (!n) return;
        setCreando(true);
        try {
            await crearAnio(n);
            setNuevoAnio("");
            await cargarAnios();
        } finally { setCreando(false); }
    }

    async function handleActivar(id) {
        setActivando(id);
        try {
            await activarAnio(id);
            await Promise.all([cargarAnios(), cargarActivoYConfig()]);
            await refreshAnioActivo();
        } finally { setActivando(null); }
    }

    async function handleCerrar(id) {
        if (!window.confirm("¿Cerrar el año activo? Los usuarios no podrán registrar datos hasta activar otro año.")) return;
        setCerrando(id);
        try {
            await cerrarAnio(id);
            await Promise.all([cargarAnios(), cargarActivoYConfig()]);
            await refreshAnioActivo();
        } finally { setCerrando(null); }
    }

    function handlePlantillaChange(idx, field, value) {
        setPlantilla(prev => prev.map((n, i) =>
            i === idx ? { ...n, [field]: field === "porcentaje" ? parseFloat(value) || 0 : value } : n
        ));
    }

    function handleNumNotasChange(v) {
        setNumNotas(v);
        setPlantilla(generarPlantilla(v));
    }

    async function handleGuardarCfg() {
        if (!activoId) return;
        setSavingCfg(true); setMsgCfg(""); setErrCfg("");
        try {
            await guardarConfigEval(activoId, {
                numeroCortes: parseInt(numCortes, 10),
                numeroNotas:  parseInt(numNotas, 10),
            });
            await reemplazarNotas(activoId, expandirParaCortes(plantilla, numCortes));
            setMsgCfg("Configuración guardada correctamente.");
            await cargarActivoYConfig();
        } catch (err) {
            setErrCfg(err?.response?.data?.mensaje ?? "Error al guardar.");
        } finally { setSavingCfg(false); }
    }

    return {
        anios, loadingAnios, nuevoAnio, setNuevoAnio, creando, activando, cerrando,
        handleCrearAnio, handleActivar, handleCerrar,
        activoId, activoNombre, numCortes, setNumCortes,
        numNotas, plantilla, loadingCfg, savingCfg, msgCfg, errCfg,
        handleNumNotasChange, handlePlantillaChange, handleGuardarCfg,
    };
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Pencil, UserPlus, UserCheck, Loader2 } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { listarDocentes, generarUsuario } from "../../services/docentes.service";

const COLUMNS = [
  { key: "nombres",   label: "Nombre",    render: (_, r) => `${r.nombres} ${r.apellidos}` },
  { key: "documento", label: "Documento" },
  { key: "genero",    label: "Género",    render: v => ({ M:"Masculino", F:"Femenino", O:"Otro" }[v] ?? v), sortable: false },
  { key: "correo",    label: "Correo" },
  { key: "telefono",  label: "Teléfono",  sortable: false },
];

let _docentesCache = null;

export default function DocentesPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [docentes,  setDocentes]  = useState(_docentesCache ?? []);
  const [loading,   setLoading]   = useState(!_docentesCache);
  const [usuarios,  setUsuarios]  = useState({});

  useEffect(() => {
    let active = true;
    listarDocentes()
      .then(data => {
        if (!active) return;
        const ordenados = [...data].sort((a, b) =>
          `${a.nombres} ${a.apellidos}`.localeCompare(`${b.nombres} ${b.apellidos}`)
        );
        _docentesCache = ordenados;
        setDocentes(ordenados);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleGenerarUsuario = async (row) => {
    setUsuarios(prev => ({ ...prev, [row.id]: "loading" }));
    try {
      await generarUsuario(row.id);
      setUsuarios(prev => ({ ...prev, [row.id]: "ok" }));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setUsuarios(prev => ({ ...prev, [row.id]: "ok" }));
      } else {
        setUsuarios(prev => ({ ...prev, [row.id]: "error" }));
        setTimeout(() => setUsuarios(prev => ({ ...prev, [row.id]: undefined })), 1500);
      }
    }
  };

  const renderAcciones = row => {
    const uState = usuarios[row.id];
    return (
      <>
        <button
          onClick={() => navigate(`/${slug}/docentes/editar/${row.id}`, { state: { docente: row } })}
          className="relative group flex items-center justify-center p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
        >
          <Pencil size={14} />
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
            Editar
          </span>
        </button>

        {uState === "loading" ? (
          <span className="flex items-center justify-center p-1.5 text-gray-400">
            <Loader2 size={14} className="animate-spin" />
          </span>
        ) : uState === "ok" ? (
          <span className="relative group flex items-center justify-center p-1.5 text-emerald-600">
            <UserCheck size={14} />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
              Usuario creado
            </span>
          </span>
        ) : (
          <button
            onClick={() => handleGenerarUsuario(row)}
            className="relative group flex items-center justify-center p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <UserPlus size={14} />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
              Crear usuario
            </span>
          </button>
        )}
      </>
    );
  };

  return (
    <div className="p-2 space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Docentes</h2>
          <p className="text-sm text-gray-400">Gestión de docentes de la institución</p>
        </div>
        <button
          onClick={() => navigate(`/${slug}/docentes/nuevo`)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
         Agregar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ height: 600 }}>
        <div className="p-4 flex flex-col h-full">
          <DataTable
            columns={COLUMNS}
            rows={docentes}
            actions={renderAcciones}
            loading={loading}
            empty="No hay docentes registrados."
            defaultSort={{ key: "nombres", dir: "asc" }}
            searchKeys={["nombres", "apellidos", "documento", "correo"]}
            pageSize={10}
          />
        </div>
      </div>

    </div>
  );
}
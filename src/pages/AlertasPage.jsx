import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerTodasConsultas } from "../services/consultaService";

import DataTable from "../components/ui/DataTable";
import { Button } from "../components/Button";
import { ComboBox } from "../components/ComboBox";

const COLUMNS = [
  { key: "id",     label: "ID",     sortable: true  },
  { key: "motivo", label: "Motivo", sortable: true  },
  { key: "fecha",  label: "Fecha",  sortable: true  },
  { key: "estado", label: "Estado", sortable: true  },
  { key: "nivel",  label: "Nivel",  sortable: true  },
];

const ESTADOS = ["pendiente", "en_progreso", "en_cita", "completado"];

export const AlertasPage = () => {
  const [alertas, setAlertas]           = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("pendiente");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarAlertas = async () => {
      setCargando(true);
      try {
        const res = await obtenerTodasConsultas();
        setAlertas(
          (res.data || []).map((a) => ({
            ...a,
            fecha: a.fecha ? new Date(a.fecha).toLocaleDateString() : "Sin fecha",
          }))
        );
      } catch (error) {
        console.error("Error cargando alertas:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarAlertas();
  }, []);

  const alertasFiltradas = estadoFiltro === "todos"
    ? alertas
    : alertas.filter((a) => a.estado?.toLowerCase() === estadoFiltro.toLowerCase());

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Alertas</h2>

      <div className="flex items-center gap-3 flex-wrap">
        <ComboBox
          opciones={["todos", ...ESTADOS]}
          valor={estadoFiltro}
          onChange={setEstadoFiltro}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={alertasFiltradas}
        loading={cargando}
        searchKeys={["motivo", "nivel"]}
        actions={(row) => (
          <Button
            text="Ver"
            color="bg-green-600"
            onClick={() =>
              navigate(
                `/seguimientos/${row.id}?estudiante=${row.estudiante?.nombres ?? ""} ${row.estudiante?.apellidos ?? ""}`
              )
            }
          />
        )}
        empty="No hay alertas en este estado."
      />
    </main>
  );
};

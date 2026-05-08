import { useNavigate } from "react-router-dom";
import { Esqueleto } from "../../components/Esqueleto";
import { EstudianteAlertaCard } from "../../components/EstudianteAlertaCard";
import { useEstudianteAlertas } from "./useEstudianteAlertas";

export const EstudianteAlertasPage = () => {
  const { grupos, cargando } = useEstudianteAlertas();
  const navigate = useNavigate();

  return (
    <main className="space-y-4">
      <h2 className="text-2xl font-bold">Alertas por Estudiante</h2>

      <div>
        {cargando ? (
          Array(5)
            .fill(0)
            .map((_, i) => <Esqueleto key={i} className="h-16 w-full rounded mb-3" />)
        ) : grupos.length === 0 ? (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
            No hay alertas registradas.
          </div>
        ) : (
          grupos.map((g) => (
            <EstudianteAlertaCard
              key={g.estudianteId}
              grupo={g}
              onClick={() =>
                navigate(`/consultas/estudiante/${g.estudianteId}`, {
                  state: { from: "consultas" },
                })
              }
            />
          ))
        )}
      </div>
    </main>
  );
};

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FormularioConsulta } from "../components/FormularioConsulta";
import { Layout } from "../layout/Layout";

export const AlertaNueva = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idAlerta = id && window.location.pathname.includes("editar-alerta") ? id : null;
  const idEstudiante = !idAlerta ? id || searchParams.get("estudianteId") : null;

  return (

    <div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {idAlerta ? "Editar Alerta" : "Nueva Alerta"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Volver
        </button>
      </div>

      <FormularioConsulta idEstudiante={idEstudiante} idAlerta={idAlerta} />

    </div>
  );
};

import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FormularioConsulta } from "../components/FormularioConsulta";
import { Button } from "../components/Button";
import { ArrowLeft } from "lucide-react";

export const AlertaNueva = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idAlerta = id && window.location.pathname.includes("editar-alerta") ? id : null;
  
  // Obtener el ID del estudiante desde el QR o desde la URL normal
  const estudianteIdFromQR = searchParams.get("estudianteId");
  const idEstudiante = !idAlerta ? (estudianteIdFromQR || id) : null;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {idAlerta ? "Editar Alerta" : "Nueva Alerta"}
        </h2>
        <Button
          text="Volver"
          icon={ArrowLeft}
          color="bg-gray-500"
          onClick={() => navigate("/consultas")}
        />
      </div>

      <FormularioConsulta idEstudiante={idEstudiante} idAlerta={idAlerta} />
    </div>
  );
};
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerEstudiantePorId,
  buscarEstudiante,
} from "../services/estudianteService";
import { obtenerDocentePorId } from "../services/docenteService";
import {
  crearConsulta,
  obtenerConsultaPorId,
  actualizarConsulta,
} from "../services/consultaService";
import { InputElegante } from "../components/InputElegante";
import { SelectAlerta } from "../components/SelectAlerta";
import { Button } from "../components/Button";
import { Buscador } from "../components/Buscador";
import { Notificacion } from "../components/Notificacion";
import { TextAreaElegante } from "../components/TextAreaElegante";
import { EstudianteFoto } from "../components/EstudianteFoto";
import { AlertTriangle, CheckCircle, QrCode, Fingerprint, } from "lucide-react";


export const FormularioConsulta = ({ idEstudiante, idAlerta }) => {
  const navigate = useNavigate();
  const [docenteId] = useState(1);
  const [docente, setDocente] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descargos, setDescargos] = useState("");
  const [nivel, setAlerta] = useState("");
  const [presente, setPresente] = useState(false);
  const [metodoValidacion, setMetodoValidacion] = useState("NINGUNO");
  const [mensaje, setMensaje] = useState(null);
  const contenedorRef = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      if (idAlerta) {
        try {
          const res = await obtenerConsultaPorId(idAlerta);
          const consulta = res.data;

          if (
            !consulta.estado ||
            consulta.estado.toLowerCase() !== "pendiente"
          ) {
            setMensaje({
              texto: "No puedes editar esta alerta. Ya no está en estado pendiente.",
              color: "bg-yellow-500",
              icono: AlertTriangle,
            });

            setTimeout(() => {
              navigate("/consultas");
            }, 2500);
            return;
          }

          setMotivo(consulta.motivo || "");
          setDescargos(consulta.descargos || "");
          setAlerta(consulta.nivel?.toUpperCase() || "");
          setPresente(consulta.presenciaEstudiante || false);
          setMetodoValidacion(consulta.metodoValidacion || "NINGUNO");

          if (consulta.estudiante?.id) {
            const est = await obtenerEstudiantePorId(consulta.estudiante.id);
            setEstudiante(est.data);
          }

          if (consulta.docente?.id) {
            const doc = await obtenerDocentePorId(consulta.docente.id);
            setDocente(doc.data);
          }
        } catch (error) {
          console.error("Error al cargar la alerta:", error);
        }
      } else {
        if (idEstudiante) {
          obtenerEstudiantePorId(idEstudiante).then((res) =>
            setEstudiante(res.data)
          );
        }
        obtenerDocentePorId(docenteId).then((res) => setDocente(res.data));
      }
    };

    cargarDatos();
  }, [idEstudiante, idAlerta]);

  const manejarBusqueda = async () => {
    if (!busqueda.trim()) return;
    try {
      const res = await buscarEstudiante(busqueda.trim());
      if (res.data.length > 0) {
        setResultados(res.data);
        setEstudiante(null);
        setMensaje(null);
      } else {
        setMensaje({
          texto: "No se encontraron coincidencias.",
          color: "bg-yellow-500",
          icono: AlertTriangle,
        });
        setResultados([]);
      }
    } catch (error) {
      setMensaje({
        texto: "Error al buscar estudiante.",
        color: "bg-red-500",
        icono: AlertTriangle,
      });
    }
  };

  const manejarSeleccion = (est) => {
    setEstudiante(est);
    setResultados([]);
    setMensaje(null);
  };

  const manejarEnvio = async () => {
    if (!motivo.trim() || !nivel || !estudiante) {
      setMensaje({
        texto: "Debe llenar todos los campos y seleccionar un estudiante.",
        color: "bg-red-500",
        icono: AlertTriangle,
      });
      return;
    }

    const palabras = motivo.trim().split(/\s+/);
    if (palabras.length > 4) {
      setMensaje({
        texto: "El motivo no puede tener más de 4 palabras.",
        color: "bg-yellow-500",
        icono: AlertTriangle,
      });
      return;
    }

    const datosConsulta = {
      estudiante: { id: estudiante.id || estudiante.estu_id },
      docente: { id: docenteId },
      motivo,
      descargos,
      nivel: nivel.toLowerCase(),
      presenciaEstudiante: presente,
      metodoValidacion,
      estado: "pendiente",
    };

    console.log("JSON enviado al backend:", JSON.stringify(datosConsulta, null, 2));

    try {
      if (idAlerta) {
        // 🟡 EDITAR
        await actualizarConsulta(idAlerta, datosConsulta);
        setMensaje({
          texto: "Consulta actualizada correctamente.",
          color: "bg-green-600",
          icono: CheckCircle,
        });
      } else {
        // 🟢 CREAR
        await crearConsulta(datosConsulta);
        setMensaje({
          texto: "Consulta registrada con éxito.",
          color: "bg-green-600",
          icono: CheckCircle,
        });
      }

      // Limpiar formulario
      setMotivo("");
      setDescargos("");
      setAlerta("");
      setBusqueda("");
      setEstudiante(null);
      setPresente(false);
      setMetodoValidacion("NINGUNO");

      // Redirigir
      setTimeout(() => {
        navigate("/consultas");
      }, 1500);

    } catch (error) {
      setMensaje({
        texto: "Error al guardar la alerta.",
        color: "bg-red-500",
        icono: AlertTriangle,
      });
      console.error("Error al guardar consulta:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registro de Alerta</h2>

      {mensaje && (
        <Notificacion texto={mensaje.texto} color={mensaje.color} icono={mensaje.icono} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <EstudianteFoto estudiante={estudiante} />

          {!estudiante && (
            <div className="relative mt-4" ref={contenedorRef}>
              <label className="block text-sm text-gray-700 mb-1">Buscar estudiante</label>
              <div className="flex gap-2">
                <Buscador
                  valor={busqueda}
                  onChange={setBusqueda}
                  placeholder="Nombre, documento o ID"
                />
                <Button text="Buscar" color="bg-blue-500" onClick={manejarBusqueda} />
              </div>

              {resultados.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-scroll scrollbar-none">
                  <ul className="divide-y divide-gray-200">
                    {resultados.map((e) => (
                      <li
                        key={e.id}
                        onClick={() => manejarSeleccion(e)}
                        className="cursor-pointer hover:bg-gray-100 p-3"
                      >
                        <p className="text-sm font-medium">{e.nombres} {e.apellidos}</p>
                        {e.curso && (
                          <p className="text-xs text-gray-500">Curso: {e.curso}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button text="Escanear QR" color="bg-indigo-600" icon={QrCode} onClick={() => { }} />
            <Button text="Leer huella" color="bg-purple-600" icon={Fingerprint} onClick={() => { }} />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Presencia del estudiante:</p>
            <span className={`inline-block px-3 py-1 rounded text-white text-sm mt-1 ${presente ? "bg-green-500" : "bg-red-500"}`}>
              {presente ? "Verificado" : "No verificado"}
            </span>
          </div>
        </div>

        <div>
          <InputElegante
            label="Motivo (máximo 4 palabras)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={50}
            placeholder="Escriba el motivo"
          />

          <TextAreaElegante
            label="Descargos (detalle)"
            value={descargos}
            onChange={(e) => setDescargos(e.target.value)}
            placeholder="Detalles de la situación"
          />

          <SelectAlerta valor={nivel} onChange={(e) => setAlerta(e.target.value)} />

          <Button
            text="Guardar Consulta"
            color="bg-pink-500"
            onClick={manejarEnvio}
          />
        </div>
      </div>
    </div>
  );
};

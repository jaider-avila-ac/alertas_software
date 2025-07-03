import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    obtenerImagenEstudiante,
    subirImagenEstudiante,
} from "../services/estudianteService";
import { Layout } from "../layout/Layout";
import { Button } from "../components/Button";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";
import MarcoBorde from "../assets/fotos_estudiante/marco_borde.png";
import { Notificacion } from "../components/Notificacion";
import { AlertCircle } from "lucide-react";
import {
    obtenerFamiliaresPorEstudiante,
    crearFamiliar,
    actualizarFamiliar,
    eliminarFamiliar,
} from "../services/familiarService";

const tiposDoc = ["TI", "CC"];
const generos = ["Masculino", "Femenino", "Otro"];
const estratos = ["1", "2", "3", "4", "5", "6"];
const estadosCiviles = ["Casado", "Soltero", "Unión libre"];
const tiposRh = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];



export const PageFormularioEstudiante = () => {
    const { id } = useParams();
    const editar = !!id;
    const navigate = useNavigate();
    const inputRef = useRef();

    const [formulario, setFormulario] = useState({
        tipoDoc: "",
        nroDoc: "",
        nombres: "",
        apellidos: "",
        genero: "",
        fechaNac: "",
        direccion: "",
        barrio: "",
        estrato: "",
        sisben: "",
        eps: "",
        rh: "",
        acudiente: "",
        tel: "",
        sms: "",
        correo: "",
        curso: "",
        estadoCivil: "",
        tiempo: "",
        nroHnos: "",
        tipoVivienda: "",
    });
const [mensajeFamiliar, setMensajeFamiliar] = useState(null);
    const [imagen, setImagen] = useState(FotoPorDefecto);
    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
        if (editar) {
            obtenerEstudiantePorId(id).then((res) => {
                setFormulario(res.data);
                cargarImagen(id);
                cargarFamiliares();
            });
        }
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [id]);

    const cargarImagen = async (id) => {
        try {
            const res = await obtenerImagenEstudiante(id);
            if (res?.data && res.data.size > 0) {
                if (blobUrl) URL.revokeObjectURL(blobUrl);
                const nuevaUrl = URL.createObjectURL(res.data);
                setBlobUrl(nuevaUrl);
                setImagen(nuevaUrl);
            }
        } catch {
            setImagen(FotoPorDefecto);
        }
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    const manejarCambioImagen = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        if (!editar) return alert("Primero guarda el estudiante para subir imagen");
        await subirImagenEstudiante(id, archivo);
        cargarImagen(id);
    };

    const manejarGuardar = async () => {
        try {
            if (editar) {
                console.log("Enviando a actualizar:", formulario);
                await actualizarEstudiante(id, formulario);
            } else {
                console.log("Enviando a crear:", formulario);
                await crearEstudiante(formulario);
            }
            navigate("/estudiantes");
        } catch (err) {
            alert("Error al guardar");
            console.error(err);
        }
    };

    const [familiares, setFamiliares] = useState([]);
    const [familiarEditando, setFamiliarEditando] = useState(null);
    const [nuevoFamiliar, setNuevoFamiliar] = useState({
        nombres: "",
        apellidos: "",
        parentesco: "",
        fechaNacimiento: "",
        escolaridad: "",
        telefono: "",
        horario: "",
    });

    const cargarFamiliares = async () => {
        if (!id) return;
        const res = await obtenerFamiliaresPorEstudiante(id);
        setFamiliares(res.data);
    };

    const manejarCambioFamiliar = (e) => {
        const { name, value } = e.target;
        setNuevoFamiliar((prev) => ({ ...prev, [name]: value }));
    };

    const guardarFamiliar = async () => {
        if (!id) {
            setMensajeFamiliar("Primero debes guardar el estudiante antes de agregar familiares.");
            return;
        }

        const datos = {
            ...nuevoFamiliar,
            estudiante: { id: parseInt(id) }
        };

        try {
            if (familiarEditando) {
                await actualizarFamiliar(familiarEditando, datos);
            } else {
                await crearFamiliar(datos);
            }

            setNuevoFamiliar({
                nombres: "",
                apellidos: "",
                parentesco: "",
                fechaNacimiento: "",
                escolaridad: "",
                telefono: "",
                horario: "",
            });
            setFamiliarEditando(null);
            cargarFamiliares();
        } catch (error) {
            console.error("Error al guardar familiar:", error);
            setMensajeFamiliar("Error al guardar familiar");
        }
    };


    const editarFamiliar = (f) => {
        setNuevoFamiliar(f);
        setFamiliarEditando(f.id);
    };

    const borrarFamiliar = async (fid) => {
        await eliminarFamiliar(fid);
        cargarFamiliares();
    };

   const campos = Object.entries(formulario).filter(
  ([campo]) =>
    !["imagen", "huellaHash", "usuario", "id"].includes(campo)
);


    const renderInput = (campo, valor) => {
        const comboBox = (opciones) => (
            <select
                name={campo}
                value={opciones.includes(valor) ? valor : ""}
                onChange={manejarCambio}
                className="border px-3 py-2 rounded"
            >
                <option value="">-- Seleccionar --</option>
                {opciones.map((op) => (
                    <option key={op} value={op}>{op}</option>
                ))}
            </select>
        );

        switch (campo) {
            case "tipoDoc": return comboBox(tiposDoc);
            case "genero": return comboBox(generos);
            case "estrato": return comboBox(estratos);
            case "estadoCivil": return comboBox(estadosCiviles);
            case "rh": return comboBox(tiposRh);
            case "fechaNac":
                return <input type="date" name={campo} value={valor || ""} onChange={manejarCambio} className="border px-3 py-2 rounded" />;
            case "correo":
                return <input type="email" name={campo} value={valor || ""} onChange={manejarCambio} className="border px-3 py-2 rounded" />;
            default:
                return <input type="text" name={campo} value={valor || ""} onChange={manejarCambio} className="border px-3 py-2 rounded" />;
        }
    };

    return (
        <main>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">{editar ? "Editar Estudiante" : "Nuevo Estudiante"}</h1>

                <div className="flex gap-6 flex-col md:flex-row">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-[160px] aspect-[3/4]">
                            <img src={MarcoBorde} alt="Marco" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
                            <img src={imagen} alt="Foto estudiante" className="absolute inset-0 w-full h-full object-cover z-0" />
                        </div>

                        {editar && (
                            <>
                                <Button text="Cambiar Foto" color="bg-blue-600" onClick={() => inputRef.current.click()} />
                                <input type="file" accept="image/*" ref={inputRef} onChange={manejarCambioImagen} className="hidden" />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {campos.map(([campo, valor]) => (
                            <div key={campo} className="flex flex-col">
                                <label className="text-sm text-gray-600 font-medium mb-1">{campo}</label>
                                {renderInput(campo, valor)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Familiares</h2>
                    {mensajeFamiliar && (
                        <Notificacion
                            texto={mensajeFamiliar}
                            color="bg-red-600"
                            icono={AlertCircle}
                        />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {Object.entries(nuevoFamiliar).map(([campo, valor]) => (
                            <input
                                key={campo}
                                type={campo === "fechaNacimiento" ? "date" : "text"}
                                name={campo}
                                placeholder={campo}
                                value={valor}
                                onChange={manejarCambioFamiliar}
                                className="border px-3 py-2 rounded"
                            />
                        ))}
                    </div>

                    <div className="flex gap-2 mb-6">
                        <Button
                            text={familiarEditando ? "Actualizar Familiar" : "Agregar Familiar"}
                            color="bg-blue-600"
                            onClick={guardarFamiliar}
                        />
                        {familiarEditando && (
                            <Button
                                text="Cancelar"
                                color="bg-gray-600"
                                onClick={() => {
                                    setNuevoFamiliar({
                                        nombres: "",
                                        apellidos: "",
                                        parentesco: "",
                                        fechaNacimiento: "",
                                        escolaridad: "",
                                        telefono: "",
                                        horario: "",
                                    });
                                    setFamiliarEditando(null);
                                }}
                            />
                        )}
                    </div>

                    <ul className="space-y-2">
                        {familiares.map((f) => (
                            <li key={f.id} className="border px-4 py-2 rounded flex justify-between items-center">
                                <span>{`${f.nombres} ${f.apellidos} (${f.parentesco})`}</span>
                                <div className="flex gap-2">
                                    <Button text="Editar" color="bg-yellow-500" onClick={() => editarFamiliar(f)} />
                                    <Button text="Eliminar" color="bg-red-600" onClick={() => borrarFamiliar(f.id)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-4">
                    <Button text="Guardar" color="bg-green-600" onClick={manejarGuardar} />
                    <Button text="Cancelar" color="bg-gray-600" onClick={() => navigate("/estudiantes")} />
                </div>
            </div>
        </main>
    );
};

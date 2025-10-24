import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    obtenerImagenEstudiante,
    subirImagenEstudiante,
} from "../services/estudianteService";
import { Button } from "../components/Button";
import FotoPorDefecto from "../assets/fotos_estudiante/CARD_PERFIL.jpg";
import MarcoBorde from "../assets/fotos_estudiante/marco_borde.png";
import { Notificacion } from "../components/Notificacion";
import { AlertCircle, ArrowLeft, Camera, Save, X, Edit, Trash2, UserPlus } from "lucide-react";
import {
    obtenerFamiliaresPorEstudiante,
    crearFamiliar,
    actualizarFamiliar,
    eliminarFamiliar,
} from "../services/familiarService";

const tiposDoc = ["TI", "CC"];
const generos = ["Masculino", "Femenino", "Otro"];
const estratos = ["1", "2", "3", "4", "5", "6"];
const estadosCiviles = ["Casado", "Soltero", "Union libre"];
const tiposRh = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const parentescos = ["Padre", "Madre", "Hermano", "Hermana", "Abuelo", "Abuela", "Tio", "Tia", "Primo", "Prima", "Tutor", "Otro"];
const escolaridades = ["Primaria", "Secundaria", "Tecnico", "Tecnologo", "Universitario", "Postgrado", "Ninguno"];

const etiquetas = {
    tipoDoc: "Tipo de Documento",
    nroDoc: "Numero de Documento",
    nombres: "Nombres",
    apellidos: "Apellidos",
    genero: "Genero",
    fechaNac: "Fecha de Nacimiento",
    direccion: "Direccion",
    barrio: "Barrio",
    estrato: "Estrato",
    sisben: "SISBEN",
    eps: "EPS",
    rh: "RH",
    tel: "Telefono",
    sms: "SMS",
    correo: "Correo Electronico",
    curso: "Curso",
    estadoCivil: "Estado Civil",
    tiempo: "Tiempo",
    nroHnos: "Numero de Hermanos",
    tipoVivienda: "Tipo de Vivienda",
};

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

    const [guardandoEstudiante, setGuardandoEstudiante] = useState(false);
    const [guardandoFamiliar, setGuardandoFamiliar] = useState(false);
    const [eliminandoFamiliar, setEliminandoFamiliar] = useState(null);

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
        if (guardandoEstudiante) return;

        try {
            setGuardandoEstudiante(true);
            if (editar) {
                await actualizarEstudiante(id, formulario);
                navigate("/estudiantes");
            } else {
                const res = await crearEstudiante(formulario);
                navigate(`/formulario-estudiante/${res.data.id}`);
            }
        } catch (err) {
            alert("Error al guardar: " + err.message);
            console.error(err);
        } finally {
            setGuardandoEstudiante(false);
        }
    };

    const cargarFamiliares = async () => {
        if (!id) return;
        try {
            const res = await obtenerFamiliaresPorEstudiante(id);
            setFamiliares(res.data || []);
        } catch (error) {
            console.error("Error al cargar familiares:", error);
            setFamiliares([]);
        }
    };

    const manejarCambioFamiliar = (e) => {
        const { name, value } = e.target;
        setNuevoFamiliar((prev) => ({ ...prev, [name]: value }));
    };

    const guardarFamiliar = async () => {
        if (!id) {
            setMensajeFamiliar("Primero debes guardar el estudiante antes de agregar familiares");
            setTimeout(() => setMensajeFamiliar(null), 3000);
            return;
        }

        if (guardandoFamiliar) return;

        if (!nuevoFamiliar.nombres || !nuevoFamiliar.apellidos || !nuevoFamiliar.parentesco) {
            setMensajeFamiliar("Los campos Nombres, Apellidos y Parentesco son obligatorios");
            setTimeout(() => setMensajeFamiliar(null), 3000);
            return;
        }

        const datos = {
            ...nuevoFamiliar,
            estudiante: { id: parseInt(id) }
        };

        try {
            setGuardandoFamiliar(true);
            
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
            await cargarFamiliares();
        } catch (error) {
            console.error("Error al guardar familiar:", error);
            setMensajeFamiliar("Error al guardar familiar: " + error.message);
            setTimeout(() => setMensajeFamiliar(null), 3000);
        } finally {
            setGuardandoFamiliar(false);
        }
    };

    const editarFamiliar = (f) => {
        setNuevoFamiliar({
            nombres: f.nombres,
            apellidos: f.apellidos,
            parentesco: f.parentesco,
            fechaNacimiento: f.fechaNacimiento,
            escolaridad: f.escolaridad,
            telefono: f.telefono,
            horario: f.horario,
        });
        setFamiliarEditando(f.id);
    };

    const cancelarEdicion = () => {
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
    };

    const borrarFamiliar = async (fid) => {
        if (eliminandoFamiliar === fid) return;
        
        if (!window.confirm("Estas seguro de eliminar este familiar?")) return;

        try {
            setEliminandoFamiliar(fid);
            await eliminarFamiliar(fid);
            await cargarFamiliares();
        } catch (error) {
            console.error("Error al eliminar familiar:", error);
            alert("Error al eliminar familiar");
        } finally {
            setEliminandoFamiliar(null);
        }
    };

    const campos = Object.entries(formulario).filter(
        ([campo]) => !["imagen", "huellaHash", "usuario", "id", "acudiente"].includes(campo)
    );

    const renderInput = (campo, valor) => {
        const comboBox = (opciones) => (
            <select
                name={campo}
                value={opciones.includes(valor) ? valor : ""}
                onChange={manejarCambio}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                return <input type="date" name={campo} value={valor || ""} onChange={manejarCambio} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />;
            case "correo":
                return <input type="email" name={campo} value={valor || ""} onChange={manejarCambio} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />;
            default:
                return <input type="text" name={campo} value={valor || ""} onChange={manejarCambio} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {editar ? "Editar Estudiante" : "Nuevo Estudiante"}
                    </h1>
                    <Button
                        text="Volver"
                        icon={ArrowLeft}
                        color="bg-gray-500"
                        onClick={() => navigate("/estudiantes")}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Informacion Personal
                    </h2>
                    
                    <div className="flex gap-8 flex-col lg:flex-row">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-[180px] aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
                                <img 
                                    src={MarcoBorde} 
                                    alt="Marco" 
                                    className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" 
                                />
                                <img 
                                    src={imagen} 
                                    alt="Foto estudiante" 
                                    className="absolute inset-0 w-full h-full object-cover z-0" 
                                />
                            </div>

                            {editar && (
                                <>
                                    <Button 
                                        text="Cambiar Foto" 
                                        icon={Camera}
                                        color="bg-blue-600" 
                                        onClick={() => inputRef.current.click()} 
                                    />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={inputRef} 
                                        onChange={manejarCambioImagen} 
                                        className="hidden" 
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campos.map(([campo, valor]) => (
                                <div key={campo} className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5">
                                        {etiquetas[campo] || campo}
                                    </label>
                                    {renderInput(campo, valor)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Familiares
                        </h2>
                        {!editar && (
                            <span className="text-sm text-orange-600 italic">
                                Guarda el estudiante primero para agregar familiares
                            </span>
                        )}
                    </div>

                    {mensajeFamiliar && (
                        <div className="mb-4">
                            <Notificacion
                                texto={mensajeFamiliar}
                                color={mensajeFamiliar.includes("correctamente") ? "bg-green-500" : "bg-orange-500"}
                                icono={AlertCircle}
                                onClose={() => setMensajeFamiliar(null)}
                            />
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h3 className="text-md font-semibold text-gray-700 mb-3">
                            {familiarEditando ? "Editar Familiar" : "Agregar Nuevo Familiar"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text"
                                name="nombres"
                                placeholder="Nombres *"
                                value={nuevoFamiliar.nombres}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <input
                                type="text"
                                name="apellidos"
                                placeholder="Apellidos *"
                                value={nuevoFamiliar.apellidos}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <select
                                name="parentesco"
                                value={nuevoFamiliar.parentesco}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Parentesco *</option>
                                {parentescos.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={nuevoFamiliar.fechaNacimiento}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <select
                                name="escolaridad"
                                value={nuevoFamiliar.escolaridad}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Escolaridad</option>
                                {escolaridades.map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="telefono"
                                placeholder="Telefono"
                                value={nuevoFamiliar.telefono}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <input
                                type="text"
                                name="horario"
                                placeholder="Horario"
                                value={nuevoFamiliar.horario}
                                onChange={manejarCambioFamiliar}
                                disabled={guardandoFamiliar}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button
                                text={guardandoFamiliar ? "Guardando..." : (familiarEditando ? "Actualizar Familiar" : "Agregar Familiar")}
                                icon={familiarEditando ? Edit : UserPlus}
                                color="bg-blue-600"
                                onClick={guardarFamiliar}
                                disabled={guardandoFamiliar}
                            />
                            {familiarEditando && (
                                <Button
                                    text="Cancelar"
                                    icon={X}
                                    color="bg-gray-500"
                                    onClick={cancelarEdicion}
                                    disabled={guardandoFamiliar}
                                />
                            )}
                        </div>
                    </div>

                    {familiares.length > 0 ? (
                        <div className="space-y-2">
                            {familiares.map((f) => (
                                <div 
                                    key={f.id} 
                                    className="border border-gray-200 bg-white rounded-lg px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {f.nombres} {f.apellidos}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {f.parentesco} - {f.telefono || "Sin telefono"} - {f.escolaridad || "Sin escolaridad"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            icon={Edit}
                                            title="Editar"
                                            color="bg-yellow-500" 
                                            onClick={() => editarFamiliar(f)}
                                            disabled={familiarEditando !== null && familiarEditando !== f.id}
                                        />
                                        <Button 
                                            icon={Trash2}
                                            title="Eliminar"
                                            color="bg-red-600" 
                                            onClick={() => borrarFamiliar(f.id)}
                                            disabled={eliminandoFamiliar === f.id || familiarEditando !== null}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 italic py-8">
                            No hay familiares registrados
                        </p>
                    )}
                </div>

                <div className="flex gap-4 pb-6">
                    <Button 
                        text={guardandoEstudiante ? "Guardando..." : "Guardar Estudiante"}
                        icon={Save}
                        color="bg-green-600" 
                        onClick={manejarGuardar}
                        disabled={guardandoEstudiante}
                    />
                    <Button 
                        text="Cancelar" 
                        icon={X}
                        color="bg-gray-500" 
                        onClick={() => navigate("/estudiantes")}
                        disabled={guardandoEstudiante}
                    />
                </div>
            </div>
        </main>
    );
};
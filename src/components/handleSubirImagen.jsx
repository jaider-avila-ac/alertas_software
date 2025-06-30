// Dentro del componente PerfilPage (sustituye la sección de imagen)

import { ModalBase } from "../components/ModalBase"; // Asegúrate de tener esta ruta correcta
import { subirImagenEstudiante } from "../services/estudianteService";

...

const [modalVisible, setModalVisible] = useState(false);
const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
const [cargando, setCargando] = useState(false);

const handleSeleccionarImagen = (e) => {
  const file = e.target.files[0];
  if (file) setArchivoSeleccionado(file);
};

const handleSubirImagen = async () => {
  if (!archivoSeleccionado || !datosEstudiante.id) return;
  setCargando(true);
  try {
    await subirImagenEstudiante(datosEstudiante.id, archivoSeleccionado);
    const res = await obtenerImagenEstudiante(datosEstudiante.id);
    if (res?.data) {
      const url = URL.createObjectURL(res.data);
      setImagenUrl(url);
    }
    setModalVisible(false);
  } catch (error) {
    alert("Error al subir la imagen");
  } finally {
    setCargando(false);
  }
};


  <div>

    <ModalBase visible={modalVisible} onClose={() => setModalVisible(false)}>
      <h2 className="text-lg font-bold mb-4">Actualizar Foto de Perfil</h2>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={handleSeleccionarImagen}
        className="mb-4"
      />
      <div className="flex justify-end gap-2">
        <Button
          text="Cancelar"
          color="bg-gray-400"
          onClick={() => setModalVisible(false)}
        />
        <Button
          text={cargando ? "Subiendo..." : "Subir Imagen"}
          color="bg-blue-600"
          onClick={handleSubirImagen}
          disabled={!archivoSeleccionado || cargando}
        />
      </div>
    </ModalBase>
  </div>
)}

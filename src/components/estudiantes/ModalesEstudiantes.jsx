import { ModalBase } from "../ModalBase";
import { Button } from "../Button";
import {
  generarUsuarioEstudiante,
  generarUsuariosEstudiantesMasivo,
} from "../../services/usuarioService";

export const ModalesEstudiantes = ({
  modalMasivo,
  setModalMasivo,
  modalIndividual,
  setModalIndividual,
  recargar,
  setNoti,
}) => {
  const cerrarIndividual = () =>
    setModalIndividual({ visible: false, cedula: "" });

  return (
    <>

      <ModalBase visible={modalMasivo} onClose={() => setModalMasivo(false)}>
        <h3 className="text-xl font-semibold mb-4">
          ¿Generar usuarios para todos los estudiantes sin usuario?
        </h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            text="Cancelar"
            color="bg-gray-500"
            onClick={() => setModalMasivo(false)}
          />
          <Button
            text="Generar"
            color="bg-green-600"
            onClick={async () => {
              try {
                await generarUsuariosEstudiantesMasivo();
                setModalMasivo(false);
                recargar();
                setNoti({
                  visible: true,
                  texto: "Usuarios generados correctamente",
                  color: "green",
                });
              } catch (err) {
                setNoti({
                  visible: true,
                  texto: "Error al generar usuarios",
                  color: "red",
                });
                console.error(err);
              }
            }}
          />
        </div>
      </ModalBase>

 
      <ModalBase visible={modalIndividual.visible} onClose={cerrarIndividual}>
        <h3 className="text-xl font-semibold mb-4">
          ¿Generar usuario para cédula {modalIndividual.cedula}?
        </h3>
        <div className="flex justify-end gap-2 mt-4">
          <Button text="Cancelar" color="bg-gray-500" onClick={cerrarIndividual} />
          <Button
            text="Confirmar"
            color="bg-green-600"
            onClick={async () => {
              try {
                await generarUsuarioEstudiante(modalIndividual.cedula);
                cerrarIndividual();
                recargar();
                setNoti({
                  visible: true,
                  texto: "Usuario generado correctamente",
                  color: "green",
                });
              } catch (err) {
                setNoti({
                  visible: true,
                  texto: "Error al generar usuario",
                  color: "red",
                });
                console.error(err);
              }
            }}
          />
        </div>
      </ModalBase>
    </>
  );
};

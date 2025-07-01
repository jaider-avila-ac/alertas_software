import { DatoCampo } from "../DatoCampo";

export const PerfilAdministrador = ({ datos }) => {
  if (!datos) return null;

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <DatoCampo label="Rol del Usuario" value="Administrador" />
      <DatoCampo label="Nombres" value={datos.nombres} />
      <DatoCampo label="Cédula" value={datos.cedula || datos.nroDoc || "Sin número"} />
      <DatoCampo label="Correo" value={datos.correo || "Sin correo"} />
    </div>
  );
};

import { DatoCampo } from "../DatoCampo";

export const PerfilPsicorientador = ({ datos }) => {
  if (!datos) return null;

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <DatoCampo label="Rol del Usuario" value="Psicorientador" />
      <DatoCampo label="Nombres" value={datos.nombres} />
      <DatoCampo label="Apellidos" value={datos.apellidos} />
      <DatoCampo label="Cédula" value={datos.nroDoc || "Sin número"} />
      <DatoCampo label="Correo" value={datos.correo || "Sin correo"} />
    </div>
  );
};

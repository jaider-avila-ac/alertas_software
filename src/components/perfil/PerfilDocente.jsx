import { DatoCampo } from "../DatoCampo";

export const PerfilDocente = ({ datos }) => {
  if (!datos) return null;

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      <DatoCampo label="Rol del Usuario" value="Docente" />
      <DatoCampo label="Nombres" value={datos.nombres} />
      <DatoCampo label="Cédula" value={datos.nroDoc} />
      <DatoCampo label="Correo" value={datos.correo || "Sin correo"} />
    </div>
  );
};

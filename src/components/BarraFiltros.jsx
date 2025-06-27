import { Buscador } from "./Buscador";
import { ComboBox } from "./ComboBox";


export const BarraFiltros = ({
  valorBusqueda,
  onBuscar,
  mostrarFiltroEstado = false,
  onFiltrarEstado,
  estadoActual,
  placeholder = "Buscar...",
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Buscador
          valor={valorBusqueda}
          onChange={onBuscar}
          placeholder={placeholder}
        />

        {mostrarFiltroEstado && (
          <ComboBox
            opciones={["todos", "pendiente", "en_cita", "en_progreso", "completado"]}
            valor={estadoActual}
            onChange={onFiltrarEstado}
         
          />
        )}
      </div>
    </div>
  );
};

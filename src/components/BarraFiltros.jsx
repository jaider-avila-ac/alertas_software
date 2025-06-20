import { Buscador } from "./Buscador";
import { FiltroEstado } from "./FiltroEstado";

export const BarraFiltros = ({
  valorBusqueda,
  onBuscar,
  mostrarFiltroEstado = false,
  estados = [],
  totales = {},
  onFiltrarEstado,
  placeholder = "Buscar...",
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Izquierda: buscador + filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        <Buscador valor={valorBusqueda} onChange={onBuscar} placeholder={placeholder} />

        {mostrarFiltroEstado && (
          <FiltroEstado
            estados={estados}
            totales={totales}
            onFiltrar={onFiltrarEstado}
          />
        )}
      </div>
    </div>
  );
};

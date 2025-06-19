import { Buscador } from "./Buscador";
import { Button } from "./Button";
import { FiltroEstado } from "./FiltroEstado";
import { Plus } from "lucide-react";

export const BarraFiltros = ({
  valorBusqueda,
  onBuscar,
  onAgregar,
  mostrarFiltroEstado = false,
  estados = [],
  totales = {},
  onFiltrarEstado,
  placeholder = "Buscar...",
  textoBoton = "Agregar",
  colorBoton = "bg-pink-500",
  iconoBoton = Plus,
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

      {/* Derecha: botón agregar */}
      <div>
          <Button text="Crear alerta" color="bg-blue-600" icon={Plus} onClick={() => {}} />
        
      </div>
    </div>
  );
};

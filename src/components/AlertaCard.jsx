export const AlertaCard = ({ alerta }) => {
  const { id, nombre, motivo, fecha, estado, nivel, icono, color } = alerta;

  return (
    <div className="flex bg-white mb-3 items-center p-2 rounded shadow gap-3 max-w-full cursor-pointer">
      {/* Cuadro con ícono y color por nivel */}
      <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 rounded ${color}`}>
        <img src={icono} alt="icono alerta" className="w-6 h-6 object-contain" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* ID y nombre */}
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-blue-600 w-24 h-6 flex items-center justify-center rounded text-white font-semibold text-sm">
            <p className="m-0">{id}</p>
          </div>
          <p className="font-semibold text-sm truncate">{nombre}</p>
        </div>

        {/* Detalles */}
        <div className="flex gap-3 flex-wrap text-xs">
          <p className="whitespace-nowrap">📌 {motivo}</p>
          <p className="whitespace-nowrap">📅 {fecha}</p>

          {/* Nivel con color + ícono */}
          <div className={`px-2 py-0.5 rounded text-white font-semibold ${color}`}>
            <div className="flex items-center gap-1">
              <img src={icono} alt={nivel} className="w-3 h-3" />
              <p className="m-0 capitalize">{nivel}</p>
            </div>
          </div>

          {/* Estado */}
          <div className="px-2 py-0.5 rounded text-white font-semibold bg-gray-500">
            <p className="m-0 capitalize">{estado}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

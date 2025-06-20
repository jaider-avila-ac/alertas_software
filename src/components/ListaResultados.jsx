export const ListaResultados = ({ resultados, onSeleccionar }) => {
  return (
    <div className="absolute z-50 w-full mt-2 bg-white border rounded shadow max-h-60 overflow-y-scroll scrollbar-none">
      <ul className="divide-y divide-gray-200">
        {resultados.map((e) => (
          <li
            key={e.id}
            onClick={() => onSeleccionar(e)}
            className="cursor-pointer hover:bg-gray-100 p-3"
          >
            <p className="text-sm font-medium">{e.nombres} {e.apellidos}</p>
            {e.curso && <p className="text-xs text-gray-500">Curso: {e.curso}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

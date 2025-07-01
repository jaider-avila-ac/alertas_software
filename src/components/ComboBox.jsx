export const ComboBox = ({ opciones = [], valor, onChange, label }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      >
        <option value="">Seleccione una opción</option>
        {opciones.map((op) => (
          <option key={op} value={op}>
            {op.charAt(0).toUpperCase() + op.slice(1).replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

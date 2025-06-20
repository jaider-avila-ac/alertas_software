export const SelectAlerta = ({ valor, onChange }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm text-gray-700 mb-1">Nivel de Alerta</label>
    <select
      value={valor}
      onChange={onChange}
      className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
    >
      <option value="">Seleccionar...</option>
      <option value="LEVE">Leve</option>
      <option value="MODERADO">Moderado</option>
      <option value="ALTO">Alto</option>
      <option value="CRITICO">Crítico</option>
    </select>
  </div>
);
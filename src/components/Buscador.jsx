export const Buscador = ({ valor, onChange, placeholder = "Buscar..." }) => {
  return (
    <input
      type="text"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 px-4 py-2 rounded-md w-100"
    />
  );
};
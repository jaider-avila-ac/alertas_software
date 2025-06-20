export const TextAreaElegante = ({ label, value, onChange, placeholder = "" }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 resize-none px-2 py-1 bg-transparent"
      />
    </div>
  );
};

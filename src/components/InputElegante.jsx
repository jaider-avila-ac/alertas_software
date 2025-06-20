export const InputElegante = ({ label, value, onChange, maxLength, placeholder }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
      className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
    />
  </div>
);


export const DatoCampo = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      readOnly
      disabled
      className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-800 text-sm"
    />
  </div>
);

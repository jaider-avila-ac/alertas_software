export const Table = ({ columns, data, showActions = false, onEdit, onDelete }) => {
  return (
    <div className="max-h-[460px] overflow-y-auto border rounded shadow-md">
  <table className="w-full text-sm text-left border-collapse">
    <thead>
      <tr className="bg-pink-500 text-white sticky top-0 z-10">
        {columns.map((col, i) => (
          <th key={i} className="px-4 py-2 font-semibold tracking-wide">{col}</th>
        ))}
        {showActions && (
          <th className="px-4 py-2 font-semibold tracking-wide">Acciones</th>
        )}
      </tr>
    </thead>
    <tbody>
      {data.map((row, ri) => (
        <tr
          key={ri}
          className={`${ri % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition`}
        >
          {columns.map((col, ci) => (
            <td key={ci} className="px-4 py-2 border-b">{row[col]}</td>
          ))}
          {showActions && (
            <td className="px-4 py-2 border-b flex gap-2">
              <button onClick={() => onEdit(row)} className="text-indigo-600 hover:text-indigo-800">✏️</button>
              <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

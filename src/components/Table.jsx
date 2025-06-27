import { useEffect, useState } from "react";

export const Table = ({ columns, data, showActions = false, onEdit, onDelete }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border rounded shadow-md">
            <div
              className="p-4 cursor-pointer"
              onClick={() => {
                const elem = document.getElementById(`detalles-${index}`);
                if (elem) elem.classList.toggle("hidden");
              }}
            >
              <p className="font-semibold text-blue-700">{row[columns[1]]}</p>
            </div>

            <div id={`detalles-${index}`} className="mt-2 hidden px-4 pb-4">
              <ul className="space-y-1 text-sm">
                {columns.slice(1).map((col, i) => (
                  <li key={i}>
                    <strong>{col}:</strong>{" "}
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block"
                    >
                      {row[col]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-h-[460px] overflow-y-auto border rounded shadow-md">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white sticky top-0 z-10">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

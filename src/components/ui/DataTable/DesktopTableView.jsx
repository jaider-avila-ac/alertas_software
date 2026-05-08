import { SortIcon } from "./SortIcon";

export const DesktopTableView = ({ data, columns, actions, sort, onToggleSort }) => {
  if (data.length === 0) return null;

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-pink-500 text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && onToggleSort(col.key)}
                className={`px-4 py-3 font-semibold whitespace-nowrap select-none ${
                  col.sortable !== false ? "cursor-pointer hover:bg-pink-600 transition-colors" : ""
                }`}
                style={{ textAlign: col.align || "left" }}
              >
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    justifyContent:
                      col.align === "right" ? "flex-end"
                      : col.align === "center" ? "center"
                      : "flex-start",
                  }}
                >
                  {col.label}
                  {col.sortable !== false && <SortIcon sort={sort} colKey={col.key} />}
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 font-semibold whitespace-nowrap text-left">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-t border-gray-100 hover:bg-pink-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-gray-700 whitespace-nowrap"
                  style={{ textAlign: col.align || "left" }}
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

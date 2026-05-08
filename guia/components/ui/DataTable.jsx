import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";
import { DesktopTableView } from "./DataTable/DesktopTableView";
import { MobileCardView }   from "./DataTable/MobileCardView";

const PAGE_SIZE = 50;

export default function DataTable({
  columns    = [],
  rows       = [],
  actions,
  empty      = "Sin registros.",
  loading    = false,
  defaultSort,
  searchKeys = [],
  pageSize   = PAGE_SIZE,
}) {
  const [query,    setQuery]    = useState("");
  const [sort,     setSort]     = useState(defaultSort ?? null);
  const [page,     setPage]     = useState(1);
  const [openRows, setOpenRows] = useState({});

  const filtered = useMemo(() => {
    if (!query.trim() || !searchKeys.length) return rows;
    const q = query.toLowerCase();
    return rows.filter(row =>
      searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const va = String(a[sort.key] ?? "").toLowerCase();
      const vb = String(b[sort.key] ?? "").toLowerCase();
      return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    setPage(1);
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc")        return { key, dir: "desc" };
      return null;
    });
  };

  const handleSearch = (v) => { setQuery(v); setPage(1); };
  const toggleRow    = (id) => setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex flex-col h-full">

      {searchKeys.length > 0 && (
        <div className="mb-3 shrink-0">
          <SearchBar value={query} onChange={handleSearch} placeholder="Buscar..." />
        </div>
      )}

      <div className="flex-1 min-h-0">
        {loading ? (
          <>
            {/* Skeleton desktop */}
            <div className="hidden md:block h-full overflow-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-cyan-500">
                    {columns.map(col => (
                      <th key={col.key} className="px-4 py-3">
                        <div className="h-4 w-20 rounded animate-pulse bg-cyan-400" />
                      </th>
                    ))}
                    {actions && <th className="px-4 py-3"><div className="h-4 w-16 rounded animate-pulse bg-cyan-400" /></th>}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {columns.map(col => (
                        <td key={col.key} className="px-4 py-3">
                          <div className="h-4 rounded animate-pulse bg-gray-200" style={{ width: `${50 + (col.key.length * 9) % 40}%` }} />
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <div className="h-6 w-8 rounded-lg animate-pulse bg-gray-200" />
                            <div className="h-6 w-8 rounded-lg animate-pulse bg-gray-200" />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Skeleton mobile */}
            <div className="md:hidden space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 h-14 animate-pulse" />
              ))}
            </div>
          </>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            {query ? "No se encontraron resultados." : empty}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:flex flex-col h-full">
              <DesktopTableView
                data={paginated}
                columns={columns}
                actions={actions}
                sort={sort}
                onToggleSort={toggleSort}
              />
            </div>
            {/* Mobile */}
            <div className="md:hidden overflow-auto h-full pb-2">
              <MobileCardView
                data={paginated}
                columns={columns}
                actions={actions}
                openRows={openRows}
                onToggleRow={toggleRow}
              />
            </div>
          </>
        )}
      </div>

      {/* Paginación */}
      <div className="shrink-0 mt-3 flex items-center justify-between px-1 text-sm text-gray-500 h-8">
        <span className="text-xs">
          {loading ? "Cargando..." : (
            sorted.length === 0
              ? "0 registros"
              : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, sorted.length)} de ${sorted.length}`
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1 || loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={`e${idx}`} className="px-1 text-gray-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                disabled={loading}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  p === safePage
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages || loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

    </div>
  );
}

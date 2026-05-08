import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DesktopTableView } from "./DataTable/DesktopTableView";
import { MobileCardView } from "./DataTable/MobileCardView";

const MOBILE_BREAKPOINT = 768;
const DEFAULT_PAGE_SIZE = 15;

const normalize = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function DataTable({
  columns    = [],
  rows       = [],
  actions,
  empty      = "Sin registros.",
  loading    = false,
  defaultSort,
  searchKeys = [],
  pageSize   = DEFAULT_PAGE_SIZE,
}) {
  const [query,    setQuery]    = useState("");
  const [sort,     setSort]     = useState(defaultSort ?? null);
  const [page,     setPage]     = useState(1);
  const [openRows, setOpenRows] = useState({});
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchKeys.length) return rows;
    const q = normalize(query);
    return rows.filter((row) =>
      searchKeys.some((k) => normalize(row[k] ?? "").includes(q))
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const va = normalize(a[sort.key] ?? "");
      const vb = normalize(b[sort.key] ?? "");
      return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    setPage(1);
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc")        return { key, dir: "desc" };
      return null;
    });
  };

  const handleSearch = (v) => { setQuery(v); setPage(1); };
  const toggleRow    = (id) => setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const renderSkeleton = () =>
    isMobile ? (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 h-14 animate-pulse" />
        ))}
      </div>
    ) : (
      <div className="overflow-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pink-500">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  <div className="h-4 w-20 rounded animate-pulse bg-pink-400" />
                </th>
              ))}
              {actions && <th className="px-4 py-3"><div className="h-4 w-16 rounded animate-pulse bg-pink-400" /></th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map((col) => (
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
    );

  return (
    <div className="flex flex-col gap-3">

      {searchKeys.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
          />
        </div>
      )}

      {loading ? renderSkeleton()
        : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            {query ? "No se encontraron resultados." : empty}
          </div>
        ) : isMobile ? (
          <MobileCardView
            data={paginated}
            columns={columns}
            actions={actions}
            openRows={openRows}
            onToggleRow={toggleRow}
          />
        ) : (
          <DesktopTableView
            data={paginated}
            columns={columns}
            actions={actions}
            sort={sort}
            onToggleSort={toggleSort}
          />
        )}

      <div className="flex items-center justify-between px-1 text-sm text-gray-500">
        <span className="text-xs">
          {loading ? "Cargando..." : sorted.length === 0
            ? "0 registros"
            : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, sorted.length)} de ${sorted.length}`
          }
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    ? "bg-pink-500 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar que se adapta automáticamente (vertical u horizontal) */}
      <Sidebar />

     <div className="flex-1 flex flex-col lg:ml-64">

        {/* Header solo en PC */}
        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">{children}</main>
      </div>
    </div>
  );
};

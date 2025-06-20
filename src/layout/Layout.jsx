
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

export const Layout = ({ children}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header  />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">{children}</main>
      </div>
    </div>
  );
};

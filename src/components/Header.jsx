export const Header = () => {

  const usuario = {
    nombre: "Docente Demo",
    rol: "Docente"
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Sistema Escolar</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{usuario.nombre}</p>
          <p className="text-sm text-gray-300">{usuario.rol}</p>
        </div>
        <button className="bg-red-600 px-3 py-1 rounded">Cerrar sesión</button>
      </div>
    </header>
  );
};

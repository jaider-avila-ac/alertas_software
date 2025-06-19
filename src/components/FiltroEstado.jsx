import { Button } from "./Button";

const colores = {
  todos: "bg-orange-400",
  abierto: "bg-emerald-500",
  completado: "bg-purple-400",
};

const etiquetas = {
  todos: "Todos",
  abierto: "Abiertos",
  completado: "Completados",
};

export const FiltroEstado = ({ estados = [], totales = {}, onFiltrar }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {estados.map((estado) => (
        <Button
          key={estado}
          onClick={() => onFiltrar(estado)}
          color={colores[estado]}
          size="sm"
          text={`${etiquetas[estado]}: ${totales[estado] || 0}`}
        />
      ))}
    </div>
  );
};

export const GraficoResumen = ({ data }) => {
  const items = [
    { label: "Total alertas", valor: data.totalAlertas, color: "bg-pink-500" },
    { label: "Estudiantes con alertas", valor: data.estudiantesConAlertas, color: "bg-indigo-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {items.map((item, i) => (
        <div key={i} className={`p-4 text-white rounded shadow ${item.color}`}>
          <p className="text-sm">{item.label}</p>
          <p className="text-2xl font-bold">{item.valor}</p>
        </div>
      ))}
    </div>
  );
};

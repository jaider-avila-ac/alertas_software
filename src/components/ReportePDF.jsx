import { forwardRef } from "react";

export const ReportePDF = forwardRef(({ datos }, ref) => {
  const totalAlertas = datos.alertasCritico + datos.alertasAlto + datos.alertasModerado + datos.alertasLeve;
  const porcentaje = (valor) => totalAlertas > 0 ? ((valor / totalAlertas) * 100).toFixed(1) + "%" : "0%";

  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial" }}>
<h2 style={{ textAlign: "center", marginBottom: "20px" }}>Reporte de Alertas</h2>


      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Nivel</th>
            <th>Cantidad</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Crítico</td>
            <td>{datos.alertasCritico}</td>
            <td>{porcentaje(datos.alertasCritico)}</td>
          </tr>
          <tr>
            <td>Alto</td>
            <td>{datos.alertasAlto}</td>
            <td>{porcentaje(datos.alertasAlto)}</td>
          </tr>
          <tr>
            <td>Moderado</td>
            <td>{datos.alertasModerado}</td>
            <td>{porcentaje(datos.alertasModerado)}</td>
          </tr>
          <tr>
            <td>Leve</td>
            <td>{datos.alertasLeve}</td>
            <td>{porcentaje(datos.alertasLeve)}</td>
          </tr>
          <tr style={{ fontWeight: "bold" }}>
            <td>Total</td>
            <td>{totalAlertas}</td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>

      <p style={{ marginTop: "20px" }}><strong>Alertas sin seguimiento:</strong> {datos.alertasSinSeguimiento}</p>
      <p><strong>Alertas completadas:</strong> {datos.alertasCompletadas}</p>
      <p><strong>Promedio por mes:</strong> {datos.promedioPorMes}</p>
      <p><strong>Promedio por estudiante:</strong> {datos.promedioPorEstudiante}</p>
    </div>
  );
});

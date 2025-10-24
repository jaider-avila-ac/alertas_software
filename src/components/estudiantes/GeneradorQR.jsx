import { QrCode } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "../Button";

export const GeneradorQR = ({ estudiante }) => {
  const generarYDescargarQR = async () => {
    try {
      // URL con el ID del estudiante directamente
      const url = `${window.location.origin}/consultas/nueva?estudianteId=${estudiante.id}`;

      // Generar el QR como data URL
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Crear enlace para descargar
      const link = document.createElement("a");
      
      // Nombre: PrimerNombre_PrimerApellido_NroDoc.png
      const nombres = estudiante.nombres.split(" ");
      const apellidos = estudiante.apellidos.split(" ");
      const primerNombre = nombres[0] || "Estudiante";
      const primerApellido = apellidos[0] || "";
      const nombreArchivo = `${primerNombre}_${primerApellido}_${estudiante.nroDoc}.png`;

      link.href = qrDataUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al generar QR:", error);
      alert("Error al generar el código QR");
    }
  };

  return (
    <Button
      icon={QrCode}
      title="Generar QR"
      color="bg-purple-600"
      onClick={generarYDescargarQR}
    />
  );
};
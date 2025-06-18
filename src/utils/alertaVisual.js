import circuloLeve from "../assets/niveles_alertas/circulo_leve.svg";
import escudoAlto from "../assets/niveles_alertas/escudo_alto.svg";
import hexagonoCritico from "../assets/niveles_alertas/hexagono_critico.svg";
import trianguloModerado from "../assets/niveles_alertas/triangulo_moderado.svg";

export const alertaVisual = {
  leve: {
    icono: circuloLeve,
    color: "bg-emerald-400",
  },
  moderado: {
    icono: trianguloModerado,
    color: "bg-amber-400",
  },
  alto: {
    icono: escudoAlto,
    color: "bg-rose-400",
  },
  critico: {
    icono: hexagonoCritico,
    color: "bg-purple-400",
  },
};

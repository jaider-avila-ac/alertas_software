import circuloLeve from "../assets/niveles_alertas/circulo_leve.svg";
import escudoAlto from "../assets/niveles_alertas/escudo_alto.svg";
import hexagonoCritico from "../assets/niveles_alertas/hexagono_critico.svg";
import trianguloModerado from "../assets/niveles_alertas/triangulo_moderado.svg";

export const iconosAlerta = {
  leve: circuloLeve,
  moderado: trianguloModerado,
  alto: escudoAlto,
  critico: hexagonoCritico,
};

export const clasesAlerta = {
  leve: "bg-emerald-400",
  moderado: "bg-amber-400",
  alto: "bg-rose-400",
  critico: "bg-purple-400",
};
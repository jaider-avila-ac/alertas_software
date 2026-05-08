import { post } from "./api";

export async function registrarInstitucion(data) {
  const { data: resp } = await post("/registro/institucion", data);
  return resp;
}

import axios from 'axios';

const API_URL = 'http://universities.hipolabs.com/search?country=Peru';

export async function practicaAxios() {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
}

export async function practicaFetch() {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`);
  }
  return await respuesta.json();
}

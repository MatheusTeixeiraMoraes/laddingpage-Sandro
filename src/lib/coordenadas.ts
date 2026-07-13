export type Coordenadas = { latitude: number; longitude: number };

const PADROES = [
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // .../@-23.49,-47.44,15z
  /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, // ...?q=-23.49,-47.44
  /^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/, // -23.49, -47.44
];

/**
 * Extrai latitude/longitude de um link do Google Maps ou de um par cru.
 * Retorna null quando não reconhece o formato ou a coordenada é inválida.
 */
export function parseCoordenadas(entrada: string): Coordenadas | null {
  for (const padrao of PADROES) {
    const encontrado = entrada.match(padrao);
    if (!encontrado) continue;

    const latitude = Number(encontrado[1]);
    const longitude = Number(encontrado[2]);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;
    if (latitude < -90 || latitude > 90) continue;
    if (longitude < -180 || longitude > 180) continue;

    return { latitude, longitude };
  }

  return null;
}

import { useEffect, useState } from 'react';
import { practicaAxios, practicaFetch } from './services/practicaApi';
import './App.css';

function transformarUniversidades(datos) {
  if (!Array.isArray(datos)) return [];

  return datos.map((uni, indice) => {
    const dominio = uni.domains?.[0] ?? 'Sin dominio';
    const web = uni.web_pages?.[0] ?? '#';

    return {
      id: `${indice}-${dominio}`,
      nombre: uni.name,
      dominio,
      web,
      pais: uni.country,
      codigo: uni.alpha_two_code,
    };
  });
}

export default function App() {
  const [universidades, setUniversidades] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cliente, setCliente] = useState('axios');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarDatos(metodo = 'axios') {
    setCargando(true);
    setError('');

    try {
      const datos = metodo === 'fetch'
        ? await practicaFetch()
        : await practicaAxios();
      setUniversidades(transformarUniversidades(datos));
    } catch (error) {
      setUniversidades([]);
      setError(`No se pudo conectar con el servidor: ${error.message}`);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => {
    cargarDatos('axios');
  }, []);

  const universidadesFiltradas = universidades.filter((uni) =>
    uni.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
    uni.dominio.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div className="pagina">
      <header className="cabecera">
        <div className="contenido cabecera-interior">
          <span className="logo-texto">Directorio Universitario</span>
          <span className="marca">Practica Calificada 3 </span>
        </div>
      </header>

      <main className="contenido">
        <section className="presentacion">
          <p className="eyebrow">CONSULTAR</p>
          <h1>Universidades del Perú</h1>
          <p>
            listado de instituciones educativas.
          </p>
        </section>

        <section className="herramientas" aria-label="Herramientas de consulta">
          <label className="campo">
            <span>Buscar universidad</span>
            <input
              type="search"
              placeholder="Ejemplo: San Marcos, PUCP, upc.edu.pe..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <label className="campo selector">
            <span>Cliente HTTP</span>
            <select
              value={cliente}
              onChange={(evento) => setCliente(evento.target.value)}
            >
              <option value="axios">Axios</option>
              <option value="fetch">Fetch API</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => cargarDatos(cliente)}
            disabled={cargando}
          >
            {cargando ? 'Consultando…' : '↻ Actualizar lista'}
          </button>
        </section>

        <section className="resultados" aria-live="polite">
          <div className="resumen">
            <h2>Instituciones registradas</h2>
            <span>
              {universidadesFiltradas.length} de {universidades.length} resultados
            </span>
          </div>

          {cargando ? (
            <p className="mensaje">Obteniendo datos</p>
          ) : error ? (
            <div className="mensaje error" role="alert">{error}</div>
          ) : universidadesFiltradas.length === 0 ? (
            <p className="mensaje">
              No se encontraron universidades.
            </p>
          ) : (
            <div className="lista-universidades">
              {universidadesFiltradas.map((uni) => (
                <article className="tarjeta" key={uni.id}>
                  <div className="tarjeta-contenido">
                    <span className="etiqueta">
                      {uni.pais} ({uni.codigo}) · {uni.dominio}
                    </span>
                    <h3>{uni.nombre}</h3>
                    {uni.web !== '#' && (
                      <a
                        href={uni.web}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visitar portal oficial ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

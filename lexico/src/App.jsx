import { useState } from 'react';

// Expresiones Regulares
const TOKEN_RULES = [
  { type: 'PR', regex: /^(int|float|if|else|printf|return)$/ },
  { type: 'ID', regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
  { type: 'REAL', regex: /^[0-9]+\.[0-9]+$/ },
  { type: 'ENTERO', regex: /^[0-9]+$/ },
  { type: 'REL', regex: /^(>|<|>=|<=|==|!=)$/ },
  { type: 'ASIG', regex: /^=$/ },
  { type: 'ARIT', regex: /^[+\-*/%]$/ },
  { type: 'SYM', regex: /^[()|{}|;|,]$/ },
  { type: 'CADENA', regex: /^"[^"]*"$/ },
];
export default function App() {
  const [input, setInput] = useState('');
  const [lexemas, setLexemas] = useState([]);
  const [simbolos, setSimbolos] = useState([]);
  const [errores, setErrores] = useState([]);

  const analizarCodigo = () => {
    const listaLexemas = [];
    const listaSimbolos = [];
    const listaErrores = [];
    const simbolosUnicos = new Set();

    const palabras = input
      .split(/(\s+|[;(),{}|=]|>=|<=|==|!=|"[^"]*")/)
      .filter((p) => p && p.trim() !== '');

    palabras.forEach((lexema, index) => {
      const limpio = lexema.trim();
      let matched = false;

      for (const rule of TOKEN_RULES) {
        if (rule.regex.test(limpio)) {
          listaLexemas.push({ lexema: limpio, tipo: rule.type });

          if (rule.type === 'ID' && !simbolosUnicos.has(limpio)) {
            simbolosUnicos.add(limpio);
            listaSimbolos.push({
              id: limpio,
              tipo: 'Variable',
              valor: 'N/A',
              posicion: index + 1,
            });
          }
          matched = true;
          break;
        }
      }

      if (!matched) {
        listaErrores.push(
          `Error: Carácter o cadena '${limpio}' no reconocido (Pos: ${index + 1})`,
        );
      }
    });

    setLexemas(listaLexemas);
    setSimbolos(listaSimbolos);
    setErrores(listaErrores);
  };

  return (
    <div
      style={{
        padding: '30px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#eef2f3',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}
      >
        Analizador Léxico
      </h1>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <label style={{ fontWeight: 'bold', color: '#34495e' }}>
            Editor de Código:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              height: '200px',
              marginTop: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              resize: 'none',
              fontSize: '14px',
            }}
            placeholder='Ingresa tu código aquí, ejemplo: int x = 10;'
          />
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <label style={{ fontWeight: 'bold', color: '#c0392b' }}>
            Errores Léxicos:
          </label>
          <div
            style={{
              height: '200px',
              overflowY: 'auto',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#fdf2f2',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              color: '#721c24',
            }}
          >
            {errores.length === 0 ? (
              <small>No se detectaron errores.</small>
            ) : (
              errores.map((err, i) => (
                <p key={i} style={{ margin: '3px 0', fontSize: '13px' }}>
                  • {err}
                </p>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <label style={{ fontWeight: 'bold', color: '#34495e' }}>
            Lexemas Identificados:
          </label>
          <div
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                  <th style={{ padding: '10px' }}>Lexema</th>
                  <th style={{ padding: '10px' }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {lexemas.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{l.lexema}</td>
                    <td style={{ padding: '8px' }}>
                      <strong>{l.tipo}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <label style={{ fontWeight: 'bold', color: '#34495e' }}>
            Tabla de Símbolos:
          </label>
          <div
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#2ecc71', color: 'white' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Tipo</th>
                  <th style={{ padding: '10px' }}>Posición</th>
                </tr>
              </thead>
              <tbody>
                {simbolos.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{s.id}</td>
                    <td style={{ padding: '8px' }}>{s.tipo}</td>
                    <td style={{ padding: '8px' }}>{s.posicion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={analizarCodigo}
          style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: '0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1a252f')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#2c3e50')}
        >
          EJECUTAR ANÁLISIS LÉXICO
        </button>
      </div>
    </div>
  );
}

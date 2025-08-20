// components/PsychologicalProfile.tsx
import React from 'react';

interface Result {
  score: number;
  level: 'ALTO' | 'MEDIO' | 'BAJO';
}

interface Props {
  results: {
    personal: Result;
    social: Result;
    academico: Result;
    fisico: Result;
  };
  getLevelClass: (level: string) => string;
  personalY: number;
  socialX: number;
  academicoX: number;
  fisicoY: number;
}

const PsychologicalProfile: React.FC<Props> = ({
  results,
  getLevelClass,
  personalY,
  socialX,
  academicoX,
  fisicoY,
}) => {
  return (
    <>
      {/* Tabla de resultados */}
      <div className="mb-6 sm:mb-8 bg-celeste p-4 sm:p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Perfil Psicológico</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black text-xs sm:text-sm">
            <thead>
              <tr className="bg-mi-color-rgb text-white">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left border-2 border-black">Aspecto</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center border-2 border-black">Puntuación</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center border-2 border-black">Nivel</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left border-2 border-black">Interpretación</th>
              </tr>
            </thead>
            <tbody>
              {['personal', 'social', 'academico', 'fisico'].map((key) => {
                const result = results[key as keyof typeof results];
                const interpretationMap = {
                  personal: {
                    ALTO: 'Buena percepción de sí mismo y confianza en sus capacidades personales.',
                    MEDIO: 'Percepción adecuada de sí mismo con áreas por reforzar.',
                    BAJO: 'Puede mejorar en la confianza y valoración de sí mismo.',
                  },
                  social: {
                    ALTO: 'Facilidad para interactuar socialmente y establecer relaciones saludables.',
                    MEDIO: 'Relativa facilidad para interactuar socialmente, con aspectos por mejorar.',
                    BAJO: 'Puede fortalecer sus habilidades de interacción social.',
                  },
                  academico: {
                    ALTO: 'Confianza elevada en sus capacidades de aprendizaje y desempeño académico.',
                    MEDIO: 'Adecuada valoración de sus capacidades académicas.',
                    BAJO: 'Puede aumentar la confianza en sus habilidades académicas.',
                  },
                  fisico: {
                    ALTO: 'Buena aceptación y valoración de su imagen corporal y capacidades físicas.',
                    MEDIO: 'Aceptación moderada de su imagen y capacidades físicas.',
                    BAJO: 'Puede mejorar la aceptación de su imagen corporal.',
                  },
                } as const;

                const interpretations: string =
                  result && interpretationMap[key as keyof typeof interpretationMap][result.level]
                    ? interpretationMap[key as keyof typeof interpretationMap][result.level]
                    : '';

                return result ? (
                  <tr key={key}>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-2 border-black font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-2 border-black text-center font-bold">{result.score}/6</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-2 border-black text-center">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getLevelClass(result.level)}`}>
                        {result.level}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-2 border-black text-xs sm:text-sm">{interpretations}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 sm:mt-4 p-3 sm:p-4">
          <p className="font-medium text-blue-800 text-sm sm:text-base">Interpretación de niveles:</p>
          <ul className="mt-2 space-y-1 text-xs sm:text-sm">
            <li><span className="text-red-500 font-medium">Bajo (0-2 puntos): </span>Indica áreas que requieren atención y desarrollo.</li>
            <li><span className="text-yellow-500 font-medium">Medio (3 puntos): </span>Refleja un desarrollo adecuado con oportunidades de mejora.</li>
            <li><span className="text-green-500 font-medium">Alto (4-6 puntos): </span>Muestra fortalezas y un buen desarrollo en el aspecto evaluado.</li>
          </ul>
        </div>
      </div>

      {/* Dispersigrama */}
      <div className="bg-celeste p-4 sm:p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Dispersigrama de Resultados</h2>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-lg sm:max-w-xl">
            <svg viewBox="0 0 600 500" className="w-full h-auto border rounded-lg bg-white p-2 sm:p-4">
              <line x1="300" y1="50" x2="300" y2="450" stroke="#ccc" strokeWidth="1" />
              <line x1="100" y1="250" x2="500" y2="250" stroke="#ccc" strokeWidth="1" />

              <text x="300" y="40" textAnchor="middle" fontWeight="bold" fontSize="12">PERSONAL</text>
              <text x="300" y="470" textAnchor="middle" fontWeight="bold" fontSize="12">FÍSICO</text>
              <text x="80" y="250" textAnchor="middle" fontWeight="bold" fontSize="12">SOCIAL</text>
              <text x="520" y="250" textAnchor="middle" fontWeight="bold" fontSize="12">ACADÉMICO</text>

              <circle cx="300" cy={personalY} r="8" fill={getColor(results.personal.level)} />
              <circle cx={academicoX} cy="250" r="8" fill={getColor(results.academico.level)} />
              <circle cx={socialX} cy="250" r="8" fill={getColor(results.social.level)} />
              <circle cx="300" cy={fisicoY} r="8" fill={getColor(results.fisico.level)} />

              <polygon
                points={`300,${personalY} ${academicoX},250 300,${fisicoY} ${socialX},250`}
                fill="rgba(74, 111, 165, 0.2)"
                stroke="#4a6fa5"
                strokeWidth="2"
              />

              <text x="300" y={personalY - 15} textAnchor="middle" fontSize="12">{results.personal.score}</text>
              <text x={academicoX + 15} y="250" textAnchor="middle" fontSize="12">{results.academico.score}</text>
              <text x={socialX - 15} y="250" textAnchor="middle" fontSize="12">{results.social.score}</text>
              <text x="300" y={fisicoY + 15} textAnchor="middle" fontSize="12">{results.fisico.score}</text>
            </svg>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <Legend color="bg-green-500" label="Alto (4-6)" />
          <Legend color="bg-yellow-500" label="Medio (3)" />
          <Legend color="bg-red-500" label="Bajo (0-2)" />
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <p className="font-medium text-blue-800 text-sm sm:text-base">Interpretación del Dispersigrama:</p>
          <p className="mt-2 text-xs sm:text-sm">
            El gráfico muestra los niveles de autoestima en los cuatro aspectos evaluados.
            Cuanto más cerca está el punto del centro, mayor es la puntuación obtenida.
            {results.personal.level === 'ALTO' && results.academico.level === 'ALTO' &&
              ' Las fortalezas se observan principalmente en los aspectos personal y académico.'}
            {results.social.level === 'ALTO' && results.fisico.level === 'ALTO' &&
              ' Las fortalezas se observan principalmente en los aspectos social y físico.'}
            {results.personal.level === 'BAJO' && ' El aspecto personal muestra oportunidades de mejora.'}
            {results.social.level === 'BAJO' && ' El aspecto social muestra oportunidades de mejora.'}
            {results.academico.level === 'BAJO' && ' El aspecto académico muestra oportunidades de mejora.'}
            {results.fisico.level === 'BAJO' && ' El aspecto físico muestra oportunidades de mejora.'}
          </p>
          <p className="mt-2 text-xs sm:text-sm">
            La forma del polígono resultante indica un perfil de autoestima
            {Math.max(
              results.personal.score,
              results.social.score,
              results.academico.score,
              results.fisico.score
            ) - Math.min(
              results.personal.score,
              results.social.score,
              results.academico.score,
              results.fisico.score
            ) > 2 ? ' con desarrollo desigual' : ' con desarrollo equilibrado'}.
          </p>
        </div>
      </div>
    </>
  );
};

const getColor = (level: string) => {
  return level === 'ALTO' ? '#28a745' : level === 'MEDIO' ? '#ffc107' : '#dc3545';
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center justify-center sm:justify-start">
    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${color} mr-2`}></div>
    <span className="text-xs sm:text-sm">{label}</span>
  </div>
);

export default PsychologicalProfile;

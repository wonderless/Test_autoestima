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
  generalLevel: "ALTO" | "MEDIO" | "BAJO" | null;
}

const PsychologicalProfile: React.FC<Props> = ({
  results,
  getLevelClass,
  personalY,
  socialX,
  academicoX,
  fisicoY,
  generalLevel,
}) => {
  const generalInterpretation = generalLevel === "ALTO"
    ? "En relación a los resultados, usted evidenció tener un autoestima de nivel alto, lo cual destaca el sentimiento de importancia y respeto por sí misma, además de la confianza en sus capacidades y habilidades, la disposición a decidir por sí solo. Esto no quiere decir que se sienta superior a los demás si no que reconoce sus propias limitaciones y debilidades, y, trata de superarlas. Los obstáculos que se le presentan los toma como un reto a los cuales debe enfrentar y superar. Por otro lado, se considera mayor facilidad para expresar espontáneamente sus sentimientos y aceptar la expresión de sentimientos de las demás personas, respetando así no sólo características físicas y de género en los demás sino también expresiones y comportamientos diferenciales."
    : generalLevel === "MEDIO"
    ? "En relación a los resultados, usted evidenció tener un autoestima de nivel medio, lo cual indica que mantiene regularidad en la valoración de sus propias características sin sobrevalorar sus  capacidades y expresando sus sentimientos de acuerdo a los contextos en los que interactúa. Tiene altibajos en la evaluación y expresión de sus aptitudes y afectos."
    : generalLevel === "BAJO"
    ? "En relación a los resultados, usted evidenció tener un nivel de autoestima bajo; lo cual indica que su autoestima se caracteriza por insatisfacción, rechazo y desprecio de sí mismo. Se destaca la falta de respeto hacia uno mismo, un autorretrato desagradable y el deseo de ser distinto; además de pensar no valer nada y sentir que lo peor le puede pasar. Además, se considera la preferencia por el aislamiento, el hecho de despreciar a los demás y sentir desconfianza. "
    : "";

  return (
    <>
      {/* Tabla de resultados */}
      <div className="mb-6 sm:mb-8 bg-celeste p-4 sm:p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Perfil Psicológico</h2>
        {generalLevel && (
          <div className="mb-4 p-3 sm:p-4 bg-white rounded-md border border-gray-300">
            <p className="text-sm sm:text-base font-medium text-gray-800">{generalInterpretation}</p>
          </div>
        )}
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
                    ALTO: 'Felicidades, usted tiene una buena percepción sobre su carácter, valores y persona; además de tener confianza en sus capacidades personales.',
                    MEDIO: 'Usted tiene una percepción adecuada de sí mismo, sin sobrevalorar sus características particulares, pero con algunas áreas para reforzar.',
                    BAJO: 'Usted evidenció una inadecuada valoración sobre sus características y valores personales y dificultades en la confianza sobre sus capacidades. Se sugiere que realice con urgencia las siguientes actividades para empezar a mejorar la percepción sobre sus características de personalidad.'
                  },
                  social: {
                    ALTO: 'Felicidades, usted evidenció tener capacidad para interactuar de forma adecuada y establecer relaciones saludables.',
                    MEDIO: 'Usted evidenció tener una valoración oportuna sobre sus capacidades de interacción; además de presentar cierta facilidad para interactuar socialmente; no obstante, existen algunos aspectos para trabajar.',
                    BAJO: 'Usted evidenció tener marcadas deficiencias para la interacción social y el desarrollo de relaciones saludables.  Resulta urgente que continúe con las actividades planteadas para evidenciar mejoras en el ámbito de interacción social',
                  },
                  academico: {
                    ALTO: 'Felicidades, usted presentó una elevada confianza en sus capacidades de aprendizaje y desempeño académico.',
                    MEDIO: 'Usted presenta una adecuada valoración de sus capacidades académicas y de aprendizaje, aunque existen oportunidades de mejora que se pueden abordar.',
                    BAJO: 'Usted evidenció tener una inadecuada percepción sobre sus aptitudes académicas, además de presentar desconfianza en su capacidad para aprender y abordar situaciones relacionadas a los estudios. Se requiere continuar con el programa para evidenciar mejoras en su valoración académica.',
                  },
                  fisico: {
                    ALTO: 'Usted presentó una excelente aceptación y valoración de su imagen corporal y características físicas, felicidades.',
                    MEDIO: 'Usted evidenció una valoración saludable de su imagen y capacidades físicas; aunque existen puntos de optimización para mejorar la percepción sobre sí mismo.',
                    BAJO: 'Usted manifestó tener deficiencias marcadas en la valoración de sus características físicas; por lo cual se requiere con urgencia seguir con el programa de actividades para empezar a trabajar sobre la aceptación de su imagen corporal.',
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

      {/* Dispersigrama -> reemplazado por Gráfico de Barras */}
      <div className="bg-celeste p-4 sm:p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Gráfico de Barras de Resultados</h2>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-lg sm:max-w-xl">
            {/* Gráfico de barras simple en SVG */}
            <svg viewBox="0 0 600 320" className="w-full h-auto border rounded-lg bg-white p-2 sm:p-4">
              {(() => {
                const padding = { top: 20, right: 20, bottom: 60, left: 40 };
                const width = 600 - padding.left - padding.right;
                const height = 320 - padding.top - padding.bottom;
                const scores = [
                  { key: 'Personal', score: results.personal.score, level: results.personal.level },
                  { key: 'Social', score: results.social.score, level: results.social.level },
                  { key: 'Académico', score: results.academico.score, level: results.academico.level },
                  { key: 'Físico', score: results.fisico.score, level: results.fisico.level },
                ];
                const maxScore = 6;
                const barCount = scores.length;
                const gap = 20;
                const barWidth = (width - gap * (barCount + 1)) / barCount;

                return (
                  <>
                    {/* Eje Y labels */}
                    {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
                      const y = padding.top + height - (tick / maxScore) * height;
                      return (
                        <g key={tick}>
                          <line x1={padding.left} x2={padding.left + width} y1={y} y2={y} stroke="#eee" strokeWidth={1} />
                          <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#333">{tick}</text>
                        </g>
                      );
                    })}

                    {/* Barras */}
                    {scores.map((s, i) => {
                      const x = padding.left + gap + i * (barWidth + gap);
                      const barHeight = (s.score / maxScore) * height;
                      const y = padding.top + height - barHeight;
                      return (
                        <g key={s.key}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill={getColor(s.level)}
                            rx={6}
                          />
                          <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#111" fontWeight="600">
                            {s.score}/6
                          </text>
                          <text x={x + barWidth / 2} y={padding.top + height + 20} textAnchor="middle" fontSize="12" fill="#111">
                            {s.key}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <Legend color="bg-green-500" label="Alto (4-6)" />
          <Legend color="bg-yellow-500" label="Medio (3)" />
          <Legend color="bg-red-500" label="Bajo (0-2)" />
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <p className="font-medium text-blue-800 text-sm sm:text-base">Interpretación del Gráfico de Barras:</p>
          <p className="mt-2 text-xs sm:text-sm">
            El gráfico muestra las puntuaciones (0-6) en los cuatro aspectos evaluados.
            Cada barra representa la puntuación y el color indica el nivel (Alto/Medio/Bajo).
            {results.personal.level === 'BAJO' && ' El aspecto personal muestra oportunidades de mejora.'}
            {results.social.level === 'BAJO' && ' El aspecto social muestra oportunidades de mejora.'}
            {results.academico.level === 'BAJO' && ' El aspecto académico muestra oportunidades de mejora.'}
            {results.fisico.level === 'BAJO' && ' El aspecto físico muestra oportunidades de mejora.'}
          </p>
          <p className="mt-2 text-xs sm:text-sm">
            La diferencia entre la puntuación más alta y la más baja indica si el perfil es equilibrado o desigual:
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

INSTRUCCIONES DE REDACCIÓN — PAPER ACADÉMICO COMPLETO
FinanceBench: Un Benchmark Integral para Evaluar Modelos de Lenguaje en Tareas de Análisis Financiero

NOTA INICIAL IMPORTANTE
Junto con estas instrucciones recibirás los resultados completos del benchmark y el análisis de datos ya realizados. Úsalos como fuente primaria para poblar las tablas, cifras, hallazgos y conclusiones del paper. No inventes datos: si un dato no está en los resultados adjuntos, indícalo explícitamente como "pendiente de análisis" o "resultado no disponible". Toda afirmación cuantitativa debe trazarse directamente a los datos proporcionados.

PRINCIPIO CENTRAL: ACCESIBILIDAD UNIVERSAL
Este documento debe ser comprensible para CUALQUIER lector, no solo para ingenieros, programadores, economistas o investigadores.
Esto significa:
Definir TODOS los términos técnicos la primera vez que aparecen, ya sea entre paréntesis, en una oración explicativa inmediata, o en una nota al pie breve.
Usar analogías y ejemplos cotidianos para conceptos abstractos. Si estás explicando una tasa de descuento, compárala con algo que cualquier persona entienda (por ejemplo: "es como el precio de esperar").
Evitar jerga innecesaria: si existe una palabra común y precisa, usarla en lugar del término técnico.
Explicar el "por qué" además del "qué": no basta con decir qué es un LLM; el lector debe entender por qué importa en este contexto.
No asumir conocimientos previos sobre programación, estadística, finanzas o metodología de investigación.
Términos de inteligencia artificial (modelo, parámetros, entrenamiento, token, etc.) siempre deben explicarse brevemente la primera vez.
Términos financieros (VPN, TIR, flujo de caja, punto de equilibrio, etc.) deben definirse en lenguaje cotidiano antes de usarlos con frecuencia.
Términos estadísticos (correlación, significancia, intervalo de confianza, etc.) siempre deben acompañarse de una interpretación en lenguaje cotidiano.
Acrónimos: la primera vez se escribe el nombre completo seguido del acrónimo entre paréntesis. Ejemplo: "Modelos de Lenguaje Grande (MLG, o LLM por sus siglas en inglés)".

PRINCIPIOS FUNDAMENTALES DE ESCRITURA
1. Autenticidad Académica
Escribe como un investigador humano experto, con curiosidad intelectual y rigor analítico.
Usa variabilidad sintáctica natural: alterna entre oraciones cortas, medianas y complejas. El ritmo del texto debe ser fluido, no mecánico.
Evita patrones repetitivos, frases comodín ("cabe destacar que", "es importante mencionar que", "en este sentido") y construcciones vacías.
Incluye transiciones orgánicas entre párrafos e ideas: cada sección debe sentirse conectada con la anterior y con el argumento global del paper.
2. Voz y Registro Académico en Español
Primera persona del plural cuando el equipo investigador actúa: "evaluamos", "diseñamos", "encontramos", "proponemos".
Voz pasiva cuando el foco está en el objeto o proceso: "el benchmark fue construido", "los casos fueron validados".
Nominalizaciones moderadas, sin exceso: "el análisis reveló" en lugar de "al analizar se reveló".
Matices cuantitativos que reflejen la escala real: "mejora sustancial", "diferencia marginal", "brecha significativa".
Evitar afirmaciones absolutas sin respaldo cuantitativo ("siempre", "nunca", "todos los modelos").
3. Integración de Referencias — Formato APA 7ª Edición
Usar formato APA 7ª edición en todo el documento: (Apellido, Año) en el texto; lista completa al final.
Las citas deben fluir naturalmente dentro de la prosa, no aparecer apiladas al final de cada párrafo.
Variar entre citas de trabajos seminales (fundacionales del campo) y trabajos recientes (2020–2025).
Priorizar publicaciones de conferencias de primer nivel: NeurIPS, ICML, ACL, EMNLP, AAAI, ICLR.
No incluir referencias inventadas. Si necesitas citar algo y no tienes la referencia exacta, usa el formato: [REFERENCIA PENDIENTE: descripción del trabajo a buscar].
4. Estructura de Párrafos Técnicos
Cada párrafo = una sola idea principal.
Longitud ideal: 5 a 9 oraciones.
Estructura interna: apertura con contexto o afirmación → desarrollo con evidencia, datos o razonamiento → cierre con implicación o transición.
No comenzar párrafos consecutivos con la misma palabra o estructura.
5. Uso de Tablas y Figuras
Toda tabla y figura debe tener número, título descriptivo y fuente (ej: "Elaboración propia").
El texto debe referirse explícitamente a cada tabla/figura antes de que aparezca: "La Tabla 3 presenta…", "Como se observa en la Figura 2…".
Las tablas no reemplazan el análisis: siempre hay un párrafo que interpreta lo que muestra la tabla.
Los captions deben ser suficientemente informativos para que alguien que solo hojea el paper entienda de qué trata la figura sin leer el texto completo.

ESTRUCTURA COMPLETA DEL PAPER — EXTENSIÓN OBJETIVO: +50 PÁGINAS
El paper está organizado en 14 secciones principales más apéndices. A continuación se detalla cada sección con longitud mínima, estructura interna, criterios de calidad y notas de accesibilidad.

SECCIÓN 0: PORTADA, RESUMEN Y TABLA DE CONTENIDOS
Longitud: 1–2 páginas
 Formato: Formal, según normas APA 7ª edición
Portada incluye:
Título completo en español e inglés
Nombre(s) del autor/autores
Afiliación institucional: [afiliación institucional omitida]
Programa de investigación
Año
Resumen en español (Abstract):
Longitud: 200–280 palabras
Párrafo único, sin citas, sin tablas
Estructura: (1) contexto y problema, (2) qué se construyó, (3) cómo se evaluó, (4) resultados principales con números concretos, (5) implicaciones y disponibilidad del recurso
Palabras clave: 5 a 7, en español e inglés, al final del resumen
Tabla de contenidos: Lista numerada de secciones y subsecciones con página de referencia aproximada.

SECCIÓN 1: INTRODUCCIÓN
Longitud: 2.500–3.000 palabras (~5–6 páginas)
 Referencias: 18–25
 Formato: Prosa narrativa continua, sin subtítulos internos
Párrafo 1 — El momento actual de la inteligencia artificial (300–400 palabras)
Describe el auge de los modelos de lenguaje grande en los últimos años. Explica qué es un LLM en términos accesibles (un sistema de IA entrenado con enormes cantidades de texto que puede responder preguntas, redactar documentos y resolver problemas complejos). Menciona ejemplos conocidos: GPT-4 (OpenAI), Claude (Anthropic), Gemini (Google). Aporta datos sobre adopción masiva: en qué sectores se está usando, con qué velocidad está creciendo. Conecta con el sector financiero como uno de los de mayor adopción.
Párrafo 2 — La promesa de la IA en las finanzas (350–400 palabras)
Desarrolla el caso específico del uso de LLMs para análisis financiero: proyecciones, evaluación de proyectos, asesoría automatizada, educación financiera. Explica por qué esto es especialmente relevante en América Latina: brecha de acceso a asesoría financiera profesional, crecimiento del ecosistema emprendedor, contexto de economías emergentes. Aporta estadísticas sobre el porcentaje de empresas FinTech experimentando con LLMs. Introduce el problema de que esta promesa no ha sido sistemáticamente evaluada.
Párrafo 3 — El problema central: falta de evaluación rigurosa (350–450 palabras)
Explica que no existe un benchmark (término que debes definir aquí como "un conjunto estandarizado de pruebas que permite medir y comparar el rendimiento de diferentes sistemas bajo las mismas condiciones, de manera reproducible") diseñado específicamente para evaluar LLMs en tareas de análisis financiero. Contrasta con benchmarks generales existentes (MMLU, HELM) y explica por qué no son suficientes: las finanzas requieren precisión numérica, razonamiento multi-paso y conocimiento conceptual específico. Menciona las consecuencias prácticas de esta brecha: selección arbitraria de herramientas, riesgo de errores en decisiones empresariales, alucinaciones financieras (invención de datos por parte del modelo).
Párrafo 4 — Por qué el análisis financiero es un reto especial para los LLMs (300–350 palabras)
Explica las razones técnicas y conceptuales: los cálculos financieros requieren aritmética precisa (y los LLMs tienen limitaciones conocidas en aritmética), los errores se propagan en cadenas de cálculo, y la interpretación contextual es igualmente importante que el número final. Conecta con literatura sobre limitaciones de LLMs en razonamiento numérico.
Párrafo 5 — Nuestra contribución: FinanceBench (350–400 palabras)
Presenta el benchmark de forma clara y atractiva. Nombra y describe: 1.000 casos de prueba, 10 categorías de tareas, validación por panel de expertos, evaluación de 8 modelos LLM. Anticipa los hallazgos más destacados sin revelarlos completamente. Menciona la disponibilidad pública del dataset.
Párrafo 6 — Relevancia para el contexto latinoamericano (200–250 palabras)
Justifica la pertinencia del estudio desde el contexto colombiano y latinoamericano: idioma, perfil del emprendedor, necesidades específicas, brecha digital en acceso a asesoría. Explica por qué la mayoría de benchmarks existentes están en inglés y cómo esto representa una limitación para la región.
Párrafo 7 — Estructura del documento (150–200 palabras)
Guía al lector por el resto del paper: "La Sección 2 presenta el planteamiento detallado del problema... La Sección 3 desarrolla el marco teórico... La Sección 4...". Invita al lector a continuar.

SECCIÓN 2: PLANTEAMIENTO DEL PROBLEMA
Longitud: 2.000–2.500 palabras (~4–5 páginas)
 Referencias: 12–18
 Formato: Prosa con 3–4 subsecciones con subtítulos
2.1 Descripción del Problema (600–700 palabras)
Desarrolla en profundidad la problemática: la explosión de adopción de LLMs en finanzas combinada con la ausencia de estándares de evaluación. Usa datos concretos, ejemplos reales de uso (un emprendedor que usa ChatGPT para calcular el VPN de su proyecto, una startup FinTech que implementa IA para recomendaciones de inversión). Explica qué pasa cuando se usa una herramienta sin validar: las consecuencias pueden ser financieramente graves. Define claramente qué es una "alucinación" en el contexto de los LLMs (cuando el modelo genera información incorrecta o inventada con total confianza, sin marcar su error) y por qué es especialmente peligrosa en finanzas.
2.2 Manifestaciones Específicas del Problema (500–600 palabras)
Desglosa el problema en manifestaciones concretas y observables:
Ausencia de datos de referencia validados
Selección no informada de modelos por parte de desarrolladores
Riesgo para usuarios finales sin formación técnica
Imposibilidad de comparar estudios entre investigadores
Optimismo injustificado en capacidades financieras de LLMs Para cada manifestación, incluye un ejemplo o evidencia empírica de la literatura.
2.3 Preguntas de Investigación (300–400 palabras)
Presenta las preguntas de manera formal y explicada. Primero la pregunta principal, luego las preguntas secundarias. Explica por qué cada pregunta es relevante y qué tipo de conocimiento genera su respuesta.
Pregunta principal: ¿Cuál es el rendimiento comparativo de los Modelos de Lenguaje Grande en tareas fundamentales de análisis financiero, y qué patrones de fortalezas y debilidades caracterizan a cada modelo?
Preguntas secundarias:
¿Cuáles categorías de tareas financieras representan mayor dificultad para los LLMs actuales?
¿Existe una brecha de rendimiento estadísticamente significativa entre modelos propietarios y modelos de código abierto?
¿Qué tipos de errores cometen los LLMs con mayor frecuencia en análisis financiero?
¿La capacidad general de un LLM (medida por benchmarks estándar) predice su rendimiento en tareas financieras?
2.4 Justificación e Importancia del Estudio (500–600 palabras)
Argumenta por qué este estudio vale la pena hacerse ahora. Considera tres dimensiones: justificación teórica (contribuye al conocimiento científico sobre capacidades de LLMs), justificación práctica (tiene aplicaciones inmediatas para desarrolladores y emprendedores) y justificación contextual (es especialmente urgente en el contexto latinoamericano). Cierra con una declaración clara sobre el aporte esperado del estudio.

SECCIÓN 3: OBJETIVOS DE INVESTIGACIÓN
Longitud: 600–800 palabras (~1–1,5 páginas)
 Formato: Prosa explicativa con listado formal. No se reduce a una lista seca.
Objetivo General
Redactar con verbo en infinitivo, claro y medible. Ejemplo: "Diseñar, construir y validar un benchmark integral para la evaluación sistemática de Modelos de Lenguaje Grande en tareas de análisis financiero, que permita comparar objetivamente el rendimiento de los modelos existentes y establecer estándares de calidad para aplicaciones de inteligencia artificial en finanzas."
Después del objetivo, escribe 2–3 oraciones explicando qué significa cada componente del objetivo: qué implica "diseñar", qué significa "benchmark", qué se entiende por "sistemática".
Objetivos Específicos
Para cada objetivo específico, incluir: el objetivo en sí (verbo en infinitivo + resultado esperado) y una oración explicativa de cómo se logrará o por qué es necesario. Los objetivos deben ser:
Diseñar una taxonomía de tareas financieras relevantes para el análisis de viabilidad de negocios.
Establecer métricas de evaluación apropiadas para medir precisión calculatoria y calidad de razonamiento financiero.
Construir un dataset de 1.000 casos de prueba con soluciones verificadas por expertos.
Evaluar el rendimiento de 8 LLMs en el benchmark construido.
Analizar los patrones de error más frecuentes y las limitaciones específicas de cada modelo.

SECCIÓN 4: MARCO TEÓRICO
Longitud: 4.000–5.000 palabras (~8–10 páginas)
 Referencias: 40–55
 Formato: Subsecciones temáticas con prosa narrativa
Esta sección construye los fundamentos conceptuales del paper. No es un glosario ni una lista de definiciones: es una narrativa que explica los conceptos necesarios, los conecta entre sí y justifica las decisiones del estudio.
4.1 Inteligencia Artificial y Modelos de Lenguaje Grande (700–900 palabras)
Empieza con una descripción accesible de qué es la inteligencia artificial: no como ciencia ficción, sino como un campo de la computación que desarrolla sistemas capaces de realizar tareas que normalmente requieren inteligencia humana (como entender texto, reconocer imágenes o jugar ajedrez). Explica brevemente cómo evolucionó: desde reglas programadas a mano (sistemas expertos) hasta el aprendizaje automático (machine learning), donde los sistemas aprenden patrones a partir de datos.
Introduce los Modelos de Lenguaje Grande (LLM) como el hito más reciente: sistemas entrenados con cantidades masivas de texto (libros, artículos, páginas web) que aprenden a predecir y generar lenguaje de manera coherente. Usa una analogía accesible: "Si un motor de búsqueda encuentra información existente, un LLM puede razonar sobre esa información y formular respuestas originales". Explica la arquitectura Transformer (sin entrar en matemáticas) como el mecanismo que les permite "prestar atención" a las partes relevantes del texto. Menciona hitos como GPT, BERT, LLaMA, y explica brevemente qué los diferencia. Cita trabajos fundamentales: Vaswani et al. (2017), Brown et al. (2020), Touvron et al. (2023).
4.2 Capacidades y Limitaciones de los LLMs en Razonamiento Numérico (700–900 palabras)
Explica qué se entiende por "razonamiento" en el contexto de los LLMs: la capacidad de seguir una cadena lógica de pasos para llegar a una conclusión. Distingue entre razonamiento verbal (donde los LLMs son fuertes) y razonamiento numérico (donde muestran limitaciones conocidas).
Introduce el fenómeno de las alucinaciones: cuando un LLM genera afirmaciones falsas con total confianza. En el contexto financiero, esto puede significar inventar tasas de interés, aplicar fórmulas incorrectas o llegar a conclusiones erróneas sin advertirlo. Cita literatura específica sobre este fenómeno. Describe también el razonamiento de cadena de pensamiento (Chain of Thought), una técnica donde se le pide al modelo que explique su proceso paso a paso, lo que mejora la precisión. Explica técnicas de prompting relevantes y sus efectos en el rendimiento.
4.3 Análisis Financiero: Conceptos Clave (800–1.000 palabras)
Define y explica en términos accesibles cada una de las 10 categorías de tareas del benchmark. Para cada una: nombre del concepto, definición en lenguaje cotidiano, fórmula básica si aplica (explicada en palabras), y por qué es relevante para emprendedores o analistas. Usa ejemplos numéricos simples.
Valor Presente Neto (VPN / NPV): cuánto vale hoy el dinero que recibirás en el futuro, descontando el costo de esperar.
Tasa Interna de Retorno (TIR / IRR): el rendimiento porcentual que un proyecto genera por sí solo.
Proyección de Flujo de Caja: estimación de los ingresos y egresos de dinero a lo largo del tiempo.
Generación de Escenarios: construcción de proyecciones optimistas, pesimistas y moderadas para evaluar incertidumbre.
Análisis de Punto de Equilibrio: cuántas unidades o ingresos se necesitan para cubrir todos los costos.
Estructura de Capital: cómo se financia una empresa (deuda vs. capital propio) y sus implicaciones.
Indicadores Financieros: ROI, ROE, margen bruto, EBITDA — métricas que resumen el desempeño.
Interpretación de Estados Financieros: lectura y análisis del balance general, estado de resultados y flujo de caja.
Análisis de Sensibilidad: cómo cambian los resultados cuando varían los supuestos clave.
Recomendaciones de Viabilidad: síntesis de los análisis anteriores para emitir un juicio de inversión o rechazo.
4.4 Benchmarks en Inteligencia Artificial: Qué Son y Para Qué Sirven (500–700 palabras)
Explica el concepto de benchmark de forma accesible: es como un examen estandarizado que permite comparar a diferentes estudiantes bajo las mismas condiciones. En IA, un benchmark es un conjunto de tareas y criterios de evaluación que permite medir y comparar el rendimiento de diferentes sistemas. Explica por qué los benchmarks son fundamentales en el progreso científico: crean un lenguaje común, permiten reproducibilidad y orientan el desarrollo de nuevos modelos.
Describe brevemente los benchmarks más conocidos en IA: MMLU (conocimiento general), GSM8K (matemáticas de nivel escolar), HELM (evaluación holística), y los benchmarks de dominio específico como MedQA (medicina) y LegalBench (derecho). Explica qué tienen en común y por qué ninguno cubre adecuadamente el análisis financiero.
4.5 IA y Finanzas: Estado del Arte (600–800 palabras)
Revisa el estado de la investigación en la intersección de IA y finanzas: modelos para predicción de mercados, análisis de sentimiento en noticias financieras, detección de fraude, asesoría automatizada (robo-advisors). Explica cómo los LLMs representan una nueva generación en este campo: más flexibles, más accesibles, pero también menos especializados. Cita estudios empíricos recientes sobre el uso de LLMs en tareas financieras concretas. Identifica la brecha: pese al creciente uso, la evaluación rigurosa de capacidades es escasa.
4.6 Democratización del Conocimiento Financiero en América Latina (400–500 palabras)
Contextualiza el problema en el entorno latinoamericano: el ecosistema emprendedor en Colombia y la región, la brecha de acceso a asesoría financiera profesional, el costo de contratar analistas, y cómo los LLMs representan una alternativa potencialmente democratizadora. Explica los riesgos específicos de usar herramientas no validadas en contextos de recursos limitados. Fundamenta teóricamente la dimensión de equidad y acceso al conocimiento.

SECCIÓN 5: ANTECEDENTES DE INVESTIGACIÓN
Longitud: 2.500–3.000 palabras (~5–6 páginas)
 Referencias: 30–40
 Formato: Subsecciones temáticas con análisis crítico
Esta sección es diferente al marco teórico: mientras el marco teórico construye conceptos, los antecedentes presentan estudios previos concretos, analizan sus hallazgos y explican qué dejan sin resolver.
5.1 Benchmarks Generales de LLMs (500–600 palabras)
Revisa los grandes benchmarks de evaluación de LLMs: MMLU (Hendrycks et al., 2021), HELM (Liang et al., 2022), BIG-Bench (Srivastava et al., 2022). Para cada uno: qué evalúan, qué encontraron, qué modelos resultaron mejor evaluados, y cuál es su limitación para el dominio financiero. Concluye con una síntesis de qué aspecto de la evaluación general no cubre adecuadamente el razonamiento financiero especializado.
5.2 Benchmarks de Razonamiento Numérico y Matemático (500–600 palabras)
Revisa GSM8K (Cobbe et al., 2021), MATH (Hendrycks et al., 2021), y otros benchmarks matemáticos. Analiza qué revelan sobre las capacidades y limitaciones de LLMs en aritmética y resolución de problemas numéricos. Explica por qué el razonamiento financiero es distinto al razonamiento matemático puro: involucra supuestos contextuales, interpretación de resultados y conocimiento de dominio.
5.3 Benchmarks de Dominio Específico (400–500 palabras)
Examina benchmarks diseñados para dominios específicos: MedQA para medicina, LegalBench para derecho, CodeBench para programación. Extrae lecciones metodológicas: cómo definieron sus taxonomías, cómo validaron los casos de prueba, qué métricas usaron. Señala analogías con el diseño de FinanceBench.
5.4 Evaluaciones Previas de LLMs en Tareas Financieras (600–700 palabras)
Revisa los estudios que más se aproximan a lo que hace FinanceBench: evaluaciones informales o parciales de LLMs en finanzas, estudios de caso sobre uso de IA en asesoría financiera, análisis de alucinaciones en contextos financieros. Identifica sus limitaciones: muestras pequeñas, ausencia de validación experta, cobertura limitada de tareas, falta de reproducibilidad. Cada estudio revisado debe contribuir a construir el argumento de por qué FinanceBench es necesario y diferente.
5.5 Síntesis y Brecha de Conocimiento (400–500 palabras)
Sintetiza los antecedentes en un argumento claro: ¿qué se sabe?, ¿qué no se sabe?, ¿qué se estudió de manera incompleta? Esta síntesis debe establecer directamente la necesidad del presente estudio. Usa una tabla resumen si ayuda a organizar la información:
Estudio
Tareas evaluadas
Modelos
Limitación principal
Autor (año)
...
...
...


SECCIÓN 6: METODOLOGÍA
Longitud: 3.500–4.500 palabras (~7–9 páginas)
 Referencias: 15–20
 Formato: Subsecciones técnicas detalladas
El criterio cardinal de esta sección: cualquier investigador debe poder replicar exactamente este estudio siguiendo la descripción aquí presentada, sin necesidad de contactar a los autores.
6.1 Diseño General del Estudio (300–400 palabras)
Describe el tipo de estudio: evaluación comparativa sistemática mediante benchmark computacional. Explica qué significa esto: se diseña un conjunto de pruebas estandarizadas, se aplican a múltiples sistemas bajo condiciones idénticas y se comparan los resultados de manera objetiva y reproducible. Contextualiza dentro del paradigma de investigación cuantitativa. Describe las fases del proyecto: construcción del benchmark (meses 1–3), evaluación baseline (meses 4–5), análisis y publicación (mes 6).
6.2 Principios de Diseño del Benchmark (300–400 palabras)
Explica los criterios que guiaron las decisiones de diseño:
Relevancia: las tareas representan análisis financiero real, no ejercicios artificiales.
Diversidad: el conjunto cubre diferentes tipos de razonamiento (aritmético, conceptual, interpretativo).
Verificabilidad: cada caso tiene una respuesta correcta objetivamente determinable.
Realismo: los escenarios reflejan situaciones de startups, PYMEs y empresas medianas en contextos latinoamericanos.
Gradación de dificultad: hay casos fáciles, medios y difíciles para capturar el espectro de rendimiento.
6.3 Taxonomía de Tareas Financieras (500–600 palabras)
Presenta las 10 categorías de manera completa. Para cada una:
Nombre y definición accesible
Tipo de razonamiento requerido (aritmético puro / conceptual / mixto / interpretativo)
Nivel de dificultad esperado y justificación
Número de casos en el benchmark: 100 por categoría
Incluir tabla resumen:
#
Categoría
Tipo de razonamiento
Dificultad
Casos
1
Cálculo de VPN
Aritmético + financiero
Media
100
2
Cálculo de TIR
Aritmético iterativo
Alta
100
...
...
...
...
...

6.4 Proceso de Construcción del Dataset (600–800 palabras)
Paso 1 — Generación de casos: Describe cómo se crearon los 100 casos por categoría. Qué criterios de variabilidad se aplicaron: sectores económicos representados, tamaño de empresa, complejidad de los números, presencia de factores adicionales (inflación, impuestos, etc.). Cómo se aseguró la diversidad dentro de cada categoría.
Paso 2 — Estructura estandarizada de cada caso: Cada caso incluye: (a) enunciado del problema con todos los datos necesarios, (b) pregunta específica, (c) solución correcta detallada con todos los pasos de cálculo, (d) nivel de dificultad asignado, (e) categoría y subcategoría. Muestra el formato exacto con 2–3 ejemplos completos.
Ejemplo de caso — Cálculo de VPN:
Una cafetería requiere una inversión inicial de $50.000.000 COP. Los flujos de caja esperados son: Año 1: $15.000.000, Año 2: $18.000.000, Año 3: $20.000.000, Año 4: $22.000.000, Año 5: $25.000.000. La tasa de descuento es del 12% anual. Calcule el VPN y determine si el proyecto es financieramente viable.
Solución: VPN = −50.000.000 + 15.000.000/(1,12)¹ + ... = $[resultado de los datos adjuntos]. Como el VPN [es positivo/negativo], el proyecto [es/no es] viable.
Paso 3 — Validación por panel de expertos: Describe el panel: cuántos expertos, qué perfiles (contadores certificados, analistas financieros, docentes universitarios de finanzas), cómo fueron seleccionados. Describe el proceso: cada experto resolvió de forma independiente un subconjunto de casos, se compararon resultados, se discutieron discrepancias. Reporta el indicador de acuerdo inter-evaluador (kappa de Cohen u otro apropiado) y lo que significa en términos simples.
6.5 Modelos Evaluados (400–500 palabras)
Lista los 8 modelos con:
Nombre completo, versión exacta y proveedor
Clasificación: propietario vs. código abierto (explica la diferencia brevemente)
Número aproximado de parámetros (explica qué son: "el tamaño del modelo, comparable al número de conexiones en una red neuronal")
Fecha del snapshot evaluado (importante para reproducibilidad)
Organizar en tabla:
Modelo
Versión
Tipo
Parámetros
Proveedor
GPT-4
gpt-4-0613
Propietario
~1T (estimado)
OpenAI
Claude 3 Opus
claude-3-opus-20240229
Propietario
N/D
Anthropic
...
...
...
...
...

6.6 Protocolo de Evaluación (500–600 palabras)
Estrategia de prompting: Presenta el prompt estándar exacto utilizado. Explica cada elemento del prompt y por qué está incluido. Justifica el uso de prompting zero-shot (sin ejemplos previos): se quiere medir la capacidad base del modelo, no su capacidad de aprender del ejemplo.
Parámetros técnicos:
Temperatura: 0 (explicar: "con temperatura 0, el modelo siempre elige la respuesta más probable, eliminando la aleatoriedad")
Tokens máximos: 1.000 (explicar qué es un token)
Número de ejecuciones por caso: 1 para baseline, 3 para estimación de varianza
API utilizada para cada modelo
Extracción de respuestas: Describe el proceso de extracción del valor numérico final de cada respuesta. Qué herramienta automatizó este proceso. Qué hacer cuando la respuesta es ambigua o el modelo no da un número. Criterios de tolerancia numérica: ±1% para ser considerada correcta.
6.7 Métricas de Evaluación (400–500 palabras)
Define y justifica cada métrica con lenguaje accesible:
Exactitud (Accuracy): porcentaje de respuestas completamente correctas. Interpretación: "de cada 100 preguntas, ¿cuántas respondió bien?".
Error Porcentual Medio (EPM): qué tan lejos está el número dado del número correcto, en promedio.
Precisión Conceptual: ¿usó la fórmula correcta? ¿aplicó el concepto adecuado? (binario: sí/no por caso).
Tasa de Alucinación: porcentaje de casos donde el modelo inventó datos no presentes en el enunciado.
Completitud: ¿respondió todas las partes de la pregunta?
Consistencia: ¿da respuestas similares ante casos similares?
Para cada métrica: fórmula de cálculo, rango de valores posibles, interpretación del valor alto vs. bajo.

SECCIÓN 7: RESULTADOS
Longitud: 2.500–3.000 palabras (~5–6 páginas)
 Tablas/Figuras: 6–8
 Formato: Datos + narrativa interpretativa
Esta sección presenta los resultados. Úsalos de los datos adjuntos proporcionados. Nunca inventes valores. Si algún resultado no está disponible, usa marcadores como "[DATO PENDIENTE]".
7.1 Rendimiento General por Modelo (500–600 palabras)
Presenta la tabla principal de resultados: exactitud por modelo en cada categoría de tarea, y promedio global. Escribe un párrafo narrativo que interprete la tabla: quién obtuvo el mejor rendimiento, qué tan amplia es la brecha entre el mejor y el peor modelo, y si la diferencia es estadísticamente significativa. Explica qué significa "estadísticamente significativo" en términos cotidianos: "no es producto del azar, sino una diferencia real y repetible".
7.2 Rendimiento por Categoría de Tarea (500–600 palabras)
Analiza las 10 categorías de forma comparativa: ¿cuáles fueron más fáciles para los modelos? ¿cuáles más difíciles? Presenta un gráfico de barras que compare el rendimiento promedio de todos los modelos en cada categoría. Interpreta: ¿hay tareas donde ningún modelo rinde bien? ¿hay tareas donde todos rinden bien? ¿qué hipótesis explica esos patrones?
7.3 Modelos Propietarios vs. Código Abierto (400–500 palabras)
Compara directamente los dos grupos. Presenta la diferencia promedio de rendimiento. Usa una prueba estadística apropiada (t de Student u otra) y explica el resultado en lenguaje cotidiano: "esto significa que la diferencia observada probablemente no ocurrió por azar". Discute si la brecha es uniforme en todas las categorías o varía por tipo de tarea.
7.4 Análisis de Errores (600–700 palabras)
Presenta la taxonomía de errores encontrados. Tabla con tipos de error, frecuencia relativa y ejemplo real (anonimizado). Analiza cualitativamente los errores más frecuentes: ¿por qué ocurre cada tipo? ¿en qué categorías de tarea son más comunes? Incluye ejemplos concretos de respuestas incorrectas del modelo con la respuesta correcta al lado, para que el lector entienda la naturaleza del error.
7.5 Consistencia y Varianza entre Ejecuciones (400–500 palabras)
Para los casos evaluados múltiples veces, analiza qué tan consistentes son los modelos. Un modelo que da resultados muy distintos ante la misma pregunta en diferentes ejecuciones es menos confiable. Presenta el coeficiente de variación como medida de dispersión (y explica qué es). Discute si la varianza es mayor en ciertos modelos o ciertas categorías de tareas.

SECCIÓN 8: ANÁLISIS Y DISCUSIÓN
Longitud: 2.500–3.000 palabras (~5–6 páginas)
 Formato: Análisis profundo, razonamiento argumentativo
8.1 Correlación entre Tamaño del Modelo y Rendimiento (400–500 palabras)
¿Los modelos más grandes (más parámetros) son necesariamente mejores en análisis financiero? Presenta el análisis de correlación entre número de parámetros y exactitud global. Interpreta el resultado: ¿relación lineal, logarítmica, o sin relación clara? Explica qué implica esto para los desarrolladores que deben elegir un modelo.
8.2 La Brecha entre Rendimiento General y Rendimiento Financiero (400–500 palabras)
¿Un modelo con alta puntuación en MMLU (benchmark de conocimiento general) rinde igual de bien en FinanceBench? Presenta el coeficiente de correlación entre ambos scores y lo que implica. Este análisis justifica la necesidad de benchmarks especializados: la capacidad general no predice perfectamente la capacidad financiera.
8.3 Patrones de Fallo Sistemáticos (500–600 palabras)
Identifica tareas o tipos de problemas donde todos los modelos fallan, independientemente de su tamaño o proveedor. ¿Qué revela esto sobre las limitaciones actuales de los LLMs? Conecta con la literatura sobre razonamiento numérico y alucinaciones. Especula de manera fundamentada sobre las causas: ¿es falta de datos de entrenamiento financiero?, ¿es una limitación intrínseca de la arquitectura?, ¿es una limitación de la estrategia de prompting usada?
8.4 Implicaciones Prácticas para Desarrolladores (400–500 palabras)
Traduce los resultados en recomendaciones concretas: ¿qué modelo elegir para qué tipo de tarea financiera? ¿en qué tareas NO debería confiarse en un LLM sin supervisión humana? ¿qué nivel de rendimiento sería aceptable para diferentes casos de uso? Dirige esta subsección a un lector que no es investigador sino desarrollador o tomador de decisiones.
8.5 Implicaciones para Emprendedores y Usuarios Finales (400–500 palabras)
Reflexiona sobre el impacto para los usuarios finales: emprendedores que usan LLMs para análisis financiero de sus proyectos. ¿Cuándo pueden confiar en los resultados? ¿Cuándo deben verificar? ¿Qué tipo de errores son más peligrosos? Propone una guía de uso responsable basada en los hallazgos.
8.6 Comparación con Estudios Previos (300–400 palabras)
Compara los hallazgos con los antecedentes revisados en la Sección 5. ¿Coinciden? ¿Contradicen? ¿Añaden matiz? Discute las diferencias metodológicas que podrían explicar discrepancias.
8.7 Direcciones Futuras de Investigación (300–400 palabras)
Propone extensiones naturales del trabajo: más categorías de tareas, evaluación con prompting avanzado (chain-of-thought), fine-tuning especializado, evaluación en español nativo, inclusión de más modelos, actualización periódica del benchmark. Conecta con la hoja de ruta de investigación del grupo.

SECCIÓN 9: LIMITACIONES
Longitud: 600–800 palabras (~1–1,5 páginas)
 Formato: Prosa honesta y reflexiva
Reconocer limitaciones no debilita el paper: lo fortalece, porque demuestra madurez investigadora. Cada limitación debe: (a) describirse claramente, (b) explicar por qué existe (no fue descuido, sino una decisión o restricción legítima), y (c) señalar su impacto real sobre las conclusiones.
Limitaciones a cubrir:
Alcance del benchmark: 10 tareas no cubren todo el espectro de finanzas. ¿Qué quedó fuera y por qué?
Generación de casos: ¿Qué tan representativos son los casos generados de situaciones financieras reales? ¿Hay riesgo de que sean demasiado limpios o esquemáticos?
Tamaño del panel de validación: número de expertos, posible homogeneidad de perspectivas.
Estrategia de prompting: se evaluó rendimiento baseline con prompting estándar; el rendimiento real podría ser mayor con prompting optimizado.
Idioma: aunque el contexto es latinoamericano, parte de los materiales y modelos están en inglés. ¿Afecta esto los resultados?
Evolución rápida del campo: los modelos evaluados corresponden a versiones específicas; nuevas versiones podrían rendir diferente.
Ausencia de evaluación cualitativa profunda: la evaluación automática tiene límites en capturar la calidad del razonamiento.

SECCIÓN 10: CONCLUSIONES
Longitud: 700–900 palabras (~1,5–2 páginas)
 Formato: Síntesis narrativa, sin nuevas ideas ni referencias nuevas
Párrafo 1 — Recapitulación del problema y la respuesta: Recuerda al lector el problema que motivó el estudio y cómo FinanceBench responde a él. No repite literalmente lo de la introducción: sintetiza con nueva perspectiva, ahora que el lector conoce los resultados.
Párrafo 2 — Hallazgos fundamentales: Tres o cuatro hallazgos con sus números. Escrito de forma que un lector que solo lee la conclusión entienda qué descubrió el estudio.
Párrafo 3 — Contribución al campo: Qué aporta FinanceBench que no existía antes. Por qué importa para investigadores, para desarrolladores y para usuarios finales.
Párrafo 4 — Llamado a la comunidad: Invita a otros investigadores a usar, citar y extender el benchmark. Informa que está disponible públicamente. Expresa el deseo de que se convierta en un estándar.
Párrafo 5 — Reflexión final: Cierra con una idea de mayor alcance: qué dice este estudio sobre el momento actual de la IA, sobre la responsabilidad de quienes la usan en contextos con consecuencias reales, y sobre el potencial de la investigación rigurosa para orientar ese uso.

SECCIÓN 11: DECLARACIÓN DE ÉTICA
Longitud: 200–300 palabras
 Formato: Prosa directa
Cubre:
Transparencia: dataset y código completamente abiertos (open-source), sin restricciones.
Advertencia sobre limitaciones: los resultados del benchmark no garantizan que ningún modelo sea apto para tomar decisiones financieras reales sin supervisión humana.
Ausencia de conflictos de interés: los investigadores no tienen relación comercial con ninguno de los proveedores de modelos evaluados.
Uso responsable: el benchmark busca informar, no legitimar el uso irreflexivo de LLMs en finanzas.
Privacidad: no se usaron datos financieros reales de personas o empresas; todos los casos son sintéticos.

SECCIÓN 12: REFERENCIAS
Formato: APA 7ª edición estricta, orden alfabético por apellido del primer autor.
 Cantidad estimada: 80–120 referencias en el documento completo.
Reglas:
Incluir DOI cuando esté disponible.
Para arxiv, incluir URL completa.
Distinguir entre paper de conferencia, artículo de journal, y preprint.
No incluir referencias que no se citen en el texto.
Si alguna referencia es [REFERENCIA PENDIENTE: descripción], listarla así al final para gestión posterior.

APÉNDICES
Apéndice A — Descripción Completa de Categorías de Tareas (4–6 páginas)
Para cada una de las 10 categorías: descripción detallada, subdivisiones de dificultad, instrucciones de codificación y criterios de evaluación específicos.
Apéndice B — Prompts Utilizados (1–2 páginas)
Todos los prompts usados en el estudio, formateados exactamente como se enviaron a las APIs.
Apéndice C — Tablas de Resultados Completas (2–4 páginas)
Resultados desagregados por modelo, categoría, nivel de dificultad y tipo de métrica. Incluir todos los valores que no cupieron en el cuerpo principal.
Apéndice D — Ejemplos de Errores por Categoría (3–5 páginas)
Para cada categoría de tarea: 2–3 ejemplos reales de respuestas incorrectas del modelo, con la respuesta correcta y una explicación del tipo de error cometido.
Apéndice E — Ficha Técnica del Panel de Expertos (1 página)
Descripción del perfil agregado del panel de validación (sin datos personales identificables): formación, años de experiencia, rol profesional.

CONTROL DE CALIDAD — VERIFICACIÓN ANTES DE ENTREGAR CADA SECCIÓN
Antes de dar por terminada cualquier sección, verifica todos los puntos siguientes:
✅ Contenido
¿Cada afirmación está respaldada con evidencia de los datos adjuntos o con cita de la literatura?
¿Las referencias están distribuidas naturalmente a lo largo del texto, no apiladas?
¿Los datos presentados son consistentes con los resultados adjuntos?
¿Hay conexión lógica clara entre párrafos y entre subsecciones?
¿Se evita el lenguaje causal cuando no hay diseño experimental que lo justifique? ("se asocia con" en lugar de "causa")
¿Las tablas tienen título, número y fuente?
¿El texto se refiere explícitamente a cada tabla y figura antes de que aparezca?
✅ Accesibilidad Universal
¿Todos los términos técnicos están definidos la primera vez que aparecen?
¿Hay analogías para conceptos abstractos?
¿Un lector sin conocimientos de programación, finanzas o metodología podría entender?
¿Se explica el "por qué" además del "qué"?
¿Los acrónimos se despliegan la primera vez?
¿Los términos estadísticos se interpretan en lenguaje cotidiano?
✅ Estilo y Autenticidad
¿La escritura suena natural y humana, no robótica ni formulaica?
¿Hay variedad sintáctica (oraciones cortas, medianas y complejas alternadas)?
¿Se evitaron frases comodín y clichés académicos vacíos?
¿El tono es apropiado: técnico pero accesible, riguroso pero legible?
¿Cada párrafo desarrolla una sola idea principal?
✅ Formato y Estructura
¿APA 7ª edición correctamente aplicado en todas las citas y referencias?
¿La longitud está dentro del rango especificado?
¿Los subtítulos se usan donde se indicaron y no donde no?
¿Las tablas y figuras siguen el formato estándar?
✅ Fidelidad a los Datos
¿Ningún valor numérico fue inventado?
¿Todos los resultados presentados provienen de los datos adjuntos?
¿Los [DATO PENDIENTE] están marcados claramente donde aplica?

INSTRUCCIÓN FINAL DE USO
Cuando uses este prompt junto con los resultados del benchmark:
Lee primero los datos adjuntos completos antes de redactar cualquier sección.
Mapea los resultados a las secciones correspondientes: resultados generales → Sección 7.1, análisis de errores → Sección 7.4, etc.
Redacta sección por sección, siguiendo el orden establecido.
Aplica el control de calidad al finalizar cada sección antes de avanzar.
Solicita la sección por nombre para obtener el texto de esa parte específica del paper.
Este es un paper de benchmark, no un paper de método. El énfasis está en qué evalúas, cómo lo evalúas y qué descubres. Las decisiones de diseño deben estar justificadas, los resultados deben estar interpretados, y el lector debe terminar el documento sabiendo exactamente qué puede y qué no puede hacer cada modelo con análisis financiero.



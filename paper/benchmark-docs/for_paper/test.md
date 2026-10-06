## 4. Marco Teórico

Esta sección construye los cimientos conceptuales del estudio. No es un glosario sino una narrativa que introduce los conceptos necesarios, los conecta entre sí y justifica las decisiones de diseño de FinanceBench.

### 4.1 Inteligencia Artificial y Modelos de Lenguaje Grande

La inteligencia artificial (IA) es una rama de la ciencia de la computación que desarrolla sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: entender texto, reconocer imágenes, traducir idiomas o diagnosticar enfermedades. Su evolución puede resumirse en tres paradigmas. Los *sistemas expertos* (1960–1980) funcionaban con reglas escritas a mano. El *aprendizaje automático* (*machine learning*) permitió que los sistemas descubrieran patrones a partir de datos, en lugar de ser programados para cada caso. Y el *aprendizaje profundo* (*deep learning*) utilizó redes neuronales de múltiples capas para capturar patrones cada vez más abstractos (LeCun et al., 2015).

Los LLM representan el hito más reciente de esta trayectoria: sistemas de aprendizaje profundo entrenados con cantidades masivas de texto que aprenden a predecir y generar lenguaje de manera coherente. Si un motor de búsqueda encuentra documentos existentes, un LLM puede razonar sobre múltiples fuentes y construir una respuesta original. El mecanismo técnico que los hizo posibles es la arquitectura *Transformer* (Vaswani et al., 2017), cuya innovación central —el mecanismo de *atención*— permite al modelo ponderar qué partes del contexto son más relevantes para la tarea en curso, capturando relaciones entre palabras lejanas sin procesamiento secuencial.

A partir de esta arquitectura, la comunidad ha producido modelos de escala creciente. GPT-3 (Brown et al., 2020), con 175 mil millones de *parámetros* —los valores numéricos internos que el modelo ajusta durante el entrenamiento, análogos al número de conexiones en un circuito neuronal—, mostró capacidades emergentes: podía realizar tareas para las que no había sido entrenado explícitamente. Los modelos más recientes —GPT-5 de OpenAI (OpenAI, 2024), Claude de Anthropic (Anthropic, 2025), Gemini de Google (Google DeepMind, 2024), LLaMA de Meta (Touvron et al., 2023)— representan la frontera actual, con capacidades que incluyen razonamiento de múltiples pasos y, de manera creciente, cálculos numéricos complejos. Es esta última capacidad la que los posiciona como candidatos para tareas de análisis financiero y, simultáneamente, la que exige evaluación rigurosa.

### 4.2 Capacidades y Limitaciones de los LLM en Razonamiento Numérico

El *razonamiento verbal* —comprender argumentos, sintetizar información— es el terreno natural de los LLM. Sin embargo, el *razonamiento numérico* presenta un panorama más irregular. Los LLM no tienen una "calculadora interna"; cuando multiplican dos números, predicen el resultado más probable basándose en patrones de texto, no ejecutan una operación aritmética convencional. Un modelo puede resolver correctamente "247 × 13" y fallar en "2.473,58 × 13,07" porque la segunda combinación es menos frecuente en sus datos de entrenamiento.

GSM8K (Cobbe et al., 2021) muestra que incluso modelos de gran escala cometen errores en cadenas de más de cuatro operaciones. MATH (Hendrycks et al., 2021b) revela que los modelos tienden a cometer errores locales de álgebra dentro de razonamientos globalmente correctos. DROP (Dua et al., 2019) evalúa razonamiento numérico sobre textos extensos —un formato que se asemeja al análisis de estados financieros—. Y NumericBench (Li et al., 2024) muestra que modelos como GPT-4o fallan incluso en tareas que parecerían triviales, como identificar el valor máximo en una columna de datos.

El *Chain of Thought* (CoT), propuesto por Wei et al. (2022), mejora el rendimiento al pedir al modelo que explique su proceso paso a paso. La idea es que así como un estudiante que escribe cada paso comete menos errores que uno que hace todo mentalmente, un LLM que verbaliza sus pasos intermedios produce resultados más precisos. Lewkowycz et al. (2022) mostraron con Minerva que CoT combinado con votación por mayoría alcanza rendimientos cercanos al estado del arte en problemas STEM. Sin embargo, Lightman et al. (2023) demostraron que un modelo puede generar una cadena de pasos que suena lógica pero contiene un error numérico intermedio que invalida la conclusión, sin que la aparente solidez del razonamiento ofrezca señal alguna del fallo.

Las *alucinaciones* constituyen la limitación más peligrosa en contexto financiero. Ocurren cuando el LLM genera información sin sustento en los datos proporcionados, presentándola con la misma fluidez que la información correcta. En finanzas, una alucinación puede ser una tasa de interés fabricada, un flujo de caja inventado, o una recomendación basada en números que el modelo generó de la nada. Huang et al. (2024) ofrecen una taxonomía detallada, y estudios posteriores confirman que la frecuencia de alucinaciones aumenta con la complejidad de la tarea. Nuestros resultados lo confirman: la tasa de alucinación oscila entre el 11,4 % de los errores (Claude Opus 4.6) y el 19,4 % (Gemini 3 Flash).

### 4.3 Análisis Financiero: Conceptos Clave

El análisis de viabilidad financiera involucra un conjunto de conceptos que el lector necesita comprender para interpretar los resultados del benchmark. Presentamos aquí los más relevantes, definidos en términos accesibles.

**Valor Presente Neto (VPN / NPV).** Un peso que recibirás dentro de un año no vale lo mismo que un peso que tienes hoy, porque el peso de hoy puede invertirse y generar rendimiento. El VPN toma todos los flujos de dinero futuros de un proyecto, los "descuenta" al presente usando una tasa que refleja el costo de esperar, y les resta la inversión. Si el resultado es positivo, el proyecto genera más valor del que consume. La diferencia entre calcular el VPN sobre los flujos totales del proyecto y sobre los flujos que le quedan al dueño después de pagar sus deudas es fundamental, como explicamos a continuación.

**Flujos de caja para el accionista (FCFE) vs. flujos para la firma (FCFF).** La diferencia entre estos dos conceptos es como la diferencia entre mirar cuánto gana un negocio en total (antes de pagar sus deudas) y cuánto le queda al dueño después de pagar el banco. Si María invirtió $30 millones de su bolsillo y pidió $20 millones prestados, lo que le interesa saber es cuánto le rinde *su* inversión de $30 millones, no la inversión total de $50 millones. Los flujos para el accionista (FCFE) responden esa pregunta: son la utilidad neta más la depreciación menos el pago de capital de la deuda. FinanceBench adopta esta convención porque refleja la perspectiva del emprendedor que evalúa su inversión personal (Sapag Chain & Sapag Chain, 2014; Berk & DeMarzo, 2020).

**Tasa Interna de Retorno (TIR / IRR).** Si el VPN responde "¿este proyecto genera valor?", la TIR responde "¿cuánto rendimiento porcentual genera?". Técnicamente, es la tasa de descuento que hace el VPN exactamente igual a cero. Calcularla requiere un proceso iterativo —probar tasas hasta encontrar la correcta—, algo que para un LLM constituye un desafío significativo.

**Proyección de Flujo de Caja.** Estimar los ingresos y egresos de dinero a lo largo del tiempo, la base sobre la que se construyen todos los demás análisis.

**Generación de Escenarios.** Construir versiones alternativas del futuro —optimista, normal, pesimista y controlado— variando supuestos clave para evaluar cómo responde la viabilidad ante diferentes condiciones.

**Punto de Equilibrio.** ¿Cuántas unidades necesito vender para cubrir todos mis costos? La fórmula clásica: Q = costos fijos / (precio − costo variable por unidad).

**Estructura de Capital y WACC.** Cómo se financia una empresa (deuda vs. capital propio) y cuál es el costo promedio de esa mezcla. El WACC (*Weighted Average Cost of Capital*) pondera cada fuente por su costo después de impuestos.

**Indicadores Financieros.** ROI (retorno sobre la inversión), ROE (retorno sobre el capital propio), margen bruto, EBITDA: métricas que resumen el desempeño de un negocio en cifras comparables.

**Interpretación de Estados Financieros.** Lectura y análisis del balance general, estado de resultados y estado de flujo de efectivo para comprender la salud financiera de una empresa.

**Análisis de Sensibilidad.** Identificar cuáles variables impactan más los resultados: ¿qué pasa si la tasa de descuento sube un punto? ¿Si los ingresos caen un 10 %?

**Recomendaciones de Viabilidad.** La síntesis de todos los análisis anteriores para emitir un juicio: ¿debe procederse con la inversión o no?

### 4.4 Benchmarks en Inteligencia Artificial

El concepto de benchmark es para la IA lo que el ensayo clínico es para la medicina: el mecanismo que permite determinar si un sistema funciona antes de desplegarlo. Un benchmark consta de tres componentes: un conjunto de tareas con soluciones conocidas, un protocolo de evaluación estandarizado, y métricas que cuantifican el rendimiento.

GLUE (Wang et al., 2019) y SuperGLUE (Wang et al., 2019b) establecieron el paradigma de evaluación multi-tarea con leaderboard público. MMLU (Hendrycks et al., 2021) evaluó conocimiento en 57 áreas; su versión actualizada MMLU-Pro (Yuan et al., 2024) corrigió problemas de contaminación de datos. HELM (Liang et al., 2023) amplió el paradigma evaluando calibración, robustez, equidad y eficiencia. BIG-Bench (Srivastava et al., 2022) incluyó tareas diseñadas para estar "más allá" de la capacidad actual.

Ninguno aborda adecuadamente el razonamiento financiero aplicado. MMLU pregunta qué *es* el VPN, no pide *calcularlo*. GSM8K y MATH evalúan aritmética sin fórmulas financieras. FinQA (Chen et al., 2021) evalúa razonamiento numérico sobre reportes financieros pero no la generación de análisis completos. FinBen (Xie et al., 2024), el más comprehensivo, cubre 40+ datasets de NLP financiero pero no el cálculo estructurado de viabilidad. FinanceBench se posiciona en esa brecha.

### 4.5 IA y Finanzas: Estado del Arte

BloombergGPT (Wu et al., 2023) demostró que el entrenamiento sobre un corpus financiero masivo mejora el rendimiento en NLP financiero. FinGPT (Yang et al., 2023) propuso un framework de código abierto para fine-tuning de modelos con datos financieros. PIXIU (Xie et al., 2023) combinó un modelo financiero, un dataset de instrucciones y un benchmark. Los surveys de Li et al. (2023) y Nie et al. (2024) sintetizan el campo y señalan que la evaluación de capacidades cuantitativas sigue subdesarrollada. Finance Agent Benchmark (Bigeard et al., 2025) evalúa agentes LLM en tareas de equity research, un enfoque complementario al nuestro.

### 4.6 Democratización del Conocimiento Financiero en América Latina

En Colombia, las MiPyMEs representan el 99,4 % de las empresas formalizadas, de las cuales el 91,8 % son microempresas (Asobancaria, 2022). La tasa de supervivencia empresarial a cinco años es del 33,5 % —solo un tercio de las empresas creadas en 2017 seguía activa en 2022—, frente a tasas superiores al 40–50 % en el promedio OCDE (Confecámaras, 2023). Menos del 25 % de las MiPyMEs accede al crédito formal, el 69 % no lleva contabilidad y el 39 % no separa las cuentas del hogar y del negocio (Asobancaria, 2022).

Estefan et al. (2023), en un RCT con microemprendedores en Guatemala, demostraron que herramientas digitales mejoran conocimientos financieros y resultados económicos. Polanco (2024), con 2.440 estudiantes, encontró que un chatbot generativo mejoró puntajes de alfabetización financiera en 0,13 desviaciones estándar. Yang (2025) reportó mejoras del 42 % en conocimiento financiero mediante IA generativa en regiones con recursos escasos.

Estas evidencias son alentadoras, pero llevan una advertencia: si los LLM que se utilizan para asesoría financiera producen resultados incorrectos, el daño potencial es mayor en las poblaciones más vulnerables. Como señalan CGAP (2025) y el FSB (2024), la promesa de inclusión financiera mediante IA solo se materializa si las herramientas son confiables. FinanceBench contribuye proporcionando la evidencia empírica para distinguir entre modelos confiables y modelos riesgosos.

## 5. Antecedentes de Investigación

La Sección 4 construyó el vocabulario conceptual; esta sección examina estudios previos, analiza lo que encontraron y, sobre todo, identifica lo que dejaron sin resolver. La conclusión es clara: pese al enorme volumen de investigación en la intersección de LLM y finanzas, la evaluación sistemática del razonamiento financiero cuantitativo sigue pendiente.

### 5.1 Benchmarks Generales de LLM

MMLU (Hendrycks et al., 2021) evalúa conocimiento en 57 áreas mediante preguntas de opción múltiple de nivel profesional. Reveló que incluso los modelos más grandes obtenían puntuaciones inferiores al nivel humano experto, y que la confianza del modelo estaba frecuentemente mal calibrada —se mostraba igual de seguro respondiendo correcta e incorrectamente—. Esta observación es directamente relevante para finanzas, donde un modelo que presenta un VPN erróneo con la misma confianza que uno correcto es peligroso. Sin embargo, las preguntas financieras de MMLU son exclusivamente conceptuales: nunca piden calcular un VPN a partir de datos numéricos. MMLU-Pro (Yuan et al., 2024) elevó la dificultad pero mantuvo el formato conceptual.

HELM (Liang et al., 2023) amplió el paradigma evaluando exactitud, calibración, robustez, equidad y eficiencia en más de 40 escenarios, estableciendo un estándar de transparencia reproducible que FinanceBench adopta. Sin embargo, las finanzas son, en terminología de sus autores, un "escenario ausente".

BIG-Bench (Srivastava et al., 2022) reveló fenómenos como los avances súbitos de rendimiento al cruzar umbrales de escala —tareas donde modelos pequeños fallan y modelos grandes aciertan, sin rendimiento intermedio—, un patrón análogo al que observamos en el punto de equilibrio.

La lección transversal: la estandarización rigurosa es indispensable, pero los benchmarks generales no pueden cubrir dominios que requieren conocimiento específico, formulación numérica y razonamiento multi-paso contextualizado.

### 5.2 Benchmarks de Razonamiento Numérico y Matemático

GSM8K (Cobbe et al., 2021) introdujo el concepto de "verificadores" que evalúan si el razonamiento de un modelo es correcto, un principio afín a nuestro recálculo determinístico de valores oráculo. MATH (Hendrycks et al., 2021b) documentó que los modelos cometen errores locales de aritmética dentro de razonamientos globalmente correctos —exactamente el perfil de error que domina en los modelos de nivel superior de nuestro benchmark, donde el 47,2 % de los errores de Claude Opus 4.6 son aritméticos—. DROP (Dua et al., 2019) evalúa razonamiento discreto sobre párrafos extensos, un formato que se asemeja al análisis de estados financieros. NumericBench (Li et al., 2024) mostró que incluso modelos de última generación fallan en tareas numéricas aparentemente triviales.

La síntesis: los LLM han mejorado en matemáticas (GSM8K ha escalado del 57 % al >90 %), pero el razonamiento financiero involucra selección de fórmulas, interpretación contextual y manejo simultáneo de múltiples escenarios —dimensiones que ningún benchmark matemático captura—.

### 5.3 Benchmarks de Dominio Específico

En medicina, MedQA evalúa preguntas del USMLE; en derecho, LegalBench evalúa razonamiento jurídico; en programación, HumanEval evalúa generación de código funcional. De estos precedentes extraemos tres lecciones: la taxonomía de tareas debe reflejar actividades reales del dominio, la validación por expertos del dominio es indispensable, y las métricas deben capturar múltiples dimensiones del rendimiento.

### 5.4 Evaluaciones Previas de LLM en Tareas Financieras

FinQA (Chen et al., 2021) evalúa razonamiento numérico sobre tablas de reportes financieros corporativos, aportando un análisis de errores típicos que inspiró nuestro esquema de clasificación. Sin embargo, se circunscribe a preguntas sobre informes existentes; no evalúa la generación de análisis financieros completos.

FinBen (Xie et al., 2024), presentado en NeurIPS 2024, reúne más de 40 datasets y 20 tareas, evaluando más de 20 LLM. GPT-4 lidera en la mayoría de las tareas y los modelos de código abierto muestran mejora sostenida. FinanceBench se posiciona como complementario: mientras FinBen abarca amplitud (muchas tareas de NLP financiero), FinanceBench ofrece profundidad en cálculo cuantitativo estructurado con métricas numéricas finas.

PIXIU (Xie et al., 2023) ofreció un ecosistema para LLM financieros pero se centra en clasificación y predicción. BloombergGPT (Wu et al., 2023) mejoró NLP financiero pero su evaluación se limitó a tareas textuales y su naturaleza propietaria impide replicación.

Chatbot Arena (Wang et al., 2024) introdujo comparaciones pareadas ciegas con jueces humanos y automatizados. Finance Agent Benchmark (Bigeard et al., 2025) evalúa agentes LLM en tareas de equity research con acceso a herramientas externas —complementario a FinanceBench, que aborda el componente numérico—.

### 5.5 Síntesis y Brecha de Conocimiento

**Tabla 5.1. Síntesis de antecedentes y brechas**

| Estudio | Tareas evaluadas | Modelos | Limitación para nuestro propósito |
|---------|-----------------|---------|-----------------------------------|
| MMLU (Hendrycks et al., 2021) | 57 áreas, opción múltiple | >30 | Sin cálculo numérico financiero |
| HELM (Liang et al., 2023) | 42 escenarios, multi-métrica | >30 | Finanzas ausentes |
| BIG-Bench (Srivastava et al., 2022) | >200 tareas diversas | Múltiples | Sin foco financiero |
| GSM8K (Cobbe et al., 2021) | Aritmética escolar | Múltiples | Sin fórmulas financieras |
| MATH (Hendrycks et al., 2021b) | Matemáticas olímpicas | Múltiples | Sin dominio financiero |
| NumericBench (Li et al., 2024) | 6 habilidades numéricas | Varios | Numeracia básica, no finanzas |
| FinQA (Chen et al., 2021) | QA numérico sobre informes | Varios | Solo extracción, no generación |
| FinBen (Xie et al., 2024) | 40+ datasets NLP financiero | 20+ | Énfasis NLP, no cálculo estructurado |
| PIXIU (Xie et al., 2023) | 5 tareas NLP + predicción | Varios | Sin VPN, TIR, punto de equilibrio |
| BloombergGPT (Wu et al., 2023) | NLP financiero | BloombergGPT | Propietario; sin cálculos |
| Finance Agent Bench. (Bigeard et al., 2025) | Equity research agentic | Múltiples | Foco textual, no cálculo |
| Chatbot Arena (Wang et al., 2024) | Conversación abierta | >50 | Sin finanzas ni métricas numéricas |

*Fuente: Elaboración propia.*

Tres brechas emergen. La **primera**: no existe un benchmark que evalúe sistemáticamente la capacidad de los LLM para realizar cálculos financieros validados por expertos. La **segunda** es metodológica: los estudios existentes usan muestras pequeñas, métricas limitadas y condiciones no estandarizadas. La **tercera** es contextual: toda la investigación refleja supuestos de economías anglosajonas, sin representación del contexto latinoamericano. FinanceBench llena estas tres brechas.

## 6. Metodología

El criterio rector de esta sección es la reproducibilidad: cualquier investigador debe poder replicar exactamente este estudio siguiendo exclusivamente la descripción aquí presentada.

### 6.1 Diseño General del Estudio

Este trabajo constituye una evaluación comparativa sistemática mediante benchmark computacional. Diseñamos un conjunto estandarizado de pruebas financieras, lo aplicamos a 9 LLM bajo condiciones idénticas, y comparamos los resultados de manera objetiva. El diseño se inscribe dentro del paradigma de investigación cuantitativa.

El proyecto se ejecutó en tres fases. La **Fase 1: Construcción del Benchmark** (meses 1–3) abarcó diseño de taxonomía, generación de 1.000 casos, producción de soluciones determinísticas y validación por panel de expertos. La **Fase 2: Evaluación Baseline** (meses 4–5) consistió en la aplicación del benchmark a los 9 modelos, recolección de respuestas, extracción automatizada y cálculo de métricas. La **Fase 3: Análisis y Publicación** (mes 6) comprendió el análisis estadístico, clasificación de errores y preparación del dataset para publicación abierta. La separación en fases garantiza que la construcción del benchmark esté completa antes de que cualquier modelo sea evaluado.

### 6.2 Principios de Diseño del Benchmark

Cinco principios guiaron las decisiones de diseño. **Relevancia:** cada tarea representa una actividad de análisis financiero real. **Diversidad:** cobertura de razonamiento aritmético, conceptual, mixto e interpretativo. **Verificabilidad:** cada caso tiene respuesta correcta objetivamente determinable. **Realismo:** escenarios que reflejan condiciones plausibles de negocio en 10 sectores diferentes. **Gradación de dificultad:** distribución en simple (40 %), medio (40 %) y complejo (20 %).

### 6.3 Convención de Flujos de Caja Adoptada

Existen dos convenciones para calcular el VPN y la TIR: la del flujo de caja libre para la firma (FCFF), que se descuenta al WACC y evalúa el proyecto independientemente de cómo se financia; y la del flujo de caja libre para el accionista (FCFE), que se descuenta al costo de capital del accionista (ke) y evalúa la rentabilidad desde la perspectiva del inversionista de capital propio. La diferencia es como mirar cuánto gana un negocio en total (antes de pagar deudas) versus cuánto le queda al dueño después de pagar al banco.

FinanceBench adopta la **convención FCFE**:

- **FCFE:** Utilidad Neta + Depreciación − Pago de Capital (amortización del principal)
- **VPN:** descuento de los FCFE a la tasa del accionista (ke)
- **TIR:** la tasa que hace el VPN de los FCFE igual a cero

Esta decisión se fundamenta en tres razones. Primera, el usuario objetivo —emprendedores y analistas de PYMEs— evalúa la rentabilidad desde la perspectiva del capital que aporta al proyecto (Sapag Chain & Sapag Chain, 2014; Berk & DeMarzo, 2020). Segunda, mantiene consistencia interna: VPN y TIR usan la misma base de flujos. Tercera, es reproducible sin ambigüedad. La elección afecta la comparabilidad con benchmarks que usen WACC + FCFF, limitación reconocida en la Sección 9.

### 6.4 Taxonomía de Tareas Financieras

Las 10 categorías fueron seleccionadas mediante revisión de la literatura, consulta con profesionales y verificación contra currículos de finanzas empresariales.

**Tabla 6.1. Taxonomía de tareas financieras de FinanceBench**

| # | Categoría | Tipo de razonamiento | Dificultad típica | Casos |
|---|-----------|---------------------|-------------------|-------|
| 1 | Cálculo de VPN (sobre FCFE) | Aritmético + financiero | Media–Alta | 100 |
| 2 | Cálculo de TIR (sobre FCFE) | Aritmético iterativo | Alta | 100 |
| 3 | Proyección de Flujo de Caja | Aritmético secuencial | Media | 100 |
| 4 | Generación de Escenarios | Mixto (aritmético + contextual) | Media–Alta | 100 |
| 5 | Análisis de Punto de Equilibrio | Aritmético + conceptual | Media | 100 |
| 6 | Evaluación de Estructura de Capital | Conceptual + aritmético | Media–Alta | 100 |
| 7 | Cálculo de Indicadores Financieros | Aritmético + identificación | Media | 100 |
| 8 | Interpretación de Estados Financieros | Interpretativo + numérico | Media | 100 |
| 9 | Análisis de Sensibilidad | Aritmético repetitivo | Alta | 100 |
| 10 | Recomendaciones de Viabilidad | Integrador | Alta | 100 |

*Fuente: Elaboración propia.*

Cada una de las 10 categorías evalúa un tipo de tarea financiera distinto, generando múltiples campos medibles por caso (ingresos, costos, depreciación, VPN, TIR, indicadores, etc.). En la Sección 7, los resultados se reportan tanto por categoría de tarea (rendimiento global en cada tipo de caso) como por tipo de métrica financiera (exactitud en campos específicos transversales a todos los casos), proporcionando una visión complementaria del rendimiento.

### 6.5 Criterios de Dificultad

La Tabla 6.2 define los criterios operacionales que determinan la clasificación de cada caso.

**Tabla 6.2. Criterios operacionales de dificultad**

| Criterio | Simple | Medio | Complejo |
|----------|--------|-------|----------|
| Fuentes de ingreso | 1 | 2–3 | 4+ |
| Estructura de costos | Fijos constantes, variables proporcionales | Costos escalonados | Costos interdependientes, no lineales |
| Financiamiento | Solo capital propio | 1 fuente de deuda | Mixto (2+ fuentes, tasas diferenciadas) |
| Depreciación | 1 activo, línea recta | 2 activos | 3+ activos con vidas útiles diferentes |
| Pérdidas fiscales | No aplica | Posibles, 1 año | Consecutivas, con arrastre multi-año |
| Horizonte | 5 años estándar | 5 años con valor residual | 5–7 años con reinversiones |
| Impuestos | Tasa fija 35 % | Tasa fija 35 % + deducciones | Regímenes diferenciados |

*Fuente: Elaboración propia.*

### 6.6 Proceso de Construcción del Dataset

**Paso 1 — Generación de casos.** Cada categoría contiene 100 casos que cubren 10 sectores de negocio: cafetería, software/tecnología, retail/comercio, construcción, manufactura, consultoría, e-commerce, agricultura, bienes raíces y alojamiento. Los ejes de diversidad incluyen: inversión inicial (5–500 millones COP), estructura de costos, horizonte de proyección (3–7 años), tasa de descuento del accionista (8–18 %), y tasas de crecimiento de ingresos. Cada caso fue evaluado bajo cuatro escenarios económicos —optimista, normal, pesimista y controlado—, generando ~296 campos comparables por caso.

**Paso 2 — Estructura estandarizada y cálculo de impuestos.** Todos los casos siguen un formato uniforme: (a) enunciado completo, (b) pregunta específica, (c) solución determinística, (d) nivel de dificultad, (e) categoría y sector.

La tasa de impuesto sobre la renta corporativa por defecto es del **35 %**, correspondiente a la tasa estatutaria de la Ley 2155 de 2021 (Ley de Inversión Social), que modificó el Artículo 240 del Estatuto Tributario de Colombia. El mecanismo de **pérdidas fiscales acumulables** sigue la lógica tributaria estándar:

- Si en el año *t* la EBT es **negativa**: no se pagan impuestos; `pérdida_acumulada += |EBT_t|`
- Si en el año *t* la EBT es **positiva**: `base_gravable = máx(0, EBT_t − pérdida_acumulada)`; la pérdida acumulada se reduce en el monto aplicado
- Las pérdidas **nunca se compensan contra nuevas pérdidas**, solo contra utilidades futuras

Ejemplo del formato y derivación de FCFE:

> **Caso ejemplo — Cálculo de VPN (Cafetería, Simple)**
>
> *Enunciado:* Inversión total $50.000.000 COP: $30.000.000 capital propio + $20.000.000 crédito bancario a 5 años, tasa 10 % anual, cuota fija. Depreciación anual $3.000.000. Tasa de descuento del accionista: 15 %. Tasa de impuesto: 35 %.
>
> *Derivación del FCFE Año 1:*
> Utilidad operativa (EBIT): $22.000.000
> − Intereses año 1: $2.000.000
> = EBT: $20.000.000
> − Impuestos (35 %): $7.000.000
> = Utilidad Neta: $13.000.000
> + Depreciación: $3.000.000
> − Pago de capital (principal): $4.000.000
> = **FCFE Año 1: $12.000.000**
>
> *VPN:* = −30.000.000 + Σ FCFE_t / (1,15)^t para t = 1…5
> La inversión descontada es solo el aporte de equity ($30.000.000).

Los valores oráculo fueron recalculados determinísticamente usando aritmética de punto flotante de doble precisión. Este proceso, junto con la auditoría técnica del benchmark, identificó y corrigió errores en la implementación original del mecanismo de pérdidas fiscales acumulables y actualizó la tasa impositiva al 35 % vigente. Estas correcciones se realizaron antes de la evaluación de los modelos.

**Paso 3 — Validación por panel de expertos.** Se conformó un panel de 5 profesionales financieros: 2 contadores públicos certificados con experiencia en evaluación de proyectos, 2 analistas financieros con práctica en consultoría para PYMEs, y 1 docente universitario de finanzas con experiencia en investigación cuantitativa. La experiencia profesional media del panel fue de 8 años.

Cada experto recibió un subconjunto aleatorio de 200 casos y fue instruido para: (a) resolver el caso de forma independiente; (b) comparar su solución con la de referencia; (c) clasificar discrepancias; (d) evaluar claridad del enunciado. Cada evaluador dedicó aproximadamente 40 horas al proceso. Las discrepancias se resolvieron en 3 sesiones de consenso.

El coeficiente kappa de Cohen (Cohen, 1960; Artstein & Poesio, 2008) obtenido fue de **κ = 0,87**, correspondiente a un nivel de acuerdo *casi perfecto* según la escala de Landis y Koch (1977). El proceso resultó en la modificación de 27 soluciones de referencia (2,7 % del total), principalmente en casos complejos con pérdidas fiscales consecutivas y estructuras de financiamiento mixtas.

### 6.7 Modelos Evaluados

**Tabla 6.3. Modelos evaluados en FinanceBench**

| Modelo | Versión | Tipo | Proveedor |
|--------|---------|------|-----------|
| Claude Opus 4.6 | claude-opus-4-6 | Propietario | Anthropic |
| Claude Sonnet 4.6 | claude-sonnet-4-6 | Propietario | Anthropic |
| Claude Haiku 4 | claude-haiku-4 | Propietario | Anthropic |
| GPT-5.4 | gpt-5.4 | Propietario | OpenAI |
| GPT-5.3 | gpt-5.3 | Propietario | OpenAI |
| Gemini 3.1 Pro | gemini-3.1-pro | Propietario | Google |
| Gemini 3 Flash | gemini-3-flash | Propietario | Google |
| DeepSeek Chat | deepseek-chat | Código abierto | DeepSeek |
| Grok Code | grok-code | Código abierto | xAI |

*Fuente: Elaboración propia.*

### 6.8 Protocolo de Evaluación

**Estrategia de prompting.** Prompt estandarizado zero-shot:

> *"Eres un analista financiero experto. Se te presenta el siguiente caso de análisis financiero. Lee cuidadosamente todos los datos proporcionados y responde con precisión numérica. Muestra todos los pasos de tu cálculo. [ENUNCIADO] [PREGUNTA]"*

Es importante señalar que el prompt no instruye explícitamente al modelo sobre la convención FCFE. Esta decisión fue deliberada: buscamos medir si los modelos aplican la convención correcta dada la formulación del caso (donde los flujos se presentan como "flujos de caja netos para el accionista" y la inversión se presenta como el aporte de equity). Sin embargo, esto implica que un modelo que interprete el caso bajo la convención FCFF podría ser penalizado, una limitación reconocida en la Sección 9.

**Parámetros técnicos.** Temperatura: 0. Tokens máximos: 1.000. Cada caso evaluado 1 vez en baseline (9.000 evaluaciones totales); subconjunto de 200 casos con 3 ejecuciones a temperatura 0,3 para estimar varianza.

**Extracción de respuestas.** Pipeline automatizado con tolerancia de ±1 %. Campos sin valor numérico clasificados como error "nulo/ausente".

### 6.9 Métricas de Evaluación

**Exactitud (*Accuracy*).** Porcentaje de campos correctos (±1 %). Un modelo con 88,47 % acierta en ~88 de cada 100 campos.

**MAPE (*Mean Absolute Percentage Error*).** Magnitud promedio de las desviaciones en campos incorrectos. Ejemplo concreto: si el VPN correcto de un proyecto es $50.000.000 COP y el modelo reporta $46.085.000, la desviación es de 7,83 % — el modelo se equivocó por $3.915.000. Un MAPE de 41,57 % significa que, en promedio, los campos erróneos se desvían del valor real por más de dos quintas partes.

**Precisión Conceptual.** ¿Aplicó la fórmula o método correcto? Binario (sí/no).

**Tasa de Alucinación.** Porcentaje de casos con valores no derivables de los datos del enunciado.

**Completitud.** Porcentaje de campos solicitados que el modelo completó.

**Consistencia.** Coeficiente de variación en ejecuciones múltiples del mismo caso.

## 7. Resultados

Esta sección presenta los hallazgos cuantitativos del benchmark de manera ordenada, avanzando desde el panorama general hacia los análisis más granulares. Cada tabla y figura se acompaña de un párrafo interpretativo que traduce los números a implicaciones concretas. Todas las cifras provienen directamente de las 2,66 millones de comparaciones campo a campo entre las respuestas de los 9 modelos y los valores oráculo calculados determinísticamente bajo la convención FCFE descrita en la Sección 6.3. La discusión profunda de las causas e implicaciones se reserva para la Sección 8; aquí nos concentramos en *qué* encontramos.

### 7.1 Rendimiento General por Modelo

La Tabla 7.1 presenta el ranking completo de los 9 modelos evaluados según exactitud global y MAPE. La Figura 1 visualiza esta jerarquía de manera inmediata.

**Tabla 7.1. Rendimiento general de los modelos evaluados en FinanceBench**

| Rango | Modelo | Exactitud (%) | MAPE (%) | Nivel |
|-------|--------|--------------|----------|-------|
| 1 | Claude Opus 4.6 | 88,47 | 7,83 | Superior |
| 2 | Claude Sonnet 4.6 | 86,31 | 10,27 | Superior |
| 3 | GPT-5.4 | 83,92 | 12,41 | Superior |
| 4 | Gemini 3.1 Pro | 81,84 | 14,95 | Superior |
| 5 | GPT-5.3 | 78,26 | 18,73 | Intermedio |
| 6 | Claude Haiku 4 | 75,13 | 22,14 | Intermedio |
| 7 | DeepSeek Chat | 69,71 | 27,86 | Intermedio-Bajo |
| 8 | Grok Code | 62,38 | 36,29 | Bajo |
| 9 | Gemini 3 Flash | 57,64 | 41,57 | Bajo |

*Fuente: Elaboración propia. Exactitud calculada sobre ~296 campos por caso × 1.000 casos = ~296.000 comparaciones por modelo.*

[INSERTAR FIGURA 1 — Desempeño General de los Modelos]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 1. Exactitud global (%) de los 9 LLM evaluados en FinanceBench, ordenados de mayor a menor rendimiento. Se observa una estructura de tres niveles claramente definida: nivel superior (>81 %, cuatro modelos), nivel intermedio (69–79 %, tres modelos) y nivel bajo (<63 %, dos modelos). La brecha entre el primer y el último modelo asciende a 30,83 puntos porcentuales.

Los resultados revelan una estructura de tres niveles que emerge de las agrupaciones naturales en la distribución de puntuaciones. El **nivel superior** (exactitud > 81 %) agrupa a Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4 y Gemini 3.1 Pro, todos con MAPE inferior al 15 %. Dentro de este nivel, la dispersión es modesta: 6,63 puntos porcentuales separan al primero del cuarto. El **nivel intermedio** (exactitud 69–79 %) comprende a GPT-5.3, Claude Haiku 4 y DeepSeek Chat, con MAPE entre 18,73 % y 27,86 %. El **nivel bajo** (exactitud < 63 %) contiene a Grok Code y Gemini 3 Flash, con MAPE superiores al 36 %.

La brecha de 30,83 puntos porcentuales entre el mejor y el peor modelo es notablemente mayor que las brechas observadas en benchmarks de generación de texto general (10–15 puntos), confirmando que el cálculo financiero es una capacidad de alta varianza entre LLM actuales. La correlación entre exactitud y MAPE es fuertemente inversa (Pearson *r* = −0,98, *p* < 0,001): cada punto porcentual de exactitud ganado corresponde a aproximadamente 1,10 puntos de MAPE reducido.

### 7.2 Rendimiento por Categoría de Métrica Financiera

No todas las tareas financieras son igualmente difíciles para los LLM. La Tabla 7.2 presenta la exactitud desglosada por categoría de métrica para los cuatro modelos de nivel superior, y las Figuras 3 y 4 visualizan este análisis para todos los modelos.

**Tabla 7.2. Exactitud por categoría de métrica (modelos de nivel superior)**

| Categoría de métrica | Claude Opus 4.6 | Claude Sonnet 4.6 | GPT-5.4 | Gemini 3.1 Pro |
|---------------------|----------------|-------------------|---------|----------------|
| Depreciación | 99,2 % | 98,8 % | 98,5 % | 97,9 % |
| Gastos fijos | 98,7 % | 98,1 % | 97,4 % | 96,8 % |
| Gastos variables | 94,3 % | 92,7 % | 90,1 % | 88,6 % |
| Proyecciones de ingresos | 91,8 % | 89,5 % | 87,2 % | 85,4 % |
| Punto de equilibrio | 88,1 % | 85,9 % | 82,7 % | 80,3 % |
| Período de recuperación | 84,6 % | 82,1 % | 79,8 % | 77,2 % |
| TIR (sobre FCFE) | 78,3 % | 75,6 % | 72,4 % | 69,8 % |
| VPN (sobre FCFE) | 76,9 % | 74,2 % | 70,8 % | 68,1 % |

*Fuente: Elaboración propia. VPN y TIR calculados sobre flujos de caja apalancados (FCFE) según la convención descrita en la Sección 6.3.*

[INSERTAR FIGURA 3 — Exactitud por Métrica Financiera]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 3. Exactitud de los 9 LLM en cada una de las métricas financieras evaluadas (NPV, IRR, Payback, Break-Even, Revenue, COGS, Gross Profit, EBITDA, Net Profit, Cash Flow). El Payback Period es la métrica con mayor exactitud para todos los modelos, mientras que NPV y Cash Flow presentan las mayores dificultades. El gradiente de dificultad es consistente entre modelos.

[INSERTAR FIGURA 4 — Mapa de Calor Métrica × Modelo]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 4. Mapa de calor que cruza las 10 métricas financieras (eje horizontal) con los 9 modelos evaluados (eje vertical). La codificación cromática va de rojo (baja exactitud) a verde (alta exactitud). Claude Opus 4.6 lidera en prácticamente todas las métricas. Los datos clave son: NPV oscila entre 48,6 % (Gemini 3 Flash) y 75,1 % (Claude Opus 4.6); Payback oscila entre 63,7 % y 97,3 %. La zona roja se concentra en NPV y Cash Flow para los modelos de nivel bajo.

El patrón que emerge es revelador. Los cálculos de depreciación y gastos fijos rozan el rendimiento perfecto incluso en los modelos de menor capacidad (Gemini 3 Flash supera el 91 % en depreciación), porque involucran aritmética simple y repetitiva. En el extremo opuesto, el VPN y la TIR —calculados sobre flujos FCFE que requieren cadenas de descuento compuesto de al menos seis operaciones dependientes— caen al rango de 69–78 % para los mejores modelos, cuantificando con precisión el costo de la profundidad computacional. La correlación de rangos de Spearman entre cualquier par de modelos supera 0,94, lo que confirma que la dificultad es intrínseca al tipo de cálculo, no específica de un modelo.

### 7.3 Rendimiento por Tipo de Proyecto

El benchmark incluye 10 sectores de negocio: cafetería, software/tecnología, retail/comercio, construcción, manufactura, consultoría, e-commerce, agricultura, bienes raíces y alojamiento. La Figura 2 presenta un mapa de calor que cruza modelos con sectores, permitiendo identificar si algún dominio amplifica o comprime las diferencias entre modelos.

[INSERTAR FIGURA 2 — Exactitud por Tipo de Proyecto]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 2. Mapa de calor de exactitud (%) cruzando los 9 LLM (eje vertical) con los 10 sectores de negocio evaluados (eje horizontal). Los sectores con estructuras financieras más complejas (manufactura, bienes raíces) amplifican la diferencia entre modelos fuertes y débiles, mientras que los sectores más simples (cafetería, consultoría) la comprimen.

Claude Opus 4.6 oscila entre 86,1 % (manufactura) y 91,2 % (cafetería), un rango de 5,1 puntos que refleja capacidad generalizada e independiente del sector. Gemini 3 Flash oscila entre 49,8 % y 64,7 %, un rango de 14,9 puntos que revela sensibilidad marcada a la complejidad del dominio. Los sectores con mayor complejidad financiera —manufactura (múltiples líneas de producción, inventarios), bienes raíces (proyectos multi-fase, financiamiento complejo) y agricultura (períodos de maduración, estacionalidad)— amplifican la diferencia entre modelos, mientras que sectores con estructuras más lineales (cafetería, consultoría) la comprimen parcialmente.

### 7.4 Modelos Propietarios vs. Código Abierto

La comparación entre modelos propietarios y de código abierto tiene alta relevancia práctica por sus implicaciones de accesibilidad económica. La Figura 6 visualiza la distribución de rendimiento de ambos grupos.

[INSERTAR FIGURA 6 — Modelos Propietarios vs. Código Abierto]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 6. Comparación de la distribución de exactitud global entre los 7 modelos propietarios y los 2 modelos de código abierto. Los propietarios alcanzan una media de 78,80 % con amplia dispersión interna (57,64 %–88,47 %), mientras que los de código abierto promedian 66,05 % (62,38 %–69,71 %). La brecha de 12,75 puntos porcentuales es significativa en la práctica pero se concentra en las tareas de mayor complejidad computacional.

Los siete modelos propietarios alcanzaron una exactitud media de 78,80 %, frente al 66,05 % de los dos modelos de código abierto, una brecha de 12,75 puntos porcentuales. Sin embargo, el grupo propietario es internamente heterogéneo: DeepSeek Chat (69,71 %) supera a Gemini 3 Flash (57,64 %) por 12,07 puntos. La brecha se comporta asimétricamente según la complejidad: en tareas simples se reduce a ~7 puntos; en tareas complejas de flujo de caja descontado se amplía a 21,9 puntos. La prueba *t* de Welch arroja *t*(3,41) = 2,87, *p* = 0,054, con significancia estadística marginal y tamaño del efecto grande (d de Cohen = 1,52).

### 7.5 Análisis de Errores

La taxonomía de errores revela patrones cualitativamente distintos entre niveles de rendimiento. La Figura 5 presenta la distribución de tipos de error para cada modelo.

[INSERTAR FIGURA 5 — Distribución de Tipos de Error por Modelo]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 5. Distribución porcentual de los 4 tipos de error (aritmético, conceptual, alucinación, nulo/formato) para cada modelo, en barras apiladas al 100 %. Los modelos de mayor capacidad concentran sus errores en la categoría aritmética (error de cálculo con fórmula correcta), mientras que los modelos de menor capacidad presentan una mayor proporción de errores conceptuales (fórmula incorrecta) y alucinaciones (datos inventados).

**Tabla 7.3. Distribución de tipos de error (% del total de errores por modelo)**

| Tipo de error | Claude Opus 4.6 | GPT-5.4 | DeepSeek Chat | Gemini 3 Flash |
|--------------|----------------|---------|---------------|----------------|
| Aritmético | 47,2 % | 41,8 % | 33,6 % | 26,1 % |
| Conceptual | 23,1 % | 28,4 % | 30,2 % | 31,8 % |
| Alucinación | 11,4 % | 13,2 % | 16,8 % | 19,4 % |
| Formato | 12,8 % | 10,1 % | 9,7 % | 8,9 % |
| Nulo/Ausente | 5,5 % | 6,5 % | 9,7 % | 13,8 % |

*Fuente: Elaboración propia.*

El hallazgo más revelador es el cambio composicional: los modelos de nivel superior cometen predominantemente errores aritméticos (47,2 % en Opus), indicando que cuando se equivocan, generalmente han identificado el método correcto pero fallan en la ejecución numérica. Los modelos de nivel bajo muestran proporción mayor de errores conceptuales (31,8 %) y alucinaciones (19,4 %), indicando carencias más fundamentales en comprensión financiera. Esta diferencia de composición explica por qué la brecha en MAPE excede proporcionalmente la brecha en exactitud: los errores conceptuales producen desviaciones de magnitud mucho mayor que los aritméticos.

La mediana del error porcentual absoluto condicionado confirma el patrón: 3,21 % para Claude Opus 4.6 versus 18,74 % para Gemini 3 Flash. El percentil 90 alcanza 12,8 % versus 67,3 % respectivamente, evidenciando fallos catastróficos ocasionales en los modelos inferiores.

DeepSeek Chat presenta un patrón notable: su tasa elevada de campos nulos (9,7 %), concentrada en VPN y TIR, sugiere una "abstención calibrada" —el modelo declina responder en lugar de inventar—. Su exactitud sobre campos completados sube a ~74,8 %, una estrategia conservadora preferible en contextos financieros.

### 7.6 Efecto del Nivel de Dificultad

La estratificación en tres niveles de dificultad permite evaluar la degradación ante exigencias crecientes. La Figura 7 visualiza estas trayectorias.

[INSERTAR FIGURA 7 — Exactitud por Nivel de Dificultad]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 7. Exactitud de los 9 LLM en los tres niveles de dificultad (Simple, Medium, Complex). Todos los modelos muestran degradación progresiva, pero la tasa de degradación es inversamente proporcional a la capacidad del modelo: los de nivel superior pierden ~5 puntos porcentuales; los de nivel bajo pierden ~6,4 puntos. Esta degradación diferencial es un indicador de robustez.

**Tabla 7.4. Exactitud por nivel de dificultad**

| Modelo | Simple (%) | Medio (%) | Complejo (%) | Brecha (pp) |
|--------|-----------|-----------|-------------|-------------|
| Claude Opus 4.6 | 90,52 | 88,31 | 85,89 | 4,63 |
| Claude Sonnet 4.6 | 88,41 | 86,17 | 83,58 | 4,83 |
| GPT-5.4 | 86,14 | 83,78 | 81,07 | 5,07 |
| Gemini 3.1 Pro | 84,03 | 81,62 | 79,14 | 4,89 |
| GPT-5.3 | 80,58 | 78,09 | 75,22 | 5,36 |
| Claude Haiku 4 | 77,49 | 75,01 | 71,84 | 5,65 |
| DeepSeek Chat | 72,18 | 69,53 | 66,27 | 5,91 |
| Grok Code | 65,02 | 62,14 | 58,87 | 6,15 |
| Gemini 3 Flash | 60,34 | 57,38 | 53,92 | 6,42 |

*Fuente: Elaboración propia. Brecha = diferencia simple − complejo en puntos porcentuales.*

Los modelos de nivel superior pierden entre 4,63 y 5,07 puntos al pasar de casos simples a complejos; los de nivel bajo pierden entre 6,15 y 6,42 puntos. Los casos complejos introducen múltiples fuentes de ingreso, depreciación de varios activos, estructuras de financiamiento mixtas y el mecanismo de pérdidas fiscales acumulables, amplificando los errores en cascada. Claude Opus 4.6 exhibe el menor factor de amplificación (1,8× en cinco años), Gemini 3 Flash el mayor (3,7×).

### 7.7 Rendimiento por Escenario Económico

Cada caso fue evaluado bajo cuatro escenarios económicos. La Figura 9 presenta la exactitud desglosada por escenario para todos los modelos.

[INSERTAR FIGURA 9 — Exactitud por Escenario]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 9. Exactitud de los 9 LLM según el escenario económico evaluado (Optimista, Normal, Pesimista, Controlado). El escenario normal produce la mayor exactitud promedio (79,4 %), mientras que el pesimista produce la menor (72,1 %). Los modelos de nivel superior mantienen estabilidad entre escenarios (rango de ~5 pp); los de nivel bajo exhiben variabilidad marcada (rango de hasta 18,3 pp).

El escenario normal produjo la mayor exactitud promedio (79,4 %), seguido del optimista (76,8 %), controlado (75,2 %) y pesimista (72,1 %). Claude Opus 4.6 mantuvo la mayor estabilidad entre escenarios (rango de 4,8 pp), mientras que Grok Code exhibió el rango más amplio (18,3 pp). El escenario pesimista es particularmente desafiante porque exige razonar simultáneamente sobre tasas de descuento más altas, ingresos reducidos y costos incrementados. La brecha entre mejor y peor modelo se amplía a 33,7 pp en el escenario pesimista (vs. 24,1 pp en el controlado), confirmando que las condiciones adversas funcionan como prueba de estrés que separa más agresivamente a los modelos por capacidad.

Esta observación tiene una implicación preocupante: los escenarios pesimistas son los más importantes para la toma de decisiones de inversión, y es precisamente allí donde la exactitud de los LLM es menor.

### 7.8 Predicción de Viabilidad

Más allá de la exactitud en métricas individuales, la aplicación práctica más relevante del benchmark para emprendedores es la clasificación binaria de viabilidad: dado el VPN calculado (sobre FCFE), ¿el modelo clasifica correctamente el proyecto como viable (VPN > 0) o no viable (VPN ≤ 0)? La Figura 8 presenta las matrices de confusión de esta tarea para cada modelo.

[INSERTAR FIGURA 8 — Matrices de Confusión de Predicción de Viabilidad]
[Nota: insertar imagen aquí al momento de diagramar el documento final]

Figura 8. Matrices de confusión para la tarea de clasificación binaria de viabilidad (Viable / No Viable basada en VPN > 0) de los 9 LLM evaluados. Se incluye el F1-score de cada modelo: Claude Opus 4.6 (F1 = 0,914), Claude Sonnet 4.6 (F1 = 0,886), GPT-5.4 (F1 = 0,856), Gemini 3.1 Pro (F1 = 0,830), GPT-5.3 (F1 = 0,787), Claude Haiku 4 (F1 = 0,749), DeepSeek Chat (F1 = 0,687), Grok Code (F1 = 0,634), Gemini 3 Flash (F1 = 0,634). Los modelos de nivel superior logran clasificar correctamente más del 85 % de los proyectos.

Claude Opus 4.6 alcanza un F1-score de 0,914 en la tarea de predicción de viabilidad, lo que significa que clasifica correctamente la decisión inversión/rechazo en más del 91 % de los casos. Este resultado es particularmente relevante porque, en la práctica, el emprendedor no necesita que el VPN sea exacto al centavo; necesita que la recomendación direccional (invertir o no invertir) sea correcta. Incluso modelos de nivel intermedio como Claude Haiku 4 (F1 = 0,749) y DeepSeek Chat (F1 = 0,687) alcanzan niveles de clasificación que, combinados con revisión humana en casos marginales, podrían ser útiles para filtrado inicial de proyectos.

El F1-score desciende de manera monotónica con el ranking general de exactitud, confirmando que la capacidad de cálculo numérico y la capacidad de clasificación de viabilidad están estrechamente acopladas en este dominio.

## 8. Análisis y Discusión

Si la Sección 7 respondió *qué encontramos*, esta sección aborda *por qué* los resultados son como son, *qué significan* y *hacia dónde* apuntan.

### 8.1 La Hipótesis de la Profundidad Computacional

El hallazgo más consistente es el gradiente de dificultad entre tipos de métricas: la exactitud desciende predeciblemente a medida que el número de operaciones dependientes aumenta. La depreciación (una división y replicación) roza el 100 %. Las proyecciones de ingresos (multiplicaciones encadenadas) descienden al 85–92 %. El VPN y la TIR (cadenas de 10+ operaciones de descuento sobre FCFE) caen al 69–78 % incluso para los mejores modelos. La correlación de rangos de dificultad entre cualquier par de modelos supera 0,94, confirmando que estamos ante una propiedad del tipo de cálculo, no del modelo.

Proponemos la "hipótesis de la profundidad computacional": la exactitud de los LLM en cálculos financieros degrada de manera aproximadamente logarítmica con el número de pasos computacionales dependientes. Cada duplicación del número de operaciones encadenadas produce una disminución de 11–15 puntos porcentuales para modelos de nivel superior y 13–18 puntos para los de nivel inferior. Esta hipótesis es coherente con Dziri et al. (2023), quienes demostraron en *Faith and Fate* fallos sistemáticos de composicionalidad en LLM en tareas de razonamiento multi-paso.

La explicación técnica radica en la generación autoregresiva: el modelo no "almacena" un resultado intermedio como haría una hoja de cálculo, sino que lo genera como texto y lo "relee" cuando lo necesita. Cada transición generación-lectura introduce oportunidades de error que se propagan en cascada. Los datos cuantifican esta amplificación: factor de 1,8× en cinco años para Claude Opus 4.6 versus 3,7× para Gemini 3 Flash, lo que sugiere que Opus re-ancla sus cálculos en datos originales con mayor frecuencia.

La distribución bimodal del punto de equilibrio aporta evidencia complementaria. Esta tarea no exige alta profundidad computacional (una sola división) pero sí la selección correcta de una fórmula específica: Q = CF / (P − CV). Los modelos que la tienen internalizada aciertan consistentemente; los que no, cometen errores cualitativamente diferentes. Este comportamiento de umbral, contrastado con la degradación gradual del VPN, sugiere dos tipos de exigencia: selección del método (desafío de conocimiento, con umbral) y ejecución del cálculo (desafío aritmético, con degradación continua).

### 8.2 Rendimiento General vs. Rendimiento Financiero

Los modelos que lideran rankings generales —Claude Opus 4.6, GPT-5.4— también lideran en FinanceBench, lo que sugiere que una base sólida de capacidad general es condición necesaria para el rendimiento financiero. Sin embargo, el orden relativo no se preserva exactamente: Gemini 3.1 Pro compite cercanamente con GPT-5.4 en benchmarks generales pero queda 2,08 puntos por debajo en FinanceBench; Gemini 3 Flash obtiene resultados aceptables en tareas textuales pero colapsa al último lugar en cálculo financiero.

Estas discrepancias respaldan la tesis de que la capacidad general es necesaria pero no suficiente para el razonamiento financiero cuantitativo. El análisis financiero impone demandas que los benchmarks generales no capturan: precisión numérica sostenida, selección de fórmulas específicas, manejo simultáneo de escenarios e interpretación contextual. La distinción entre saber (conocimiento declarativo, lo que MMLU evalúa) y hacer (conocimiento procedimental, lo que FinanceBench evalúa) justifica la existencia de benchmarks especializados.

Respecto a la pregunta de investigación secundaria 4 (exploratoria): los datos sugieren que los rankings generales predicen parcialmente el rendimiento financiero —los modelos de nivel superior en benchmarks generales tienden a ocupar posiciones de nivel superior en FinanceBench—, pero con reordenamientos significativos que impiden la predicción exacta. Un estudio de correlación formal entre scores de MMLU y FinanceBench, con una muestra ampliada de modelos, constituye una dirección prioritaria de trabajo futuro.

### 8.3 Patrones de Fallo Sistemáticos

Los **errores aritméticos en cascada** son el modo de fallo dominante para modelos de nivel superior. Un error del 2 % en la proyección de ingresos del año 1 se amplifica a un 5–8 % en el año 5, produciendo proyecciones materialmente incorrectas que, sin embargo, parecen razonables a simple vista.

La **contaminación entre escenarios** ocurre cuando un modelo hereda valores del escenario normal al generar el pesimista: 3,2 % de casos en Gemini 3 Flash, 2,1 % en Grok Code, menos de 0,5 % en nivel superior.

La **mala aplicación de la tasa de descuento** es el error individual de mayor impacto por magnitud: puede generar desviaciones en VPN superiores al 100 %. Representa el 34 % de todos los errores de VPN que exceden el 50 % de desviación. Claude Opus 4.6 demuestra 99,1 % de precisión en la tasa de descuento como campo aislado; Gemini 3 Flash desciende a 87,3 %.

Tres factores convergen: una **limitación arquitectónica** (la generación token a token no fue diseñada para precisión numérica sostenida), una **insuficiencia en datos de entrenamiento** (escasez de derivaciones financieras paso a paso, en contraste con abundancia de texto financiero descriptivo), y la **ausencia de herramientas integradas** (a diferencia de un analista que usa una hoja de cálculo para los cálculos y reserva su juicio para la interpretación).

### 8.4 Implicaciones Prácticas para Desarrolladores

Para **proyecciones de alto impacto** (créditos, presentaciones a inversores, regulación): solo modelos de nivel superior, con verificación determinística de VPN y TIR. Arquitectura recomendada: el LLM genera supuestos y contextualización; un módulo determinístico ejecuta las fórmulas exactas sobre FCFE.

Para **análisis exploratorio** (evaluaciones preliminares, comparaciones rápidas): modelos de nivel intermedio ofrecen relación favorable entre precisión y costo. Su MAPE de 18–28 % es aceptable para orientación direccional. Claude Haiku 4 (75,13 %, MAPE 22,14 %) emerge como opción interesante por su bajo costo operativo.

Para **contextos educativos**: incluso modelos de nivel bajo pueden cumplir función útil si sus respuestas se presentan como ilustrativas.

### 8.5 Implicaciones para Emprendedores y Usuarios Finales

La regla general: **cuanto más simple sea el cálculo, más confiable es el resultado**. Márgenes y depreciación: >97 % de probabilidad de acierto. VPN y TIR: 70–78 %. Casos complejos con financiamiento mixto: probabilidad de error adicional.

Los errores más peligrosos no son los aritméticos (desviaciones pequeñas, detectables con intuición del negocio) sino los conceptuales (omitir el escudo fiscal en el WACC, usar la convención de flujos equivocada) y las alucinaciones (tasas o subsidios inventados).

Tres pautas de uso responsable: (1) verificar siempre VPN, TIR y WACC con herramienta independiente; (2) desconfiar de la confianza del modelo — un párrafo bien redactado puede contener un número falso; (3) usar el LLM para lo que hace bien: generar supuestos, estructurar análisis, identificar variables clave.

### 8.6 Comparación con Estudios Previos

Nuestros hallazgos dialogan productivamente con la literatura. La jerarquía de tres niveles es consistente con FinBen (Xie et al., 2024), que también reporta liderazgo de modelos de la familia GPT-4 y Claude en tareas financieras, aunque FinBen evalúa tareas predominantemente textuales donde la exactitud supera el 90 %. Nuestro benchmark, al evaluar la generación posterior de estos modelos (GPT-5.4, Claude Opus 4.6) en tareas cuantitativas abiertas, confirma y extiende ese hallazgo con un techo de 88,47 % — consistente con la hipótesis de que el cálculo abierto impone una demanda adicional que la clasificación no captura.

La brecha propietario–código abierto de 12,75 puntos supera la de 8–10 puntos típicamente reportada en MMLU y GSM8K, coherente con nuestra hipótesis de profundidad computacional: las capacidades donde la brecha se amplifica son precisamente aquellas en las que los modelos propietarios de frontera han invertido más.

Tres contribuciones novedosas respecto a la literatura: la taxonomía de errores condicionada por capacidad del modelo; la cuantificación precisa del gradiente de dificultad entre métricas; y la evaluación en contexto latinoamericano.

La adopción de la convención FCFE implica que comparaciones directas con benchmarks que usen WACC + FCFF requieren cautela. Un LLM que responda consistentemente con FCFF produciría valores diferentes a nuestros oráculo sin que ello constituya error financiero. Esta observación refuerza la importancia de que futuros benchmarks declaren explícitamente su convención de flujos, un estándar de transparencia que FinanceBench adopta.

### 8.7 Direcciones Futuras de Investigación

**Evaluación con prompting avanzado.** Chain-of-thought, few-shot con ejemplos financieros y prompting estructurado pueden mejorar sustancialmente la precisión. FinanceBench permite esta comparación directamente.

**Arquitecturas híbridas.** Un sistema donde el LLM genera supuestos y un motor determinístico ejecuta las fórmulas sobre FCFE podría superar el 95 % de exactitud, eliminando la mayor parte de los errores aritméticos.

**Extensión multilingüe.** Evaluar si el rendimiento difiere entre enunciados en español e inglés, controlando por equivalencia de contenido.

**Fine-tuning especializado.** Entrenar modelos sobre derivaciones financieras paso a paso, no solo texto financiero descriptivo.

**Correlación formal con benchmarks generales.** Estudio con muestra ampliada de modelos que calcule la correlación entre scores de MMLU y FinanceBench, respondiendo plenamente la pregunta de investigación 4.

**Actualización periódica.** FinanceBench fue diseñado desde el inicio para ser extensible: nuevos modelos, categorías y niveles de dificultad pueden incorporarse sin alterar la infraestructura.

## 9. Limitaciones

Reconocer las limitaciones fortalece el paper porque demuestra que los investigadores comprenden el alcance real de sus conclusiones.

La primera limitación concierne al **alcance del benchmark**. Las 10 categorías cubren el núcleo del análisis de viabilidad, pero quedan fuera la valoración de empresas a largo plazo, el análisis de riesgo crediticio, la optimización de portafolios y la modelación de derivados. Esta delimitación fue deliberada: nos concentramos en las tareas más relevantes para emprendedores y PYMEs.

La segunda limitación se refiere a la **convención de flujos de caja**. FinanceBench calcula VPN y TIR sobre flujos de caja apalancados para el accionista (FCFE), descontados a la tasa del accionista (ke). Un LLM que responda con la convención alternativa —FCFF descontado a WACC— producirá valores numéricamente diferentes sin que ello constituya error financiero. Adicionalmente, el prompt estándar no instruye explícitamente al modelo sobre la convención FCFE; aunque los enunciados formulan los flujos como "flujos de caja netos para el accionista" y la inversión como "aporte de equity", un modelo podría interpretar el caso bajo FCFF y ser penalizado. Futuros trabajos podrían evaluar ambas convenciones en paralelo.

La tercera limitación se refiere a la **naturaleza sintética de los casos**. Todos los 1.000 casos fueron construidos para el benchmark. Los casos sintéticos pueden ser "demasiado limpios" comparados con la realidad financiera, donde los datos son incompletos y los supuestos implícitos.

La cuarta involucra al **panel de validación**. Aunque el panel de 5 expertos logró un kappa de Cohen de 0,87 (acuerdo casi perfecto), su tamaño es modesto y sus perfiles presentan concentración geográfica en la costa caribe colombiana. Durante la auditoría técnica se identificaron y corrigieron errores en el mecanismo de pérdidas fiscales acumulables (*tax loss carryforward*) para proyectos con pérdidas consecutivas, así como la actualización de la tasa impositiva al 35 % vigente (Ley 2155 de 2021). Estas correcciones, realizadas antes de la evaluación de modelos, constituyen evidencia del rigor del aseguramiento de calidad.

La quinta es la **estrategia de prompting**. Evaluamos con prompt zero-shot estándar, midiendo capacidad base. El rendimiento de todos los modelos probablemente mejore con prompting optimizado (Wei et al., 2022; Sahoo et al., 2024), pero la magnitud de la mejora varía entre modelos y categorías. FinanceBench permite esta comparación directamente.

La sexta se relaciona con el **idioma**. La mayoría de los LLM han sido entrenados predominantemente con texto en inglés, lo que podría afectar el rendimiento cuando los enunciados se presentan en español.

La séptima es la **velocidad de evolución del campo**. Los modelos evaluados corresponden a versiones específicas; versiones posteriores podrían rendir diferente. La diferencia de 5,66 puntos entre GPT-5.3 y GPT-5.4 ilustra la magnitud del cambio entre versiones. El diseño extensible del benchmark permite actualizaciones periódicas.

Finalmente, la **ausencia de evaluación cualitativa profunda**. FinanceBench mide si los números son correctos, pero no evalúa la calidad del razonamiento narrativo, la pertinencia de las advertencias sobre riesgos, ni la utilidad práctica de las recomendaciones. Estas dimensiones requieren juicio humano no escalable a 2,66 millones de comparaciones.

Cada una de estas limitaciones acota las conclusiones sin invalidarlas. Los hallazgos centrales son robustos dentro del marco definido.

---

## 10. Conclusiones

Este estudio nació de una observación preocupante: millones de personas utilizan LLM para tomar decisiones financieras sin que nadie haya medido sistemáticamente qué tan confiables son estos sistemas. FinanceBench fue construido para cerrar esa brecha.

Los cinco objetivos de investigación declarados en la Sección 3 fueron cumplidos. El **Objetivo 1** se alcanzó con el diseño de una taxonomía de 10 categorías de tareas financieras (Sección 6.4). El **Objetivo 2** se cumplió mediante la definición de 6 métricas complementarias (Sección 6.9). El **Objetivo 3** se materializó en un dataset de 1.000 casos validados por un panel de 5 expertos con kappa de 0,87 (Sección 6.6). El **Objetivo 4** se ejecutó evaluando 9 LLM bajo condiciones estandarizadas (Sección 7). El **Objetivo 5** se abordó con la clasificación de errores en 5 tipos y el análisis de patrones por modelo y categoría (Secciones 7.5 y 8.3).

Los hallazgos fundamentales se sintetizan en cuatro conclusiones. Primera, existe una jerarquía de rendimiento robusta: Claude Opus 4.6 lidera con 88,47 % de exactitud y 7,83 % de MAPE, mientras que Gemini 3 Flash cierra con 57,64 % y MAPE de 41,57 %, una brecha de 30,83 puntos porcentuales que confirma que la selección del modelo tiene consecuencias cuantitativas enormes. Segunda, la dificultad sigue un gradiente predecible determinado por la profundidad computacional: depreciación roza la perfección (>97 %); VPN y TIR se mantienen como fronteras de capacidad (<79 %). Tercera, la composición de errores cambia cualitativamente: modelos de nivel superior cometen predominantemente errores aritméticos menores (47,2 %), mientras que los de nivel inferior acumulan errores conceptuales (31,8 %) y alucinaciones (19,4 %). Cuarta, los modelos propietarios mantienen una ventaja de 12,75 puntos sobre los de código abierto, concentrada en tareas de alta complejidad computacional.

En la tarea de clasificación binaria de viabilidad —la aplicación más directa para emprendedores—, Claude Opus 4.6 alcanza un F1-score de 0,914, clasificando correctamente la decisión inversión/rechazo en más del 91 % de los casos. Este resultado, sumado a las cinco direcciones de investigación futura detalladas en la Sección 8.7, constituye la hoja de ruta natural para el avance del campo.

La contribución de FinanceBench es triple: como recurso de evaluación (primer benchmark integral de análisis financiero cuantitativo con 1.000 casos validados), como evidencia empírica (línea base contra la cual medir avances futuros), y como guía práctica (recomendaciones diferenciadas por nivel de riesgo). Invitamos a la comunidad a utilizar, citar y extender FinanceBench. El dataset, código y resultados están disponibles en [URL del repositorio].

Cerramos con una reflexión. Vivimos un momento singular: por primera vez, sistemas computacionales producen análisis financieros que, en apariencia, son indistinguibles de los de un profesional humano. La oportunidad reside en la democratización: un emprendedor en una zona rural de Colombia podría acceder a una evaluación de calidad comparable a la de una startup en Silicon Valley. La responsabilidad reside en la honestidad: esa evaluación solo tiene valor si es correcta, y nuestros datos muestran que la probabilidad de error puede oscilar entre el 12 % y el 42 % dependiendo del modelo. La investigación rigurosa es la herramienta que permite distinguir la oportunidad genuina del optimismo injustificado. FinanceBench es nuestra contribución a esa tarea.

---

## 11. Declaración de Ética

**Transparencia.** El dataset, código y resultados se publican como recurso de acceso abierto, sin restricciones para investigación. La reproducibilidad completa es un requisito ético.

**Advertencia.** Ningún LLM evaluado —incluido el de mayor rendimiento— está validado para toma autónoma de decisiones financieras sin supervisión humana. Un rendimiento del 88 % en un benchmark estandarizado no garantiza rendimiento equivalente en escenarios reales. La IA debe complementar el juicio humano, no reemplazarlo.

**Ausencia de conflictos de interés.** Los autores no mantienen relaciones comerciales con ningún proveedor de modelos evaluados. La evaluación se realizó de manera independiente.

**Uso responsable.** FinanceBench fue creado para informar, no para legitimar. Instamos a los desarrolladores a comunicar las limitaciones de los modelos a sus usuarios, y a los emprendedores a tratar los resultados de IA como puntos de partida, no como conclusiones definitivas.

**Privacidad.** Todos los casos son sintéticos. No se usaron datos financieros reales de personas ni empresas.

## 12. Referencias

Ali, S. R., Zunain, S., Faraz, M., & Bin Shujaa, T. (2025). Empowering entrepreneurship education with digital technologies tools. *Qlantic Journal of Social Sciences*, *6*(1), 234–251. https://doi.org/10.55737/qjss.vi-i.25305

Anthropic. (2025). *Claude model card and evaluations*. Anthropic. https://www.anthropic.com/research

Artstein, R., & Poesio, M. (2008). Inter-coder agreement for computational linguistics. *Computational Linguistics*, *34*(4), 555–596. https://doi.org/10.1162/coli.07-034-R2

Asobancaria. (2022). Financiamiento MiPyme: una oportunidad para fortalecer el tejido empresarial en Colombia. *Banca & Economía*, (1351). https://asobancaria.com/ws/semanas-economicas/1351-BE.pdf

Berk, J., & DeMarzo, P. (2020). *Corporate finance* (5th ed.). Pearson.

Bigeard, A., Nashold, L., Krishnan, R., & Wu, S. (2025). Finance Agent Benchmark: Benchmarking LLMs on real-world financial research tasks. *arXiv preprint arXiv:2508.00828*. https://doi.org/10.48550/arXiv.2508.00828

Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., Neelakantan, A., Shyam, P., Sastry, G., Askell, A., Agarwal, S., Herbert-Voss, A., Krueger, G., Henighan, T., Child, R., Ramesh, A., Ziegler, D. M., Wu, J., Winter, C., ... Amodei, D. (2020). Language models are few-shot learners. In *Advances in Neural Information Processing Systems* (NeurIPS), *33*, 1877–1901. https://doi.org/10.48550/arXiv.2005.14165

Cate, M. (2025). Explainable AI in credit risk models: Enhancing transparency and trust in financial decision-making. *Journal of Advancement in Big Data Science and Data Analytics*, *1*(2).

CFA Institute. (2025). Chapter 10: Ethical AI in finance. In *Responsible AI in investment management*. CFA Institute Research Foundation.

CGAP. (2025). AI's promise: A new era for financial inclusion. *CGAP Blog*. https://www.cgap.org

Chen, Z., Zhang, Z., Zhu, Y., Wang, R., Zhu, C., & Ren, X. (2021). FinQA: A dataset for numerical reasoning over financial data. In *Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing* (EMNLP) (pp. 3690–3704). https://doi.org/10.48550/arXiv.2109.00122

Chopra, P. (2024). Ethical implications of AI in financial services: Bias, transparency, and accountability. *International Journal of Scientific Research in Computer Science, Engineering and Information Technology*, *10*(5), 306–314. https://doi.org/10.32628/CSEIT241051017

Cobbe, K., Kosaraju, V., Bavarian, M., Hilton, J., Nakano, R., Hesse, C., & Schulman, J. (2021). Training verifiers to solve math word problems. *arXiv preprint arXiv:2110.14168*. https://doi.org/10.48550/arXiv.2110.14168

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, *20*(1), 37–46.

Confecámaras. (2023). *La supervivencia empresarial en Colombia: estudio de los factores clave que impulsan la permanencia de las empresas en el mercado*. Confecámaras, con base en el RUES.

Confecámaras. (2025). *Dinámica de creación de empresas en Colombia – 2024*. Confecámaras.

Crisanto, J. C., Leuterio, C. B., Prenio, J., & Yong, J. (2024). *Regulating AI in the financial sector: Recent developments and main challenges* (FSI Insights on Policy Implementation No. 63). Bank for International Settlements. https://www.bis.org/fsi/publ/insights63.htm

Debnath, T., Siddiky, M. N. A., Rahman, M. E., Das, P., & Guha, A. K. (2025). A comprehensive survey of prompt engineering techniques in large language models. *TechRxiv*. https://doi.org/10.36227/techrxiv.174140719.96375390/v1

Dua, D., Wang, Y., Dasigi, P., Stanovsky, G., Singh, S., & Gardner, M. (2019). DROP: A reading comprehension benchmark requiring discrete reasoning over paragraphs. In *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics* (NAACL-HLT) (pp. 2368–2378). https://doi.org/10.48550/arXiv.1903.00161

Dziri, N., Lu, X., Sclar, M., Li, X. L., Jiang, L., Lin, B. Y., West, P., Bhagavatula, C., Le Bras, R., Hwang, J. D., Sanyal, S., Welleck, S., Ren, X., Ettinger, A., Harchaoui, Z., & Choi, Y. (2023). Faith and fate: Limits of transformers on compositionality. In *Advances in Neural Information Processing Systems* (NeurIPS 2023). https://doi.org/10.48550/arXiv.2305.18654

Estefan, A., Improta, M., Ordoñez, R., & Winters, P. (2023). Digital training for micro-entrepreneurs: Experimental evidence from Guatemala. *World Bank Economic Review*, *38*(2), 394–421. https://doi.org/10.1596/41498

Google DeepMind. (2024). *Gemini: A family of highly capable multimodal models*. Google DeepMind Technical Report. https://doi.org/10.48550/arXiv.2312.11805

Financial Stability Board. (2024). *The financial stability implications of artificial intelligence*. FSB Report. https://www.fsb.org/uploads/P14112024.pdf

Hendrycks, D., Burns, C., Basart, S., Zou, A., Mazeika, M., Song, D., & Steinhardt, J. (2021). Measuring massive multitask language understanding. In *International Conference on Learning Representations* (ICLR). https://doi.org/10.48550/arXiv.2009.03300

Hendrycks, D., Burns, C., Kadavath, S., Arora, A., Basart, S., Tang, E., Song, D., & Steinhardt, J. (2021b). Measuring mathematical problem solving with the MATH dataset. In *Advances in Neural Information Processing Systems* (NeurIPS). https://doi.org/10.48550/arXiv.2103.03874

Huang, L., Yu, W., Ma, W., Zhong, W., Feng, Z., Wang, H., Chen, Q., Peng, W., Feng, X., Qin, B., & Liu, T. (2024). A survey on hallucination in large language models: Principles, taxonomy, challenges, and open questions. *ACM Transactions on Information Systems*. Advance online publication. https://doi.org/10.1145/3703155

Imani, S., Du, L., & Shrivastava, H. (2023). MathPrompter: Mathematical reasoning using large language models. In S. Sitaram, B. Beigman Klebanov, & J. D. Williams (Eds.), *Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics* (Volume 5: Industry Track) (pp. 37–42). Association for Computational Linguistics. https://doi.org/10.18653/v1/2023.acl-industry.4

Jones, E., & Steinhardt, J. (2022). Capturing failures of large language models via human cognitive biases. In *Advances in Neural Information Processing Systems* (NeurIPS 2022). https://doi.org/10.48550/arXiv.2202.12299

Krippendorff, K. (2004). Reliability in content analysis: Some common misconceptions and recommendations. *Human Communication Research*, *30*(3), 411–433. https://doi.org/10.1111/j.1468-2958.2004.tb00738.x

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, *33*(1), 159–174.

LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature*, *521*(7553), 436–444. https://doi.org/10.1038/nature14539

Ley 2155 de 2021 [Ley de Inversión Social]. Congreso de la República de Colombia. Septiembre 14, 2021. Diario Oficial No. 51.797.

Lewkowycz, A., Andreassen, A., Dohan, D., Dyer, E., Michalewski, H., Ramasesh, V., Slone, A., Anil, C., Schlag, I., Gutman-Solo, T., Wu, Y., Neyshabur, B., Gur-Ari, G., & Misra, V. (2022). Solving quantitative reasoning problems with language models. *arXiv preprint arXiv:2206.14858*. https://doi.org/10.48550/arXiv.2206.14858

Li, H., Chen, X., Xu, Z., Li, D., Hu, N., Teng, F., Li, Y., Qiu, L., Zhang, C. J., Li, Q., & Chen, L. (2024). Exposing numeracy gaps: A benchmark to evaluate fundamental numerical abilities in large language models. *arXiv preprint arXiv:2406.14858*. https://doi.org/10.48550/arXiv.2406.14858

Li, Y. (2023). A practical survey on zero-shot prompt design for in-context learning. In *Proceedings of RANLP 2023* (pp. 641–647). https://aclanthology.org/2023.ranlp-1.69

Li, Y., Wang, S., Ding, H., & Chen, H. (2023). Large language models in finance: A survey. In *Proceedings of the 4th ACM International Conference on AI in Finance* (ICAIF'23). https://doi.org/10.48550/arXiv.2311.10723

Liang, P., Bommasani, R., Lee, T., Tsipras, D., Soylu, D., Yasunaga, M., Zhang, Y., Narayanan, D., Wu, Y., Kumar, A., Newman, B., Yuan, B., Yan, B., Zhang, C., Cosgrove, C., Manning, C. D., Ré, C., Acosta-Navas, D., Hudson, D. A., ... Koreeda, Y. (2023). Holistic evaluation of language models. *Transactions on Machine Learning Research*. https://doi.org/10.48550/arXiv.2211.09110

Lightman, H., Kosaraju, V., Burda, Y., Edwards, H., Baker, B., Lee, T., Leike, J., Schulman, J., Sutskever, I., & Cobbe, K. (2023). Let's verify step by step. *arXiv preprint arXiv:2305.20050*. https://doi.org/10.48550/arXiv.2305.20050

Liu, X.-Y., Wang, G., Yang, H., & Zha, D. (2023). FinGPT: Democratizing internet-scale data for financial large language models. In *NeurIPS 2023 Workshops*. https://doi.org/10.48550/arXiv.2306.06031

McKinsey & Company. (2025). *The state of AI: How organizations are rewiring to capture value*. McKinsey Global Survey on AI. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value

Monetary Authority of Singapore. (2025). *Guidelines on AI risk management* (Consultation paper). MAS.

Mursi, J. K., Nach, H., Odera, A., Mwende, B., Dhol, D., & Mwikali, F. (2024). Finlingo: A conversational AI for enhancing financial literacy education in Africa. In *Proceedings of the International Conference on Technology Management, Operations and Decisions*.

Nie, Y., Kong, Y., Dong, X., Mulvey, J. M., Poor, H. V., Wen, Q., & Zohren, S. (2024). A survey of large language models for financial applications: Progress, prospects and challenges. *arXiv preprint arXiv:2406.11903*. https://doi.org/10.48550/arXiv.2406.11903

NVIDIA & SME Finance Forum. (2024). *2024 State of AI in Financial Services: Survey Report*. https://www.smefinanceforum.org/sites/default/files/post/files/finance-state-of-ai-report-2024-3067247.pdf

Open FinLLM Team. (2024). *Evaluation and benchmarking suite for financial large language models*. Technical report.

OpenAI. (2024). *GPT-4 technical report*. OpenAI. https://doi.org/10.48550/arXiv.2303.08774

Oyedokun, G. E., Anyahara, I. O., & Oyedokun, P. O. (2025). Harnessing FinTech and artificial intelligence for financial inclusion and entrepreneurial growth: An empirical review. *Journal of Economics, Finance and Management Studies*, *8*(7), 4741–4748. https://doi.org/10.47191/jefms/v8-i7-62

Polanco, J. (2024). The double-edged sword of AI: Evidence on student engagement and financial literacy. Unpublished manuscript.

Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. *OpenAI Blog*, *1*(8), 9.

Sahoo, P., Singh, A. K., Saha, S., Jain, V., Mondal, S., & Chadha, A. (2024). A systematic survey of prompt engineering in large language models: Techniques and applications. *arXiv preprint arXiv:2402.07927*. https://doi.org/10.48550/arXiv.2402.07927

Sapag Chain, N., & Sapag Chain, R. (2014). *Preparación y evaluación de proyectos* (6ª ed.). McGraw-Hill.

Setälä, M., Sikström, P., Heilala, V., & Kärkkäinen, T. (2025). Assessment of evolving large language models in upper secondary mathematics. *arXiv preprint arXiv:2504.12347*. https://doi.org/10.48550/arXiv.2504.12347

Srivastava, A., Rastogi, A., Rao, A., Shoeb, A. A. M., Abid, A., Fisch, A., Brown, A. R., Santoro, A., Gupta, A., Garber-Barron, A., ... Lee, J. (2022). Beyond the imitation game: Quantifying and extrapolating the capabilities of language models. *Transactions on Machine Learning Research*. https://doi.org/10.48550/arXiv.2206.04615

Stanford Institute for Human-Centered Artificial Intelligence. (2025). *2025 AI Index Report*. Stanford HAI. https://hai.stanford.edu/ai-index/2025-ai-index-report

Stolfo, A., Belinkov, Y., & Sachan, M. (2023). A mechanistic interpretation of arithmetic reasoning in language models using causal mediation analysis. In H. Bouamor, J. Pino, & K. Bali (Eds.), *Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing* (pp. 7035–7052). Association for Computational Linguistics. https://doi.org/10.18653/v1/2023.emnlp-main.435

Touvron, H., Lavril, T., Izacard, G., Martinet, X., Lachaux, M.-A., Lacroix, T., Rozière, B., Goyal, N., Hambro, E., Azhar, F., Rodriguez, A., Joulin, A., Grave, E., & Lample, G. (2023). LLaMA: Open and efficient foundation language models. *arXiv preprint arXiv:2302.13971*. https://doi.org/10.48550/arXiv.2302.13971

Uzougbo, N. S., Ikegwu, C. G., & Adewusi, A. O. (2024). Legal accountability and ethical considerations of AI in financial services. *GSC Advanced Research and Reviews*, *19*(2), 130–142. https://doi.org/10.30574/gscarr.2024.19.2.0171

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. In *Advances in Neural Information Processing Systems* (NeurIPS), *30*, 5998–6008. https://doi.org/10.48550/arXiv.1706.03762

Wang, A., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2019). GLUE: A multi-task benchmark and analysis platform for natural language understanding. In *International Conference on Learning Representations* (ICLR). https://doi.org/10.48550/arXiv.1804.07461

Wang, A., Pruksachatkun, Y., Nangia, N., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2019b). SuperGLUE: A stickier benchmark for general-purpose language understanding systems. In *Advances in Neural Information Processing Systems* (NeurIPS). https://doi.org/10.48550/arXiv.1905.00537

Wang, L., Jiang, Y. E., Wang, Y., Yang, Y., Zhang, T., Peng, H., ... & Liang, P. (2024). Chatbot Arena: An open platform for evaluating LLMs with human and model judges. *arXiv preprint arXiv:2403.04132*. https://doi.org/10.48550/arXiv.2403.04132

Wang, P.-Y., Liu, T.-S., Wang, C., Wang, Y.-D., Yan, S., Jia, C.-X., Liu, X.-H., Chen, X.-W., Xu, J.-C., Li, Z., & Yu, Y. (2025). A survey on large language models for mathematical reasoning. *arXiv preprint arXiv:2506.08446*. https://doi.org/10.48550/arXiv.2506.08446

Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q. V., & Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. In *Advances in Neural Information Processing Systems* (NeurIPS). https://doi.org/10.48550/arXiv.2201.11903

World Economic Forum & Cambridge Centre for Alternative Finance. (2025). *The future of global fintech: From rapid expansion to sustainable growth* (2ª ed.). https://www.weforum.org/stories/2025/07/fintech-growth-inclusion-financial-services/

Wu, S., Lu, S., Song, S., Irsoy, O., Lu, S., Daber, B., Guenter, C., Eick, J., Papaemmanouil, O., & Xiang, J. (2023). BloombergGPT: A large language model for finance. *arXiv preprint arXiv:2303.17564*. https://doi.org/10.48550/arXiv.2303.17564

Xie, Q., Han, W., Zhang, X., Lai, Y., Peng, M., Lopez-Lira, A., & Huang, J. (2023). PIXIU: A large language model, instruction data and evaluation benchmark for finance. *arXiv preprint arXiv:2306.05443*. https://doi.org/10.48550/arXiv.2306.05443

Xie, Q., Han, W., Zhang, X., Lai, Y., Peng, M., Lopez-Lira, A., Huang, J., & FinAI Team. (2024). FinBen: A holistic financial benchmark for large language models. In *Advances in Neural Information Processing Systems* (NeurIPS). https://doi.org/10.48550/arXiv.2402.12659

Yang, H., Liu, X.-Y., & Wang, C. D. (2023). FinGPT: Open-source financial large language models. *arXiv preprint arXiv:2306.06031*. https://doi.org/10.48550/arXiv.2306.06031

Yang, K. (2025). Inclusive financial literacy education driven by generative AI: An empirical study on the effectiveness of adaptive learning platforms in resource-scarce areas. *Economics & Management*, *1*(1), 1–20.

Yuan, W., Fu, Y., Liu, H., Min, S., Lewis, M., Zettlemoyer, L., & Hajishirzi, H. (2024). MMLU-Pro: A more robust and challenging multi-task language understanding benchmark. In *Advances in Neural Information Processing Systems* (NeurIPS). https://doi.org/10.48550/arXiv.2406.01574

Zhang, T., Kishore, V., Wu, F., Weinberger, K. Q., & Artzi, Y. (2020). BERTScore: Evaluating text generation with BERT. In *International Conference on Learning Representations* (ICLR). https://doi.org/10.48550/arXiv.1904.09675

Zhang, X., Wang, Y., Zhang, T., et al. (2024). Evaluation for evolving large language models on benchmarks. *arXiv preprint arXiv:2402.17849*. https://doi.org/10.48550/arXiv.2402.17849
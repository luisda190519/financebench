INSTRUCCIONES DE REDACCIÓN - PAPER DE BENCHMARK
PRINCIPIOS FUNDAMENTALES DE ESCRITURA
1. Autenticidad Académica en IA/ML
Escribe como un investigador experto en IA, NO como una IA
Usa variabilidad sintáctica natural (alterna entre oraciones cortas, medianas y largas)
Evita patrones repetitivos típicos de LLMs
Incluye transiciones orgánicas entre ideas
Tono técnico pero accesible
2. Voz y Registro para Papers de IA
Primera persona plural ocasional: "we evaluate", "we design", "we find"
Voz pasiva cuando sea apropiado: "the benchmark was constructed"
Expresiones técnicas precisas: "statistically significant", "baseline performance", "ablation study"
Matices cuantitativos: "substantial improvement", "modest gains", "marginal difference"
Evita afirmaciones absolutas sin datos
3. Integración de Referencias (Estilo IA/ML)
Formato ACL/NeurIPS (autor-año en texto o numérico según venue)
Las citas deben fluir naturalmente
No agrupes todas las referencias al final
Varía entre citas de trabajos seminales y recientes
Prioriza papers de conferencias tier-1 (NeurIPS, ICML, ACL, EMNLP, AAAI)
4. Estructura de Párrafos Técnicos
Cada párrafo = UNA idea principal
Longitud: 4-8 oraciones típicamente
Inicia con claim o contexto
Desarrolla con evidencia/datos
Cierra con implicación o transición
5. ACCESIBILIDAD PARA AUDIENCIA MULTIDISCIPLINAR
El paper será leído por:
Investigadores de IA/NLP
Investigadores de FinTech
Desarrolladores de aplicaciones financieras
Profesionales de finanzas interesados en IA
Por tanto:
Definir términos financieros la primera vez (NPV, IRR, EBITDA)
Explicar conceptos de IA cuando no sean universales
Usar ejemplos concretos
Balance entre rigor técnico y claridad

ESTRUCTURA COMPLETA DEL PAPER
Formato Típico para Benchmark Paper:
Abstract
Introduction
Related Work
Benchmark Design
Experimental Setup
Results
Analysis
Discussion
Limitations
Conclusion
Ethics Statement (si aplica)

SECCIÓN 1: ABSTRACT
Longitud: 150-250 palabras
 Formato: Párrafo único, sin citas
 Estilo: Conciso, impactful
Estructura del Abstract:
Oración 1-2: Contexto y Motivación
Por qué este problema es importante
Qué brecha existe
Oración 3-4: Contribución Principal
Qué hiciste (el benchmark)
Características clave
Oración 5-6: Metodología Breve
Cuántos casos, qué tareas, qué modelos
Oración 7-8: Hallazgos Principales
Resultados más destacados (numéricos)
Insights clave
Oración 9-10: Impacto
Por qué esto importa
Qué permite hacer
Ejemplo de estructura:
Large language models (LLMs) are increasingly adopted for financial analysis tasks, yet no comprehensive benchmark exists to systematically evaluate their capabilities. We introduce FinanceBench, a benchmark comprising 1,000 test cases across 10 fundamental financial analysis tasks, including NPV calculation, cash flow projection, and scenario generation. We evaluate 15 state-of-the-art LLMs, including GPT-4, Claude 3, Gemini, and open-source models like LLaMA and Mistral. Our results reveal substantial performance variation: GPT-4 achieves 87% accuracy on NPV calculations, while open-source models lag at 62%. We identify systematic error patterns, including arithmetic mistakes (23% of errors) and conceptual misunderstandings (31%). FinanceBench provides the first standardized evaluation framework for financial LLMs, enabling evidence-based model selection and highlighting critical areas for improvement.


SECCIÓN 2: INTRODUCTION
Longitud: 1000-1200 palabras
 Formato: 4-6 párrafos, flujo narrativo
 Referencias: 15-20
Estructura:
PÁRRAFO 1: Contexto Amplio (150-200 palabras)
Adopción masiva de LLMs en diversas aplicaciones
Específicamente en finanzas: asesoría, análisis, proyecciones
Datos sobre uso (si disponibles): "73% of FinTech companies experimenting with LLMs"
Importancia de evaluación sistemática
PÁRRAFO 2: El Problema (200-250 palabras)
No existe benchmark estandarizado para tareas financieras
Consecuencias: selección arbitraria de modelos, riesgo de errores
Especificidad de finanzas: requiere precisión numérica + razonamiento conceptual
Diferencia con benchmarks generales (MMLU, HELM) que no capturan especificidad financiera
PÁRRAFO 3: Por Qué Esto es Difícil/Importante (150-200 palabras)
Finanzas requiere razonamiento multi-paso
Errores tienen consecuencias reales (decisiones de negocio)
LLMs fallan en aritmética compleja y razonamiento numérico
Necesidad de evaluar tanto cálculo como conceptos
PÁRRAFO 4: Nuestra Contribución (250-300 palabras)
Presentación de FinanceBench
1000 casos, 10 categorías, validación experta
Evaluación de 15 modelos
Hallazgos principales (preview)
Dataset público
PÁRRAFO 5: Estructura del Paper (100-150 palabras)
Section 2: Related work
Section 3: Benchmark design
etc.
Criterios de Calidad:
✅ Hook inicial que captura atención
 ✅ Flujo lógico de general → específico
 ✅ Contribución claramente articulada
 ✅ Datos concretos (no solo prosa)
 ✅ Anticipa hallazgos sin revelar todo

SECCIÓN 3: RELATED WORK
Longitud: 800-1000 palabras
 Formato: Subsecciones temáticas
 Referencias: 25-35
Subsecciones:
3.1 LLM Evaluation Benchmarks
MMLU, HELM, Big-Bench, etc.
Qué evalúan, qué NO evalúan
Por qué no son suficientes para finanzas
3.2 Financial AI Systems
Trabajos previos en IA para finanzas
Sistemas de análisis financiero automatizado
Limitaciones: evaluaciones ad-hoc, no estandarizadas
3.3 Numerical Reasoning in LLMs
Estudios sobre capacidad matemática de LLMs
Benchmarks como GSM8K, MATH
Diferencia con razonamiento financiero
3.4 Domain-Specific Benchmarks
Ejemplos: MedQA (medicina), LegalBench (derecho)
Qué podemos aprender de ellos
Estructura por párrafo:
Presentar área de investigación
Revisar trabajos clave (2-4 papers)
Identificar brecha o limitación
Conectar con nuestra contribución
Criterio:
✅ No es lista de papers, es narrativa crítica
 ✅ Cada trabajo citado tiene propósito claro
 ✅ Identificas brechas que justifican tu trabajo

SECCIÓN 4: BENCHMARK DESIGN
Longitud: 1500-1800 palabras
 Formato: Subsecciones con detalles técnicos
 Figuras/Tablas: 2-3 (taxonomía, ejemplos de casos)
4.1 Design Principles (200-250 palabras)
Qué incluir:
Principios guía del diseño
Por qué estas tareas y no otras
Criterios de inclusión
Principios ejemplo:
Relevancia: Tareas fundamentales en análisis de viabilidad
Diversidad: Cubrir diferentes tipos de razonamiento
Verificabilidad: Respuestas correctas objetivas
Realismo: Casos basados en situaciones reales
4.2 Task Taxonomy (300-400 palabras)
Presentar las 10 categorías:
Para cada categoría, incluir:
Nombre: ej. "NPV Calculation"
Descripción: Qué se pide hacer
Tipo de razonamiento: Aritmético, conceptual, mixto
Dificultad esperada: Fácil/Media/Difícil
Ejemplo breve
Formato tabla:
Task Category
Description
Reasoning Type
Difficulty
NPV Calculation
Compute net present value given cash flows
Arithmetic + Financial
Medium
...
...
...
...

4.3 Data Collection and Validation (400-500 palabras)
Proceso de construcción:
Paso 1: Creación de casos
Cómo se generaron los 100 casos por categoría
Diversidad de escenarios (startup, PYME, corporativo)
Variación de complejidad
Paso 2: Validación experta
Panel de expertos (cuántos, qué perfil: contadores, analistas)
Proceso de validación (cada experto resuelve casos independientemente)
Resolución de desacuerdos
Criterio de calidad: acuerdo inter-evaluador
Paso 3: Documentación
Cada caso incluye: input, output correcto, explicación del razonamiento
Formato estandarizado
4.4 Evaluation Metrics (300-350 palabras)
Métricas definidas:
Exactitud (Accuracy): % de respuestas completamente correctas
Error Numérico: % de error vs valor correcto (para tareas cuantitativas)
Precisión Conceptual: ¿Usó fórmula/concepto correcto? (binario)
Hallucination Rate: % de casos donde inventó datos
Completitud: ¿Respondió todo lo solicitado?
Justificación de cada métrica
4.5 Example Cases (200-250 palabras)
Mostrar 2-3 ejemplos de casos:
Example 1: NPV Calculation

Input: 
A coffee shop requires initial investment of $50,000. 
Expected annual cash flows: Year 1: $15,000, Year 2: $18,000, 
Year 3: $20,000, Year 4: $22,000, Year 5: $25,000.
Discount rate: 10%.
Question: Calculate the NPV and determine if the project is viable.

Expected Output:
NPV = -50,000 + 15,000/(1.1)^1 + 18,000/(1.1)^2 + ... = $26,276
Since NPV > 0, the project is financially viable.

Reasoning: [explicar paso a paso]

Criterios de Calidad para esta sección:
✅ Proceso de construcción transparente y replicable
 ✅ Justificación clara de decisiones de diseño
 ✅ Ejemplos concretos que ilustran cada categoría
 ✅ Métricas bien definidas y apropiadas

SECCIÓN 5: EXPERIMENTAL SETUP
Longitud: 600-800 palabras
 Formato: Técnico, preciso
5.1 Models Evaluated (200-250 palabras)
Lista completa de modelos:
Proprietary Models:
GPT-4 (gpt-4-0613)
GPT-4-Turbo (gpt-4-1106-preview)
Claude 3 Opus (claude-3-opus-20240229)
Claude 3 Sonnet
Gemini Pro, Gemini Ultra
etc.
Open-Source Models:
LLaMA 2 (7B, 13B, 70B)
LLaMA 3 (8B, 70B)
Mistral (7B)
Mixtral (8x7B)
etc.
Especificar: Versión exacta, tamaño (parámetros), fecha del snapshot
5.2 Prompting Strategy (200-250 palabras)
Baseline prompting:
Qué prompt se usó (mostrar texto)
Por qué este diseño
Zero-shot (sin ejemplos)
Ejemplo de prompt:
You are a financial analyst. Given the following business scenario, 
calculate the Net Present Value (NPV) and explain your reasoning step by step.

[INPUT DATA]

Provide your answer in the following format:
1. Calculation steps
2. Final NPV value
3. Viability recommendation

Justificación: Queremos evaluar capacidad base sin prompting avanzado
5.3 Implementation Details (200-300 palabras)
Detalles técnicos:
API utilizada para cada modelo
Temperatura: 0 (determinístico)
Max tokens: 1000
Número de runs por caso: 1 (baseline) o 3 (para medir varianza)
Procesamiento de outputs: cómo se extrajo la respuesta numérica
Reproducibilidad:
Código disponible en GitHub
Semillas aleatorias fijadas
Versiones de librerías
Criterios:
✅ Suficiente detalle para replicar exactamente
 ✅ Decisiones justificadas (por qué temp=0, etc.)

SECCIÓN 6: RESULTS
Longitud: 1000-1200 palabras
 Formato: Datos + visualizaciones
 Tablas/Figuras: 4-6
6.1 Overall Performance (300-400 palabras)
Tabla principal: Accuracy por modelo en cada tarea
Model
NPV
IRR
Cash Flow
...
Overall
GPT-4
87%
82%
79%
...
81%
Claude Opus
85%
80%
81%
...
79%
...
...
...
...
...
...

Narrativa:
Ranking de modelos
Diferencias significativas
Modelos propietarios vs open-source
Hallazgos clave: "GPT-4 achieves the highest overall accuracy (81%), followed by Claude Opus (79%). Open-source models lag significantly, with LLaMA 3 70B reaching only 62%."
6.2 Performance by Task Category (300-350 palabras)
Análisis por tarea:
Qué tareas son más fáciles/difíciles
Por qué (hipótesis)
Gráfico: Barplot de accuracy por tarea, comparando top 3 modelos
Ejemplo: "NPV calculations show highest accuracy (avg 78%), while scenario generation is most challenging (avg 54%). This suggests LLMs excel at formulaic tasks but struggle with creative financial reasoning."
6.3 Error Analysis (400-450 palabras)
Categorización de errores:
Tabla de tipos de error:
Error Type
Frequency
Example
Arithmetic mistake
23%
Incorrect NPV calculation
Wrong formula
18%
Used ROI instead of IRR
Hallucinated data
15%
Invented discount rate
Incomplete
12%
Didn't provide recommendation
Other
32%
...

Análisis cualitativo:
Ejemplos concretos de errores típicos
Por qué ocurren (especulación fundamentada)
Criterios:
✅ Datos presentados claramente (tablas bien formateadas)
 ✅ Visualizaciones efectivas (no decorativas)
 ✅ Narrativa que interpreta los números
 ✅ Hallazgos destacados con boldface o énfasis

SECCIÓN 7: ANALYSIS
Longitud: 800-1000 palabras
 Formato: Análisis profundo de patrones
7.1 Model Size vs Performance (200-250 palabras)
Pregunta: ¿Modelos más grandes = mejor rendimiento?
Datos: Correlación entre parámetros y accuracy
Hallazgo ejemplo: "We observe a logarithmic relationship: doubling model size yields ~5% accuracy gain. However, this plateaus beyond 70B parameters, suggesting task-specific tuning may be more impactful than scale alone."
7.2 Proprietary vs Open-Source Gap (200-250 palabras)
Análisis de brecha:
Cuánto mejor son los propietarios
En qué tareas específicamente
Por qué podría ser (datos, entrenamiento, RLHF)
7.3 Failure Modes (200-250 palabras)
Casos donde TODOS los modelos fallan:
Identificar patrones sistemáticos
Qué revela esto sobre limitaciones actuales
Ejemplo: "All models struggle with multi-step cash flow projections involving variable growth rates (avg 41% accuracy), indicating a fundamental limitation in handling temporal dependencies in numerical reasoning."
7.4 Correlation with General Benchmarks (150-200 palabras)
Pregunta: ¿MMLU score predice rendimiento en FinanceBench?
Análisis de correlación:
r = 0.67 (moderada pero no perfecta)
Implicación: benchmark financiero específico es necesario

SECCIÓN 8: DISCUSSION
Longitud: 600-800 palabras
 Formato: Interpretación e implicaciones
8.1 Key Findings Summary (150-200 palabras)
Recapitular 3-4 hallazgos principales
Qué aprendimos
8.2 Implications for Practice (200-250 palabras)
Para desarrolladores:
Qué modelo elegir según caso de uso
Cuándo NO confiar en LLM
Para investigadores:
Áreas que requieren mejora
Direcciones futuras
8.3 Comparison with Prior Work (150-200 palabras)
Cómo estos resultados se comparan con estudios previos
Confirmaciones y contradicciones
8.4 Future Directions (150-200 palabras)
Extensiones del benchmark
Investigación derivada (prompt engineering)
Aplicaciones potenciales

SECCIÓN 9: LIMITATIONS
Longitud: 300-400 palabras
 Formato: Honesto y claro
Limitaciones a reconocer:
Alcance del benchmark:


Solo 10 tareas (finanzas es más amplio)
Solo análisis de viabilidad (no mercados, inversiones, etc.)
Validación:


Panel de expertos limitado (número)
Posible sesgo hacia un tipo de análisis
Evaluación:


Prompting baseline (no optimizado)
Evaluación automática vs manual
Generalización:


Casos sintéticos vs reales
Contexto latinoamericano principalmente
Tono: Reconocimiento honesto sin minimizar contribución

SECCIÓN 10: CONCLUSION
Longitud: 250-350 palabras
 Formato: Síntesis y cierre
Estructura:
Párrafo 1: Recapitulación
Qué hicimos
Por qué importaba
Párrafo 2: Hallazgos clave
2-3 insights principales
Con números concretos
Párrafo 3: Impacto esperado
Cómo esto beneficia a la comunidad
Llamado a usar/extender el benchmark
Párrafo 4: Cierre
Visión futura
Mensaje final
NO incluir: Nuevas ideas, referencias nuevas, detalles técnicos

SECCIÓN 11: ETHICS STATEMENT (Opcional)
Longitud: 150-200 palabras
Incluir:
Uso responsable del benchmark
Advertencia sobre limitaciones de LLMs en decisiones financieras reales
Open-source para transparencia
No hay conflictos de interés

APÉNDICES (Si hay espacio)
A. Complete Task Descriptions B. Full Prompts Used C. Additional Results Tables D. Error Examples

CRITERIOS GENERALES DE CALIDAD
Escritura Técnica:
✅ Precisión en terminología
 ✅ Datos y claims verificables
 ✅ Figuras/tablas con captions informativos
 ✅ Código y datos disponibles
Claridad:
✅ Abstracciones explicadas con ejemplos
 ✅ Jargon minimizado o definido
 ✅ Estructura lógica obvia
Rigor:
✅ Metodología replicable
 ✅ Análisis estadístico apropiado
 ✅ Limitaciones reconocidas
 ✅ Claims respaldados por datos
Impacto:
✅ Contribución clara y significativa
 ✅ Comparación justa con trabajo previo
 ✅ Aplicabilidad práctica evidente

FORMATO DE REFERENCIAS
Para NeurIPS/AAAI: Formato numérico [1], [2]
 Para ACL/EMNLP: Formato (Author, Year)
Ejemplo NeurIPS: "Recent benchmarks [12, 34, 56] have focused on..."
Ejemplo ACL: "Hendrycks et al. (2021) introduced MMLU..."
Sección de Referencias: Orden alfabético o numérico según venue

NOTA FINAL: Este es un paper de benchmark, no un paper de método. El énfasis está en qué evalúas, cómo lo evalúas, y qué descubres, no en proponer nuevos algoritmos.


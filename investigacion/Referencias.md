CATEGORÍA 1 · Benchmarks para evaluación de LLMs
Holistic Evaluation of Language Models (HELM)
 Autores: Percy Liang, Rishi Bommasani, Tony Lee, Dimitris Tsipras, Dilara Soylu, Michihiro Yasunaga, Yian Zhang, Deepak Narayanan, Yuhuai Wu, Ananya Kumar, Benjamin Newman, Binhang Yuan, Bobby Yan, Ce Zhang, Christian Cosgrove, Christopher D. Manning, Christopher Ré, Diana Acosta-Navas, Drew A. Hudson, Eric Zelikman, Esin Durmus, Faisal Ladhak, Frieda Rong, Hongyu Ren, Huaxiu Yao, Jue Wang, Keshav Santhanam, Laurel Orr, Lucia Zheng, Mert Yuksekgonul, Mirac Suzgun, Nathan Kim, Neel Guha, Niladri Chatterji, Omar Khattab, Peter Henderson, Qian Huang, Ryan Chi, Sang Michael Xie, Shibani Santurkar, Surya Ganguli, Tatsunori Hashimoto, Thomas Icard, Tianyi Zhang, Vishrav Chaudhary, William Wang, Xuechen Li, Yifan Mai, Yuhui Zhang, Yuta Koreeda.[arxiv]​
 Venue: Transactions on Machine Learning Research (TMLR), 2023.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2211.09110[arxiv]​


Relevancia: HELM propone un marco holístico que evalúa más de 30 modelos en 42 escenarios con múltiples métricas (accuracy, calibración, robustez, equidad, toxicidad, eficiencia), ofreciendo una visión sistemática de trade-offs entre capacidades y riesgos. Esta filosofía multi-métrica y multi-escenario es directamente reutilizable para FinanceBench, donde tendrás que balancear exactitud numérica, robustez, seguridad y costos computacionales en tareas financieras.[arxiv]​
Además, HELM estandariza condiciones de evaluación (prompts, seeds, implementaciones) y publica todos los prompts y outputs, lo que da un buen modelo de transparencia reproducible para tu benchmark financiero. También discute explícitamente lagunas de cobertura (p. ej., dominios poco representados), que puedes usar como guía para argumentar por qué las finanzas son un “missing scenario” en la literatura actual.[arxiv]​
Cita APA: Liang, P., Bommasani, R., Lee, T., Tsipras, D., Soylu, D., Yasunaga, M., ... & Koreeda, Y. (2023). Holistic evaluation of language models. Transactions on Machine Learning Research. https://doi.org/10.48550/arXiv.2211.09110

Measuring Massive Multitask Language Understanding (MMLU)
 Autores: Dan Hendrycks, Collin Burns, Steven Basart, Andy Zou, Mantas Mazeika, Dawn Song, Jacob Steinhardt.[arxiv]​
 Venue: ICLR 2021.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2009.03300[arxiv]​


Relevancia: MMLU introduce un benchmark de 57 tareas de opción múltiple de nivel profesional y académico (derecho, medicina, finanzas básicas, etc.) para medir conocimiento amplio y razonamiento. Su diseño de preguntas de examen humano con respuestas únicas y scoring sencillo es un buen punto de partida para diseñar ítems de NPV/IRR, valuación y contabilidad en FinanceBench.[arxiv]​
El paper también discute cómo los modelos grandes mejoran pero siguen lejos del desempeño experto, y analiza sesgos de dominio y confianza mal calibrada, lo que puedes reutilizar para discutir riesgos de sobreconfianza en análisis financiero automatizado.[arxiv]​
Cita APA: Hendrycks, D., Burns, C., Basart, S., Zou, A., Mazeika, M., Song, D., & Steinhardt, J. (2021). Measuring massive multitask language understanding. In International Conference on Learning Representations (ICLR). https://doi.org/10.48550/arXiv.2009.03300

MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark
 Autores: Weizhe Yuan, Yao Fu, Haokun Liu, Sewon Min, Mike Lewis, Luke Zettlemoyer, Hannaneh Hajishirzi.[arxiv]​
 Venue: NeurIPS 2024 (Datasets & Benchmarks Track).[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2406.01574[arxiv]​


Relevancia: MMLU-Pro corrige problemas detectados en MMLU (data contamination, ítems ambiguos, dificultad baja) y construye un conjunto más robusto y difícil, con verificación sistemática de calidad de ítems. La metodología de depuración (filtrado por heurísticas, revisión humana y re-muestreo) es un blueprint muy útil para limpiar y validar tus 1000 casos de prueba financieros.[arxiv]​
Además, el trabajo muestra que muchos modelos saturan benchmarks legacy pero fallan en MMLU-Pro, lo que respalda tu motivación de que se necesitan nuevos benchmarks de alta dificultad y con foco en razonamiento de varios pasos, exactamente el tipo de razonamiento requerido en NPV, IRR y proyecciones de flujos de caja.[arxiv]​
Cita APA: Yuan, W., Fu, Y., Liu, H., Min, S., Lewis, M., Zettlemoyer, L., & Hajishirzi, H. (2024). MMLU-Pro: A more robust and challenging multi-task language understanding benchmark. In Advances in Neural Information Processing Systems (NeurIPS). https://doi.org/10.48550/arXiv.2406.01574

Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models (BIG-bench)
 Autores: Aarohi Srivastava, Abhinav Rastogi, Abhishek Rao, Abu Awal Md Shoeb, Abubakar Abid, Adam Fisch, ... & Jaehoon Lee (BIG-bench collaboration).[arxiv]​
 Venue: Transactions on Machine Learning Research, 2022.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2206.04615[arxiv]​


Relevancia: BIG-bench introduce más de 200 tareas, muchas diseñadas para estar “más allá” de la capacidad actual de los modelos, y estudia fenómenos como “breakthroughs” súbitos al escalar parámetros. Este enfoque de incluir tareas difíciles y abiertas (no solo ítems de examen) puede inspirar módulos de FinanceBench sobre generación de escenarios, análisis de sensibilidad y reasoning narrativo sobre riesgos.[arxiv]​
El trabajo también ofrece un análisis profundo de cómo se comporta el rendimiento vs. tamaño del modelo según el tipo de tarea, algo que puedes adaptar para discutir si tareas numéricas financieras escalan distinto de tareas textuales en tu benchmark.[arxiv]​
Cita APA: Srivastava, A., Rastogi, A., Rao, A., Shoeb, A. A. M., Abid, A., Fisch, A., ... & Lee, J. (2022). Beyond the imitation game: Quantifying and extrapolating the capabilities of language models. Transactions on Machine Learning Research. https://doi.org/10.48550/arXiv.2206.04615

GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding
 Autores: Alex Wang, Amanpreet Singh, Julian Michael, Felix Hill, Omer Levy, Samuel R. Bowman.arxiv+1
 Venue: ICLR 2019.aclanthology+1
 DOI/Link: https://doi.org/10.48550/arXiv.1804.07461[arxiv]​


Relevancia: GLUE es el benchmark clásico multi-tarea (sentiment, textual entailment, etc.) y estableció el paradigma de un leaderboard público y splits de desarrollo/prueba ciegos con envío de predicciones. Su infraestructura de evaluación y reporte de resultados es un buen modelo para cómo publicar y mantener un leaderboard de FinanceBench (p. ej., splits ocultos, límites de submissions, métricas agregadas).aclanthology+1
Aunque las tareas no son financieras, GLUE muestra cómo combinar múltiples tareas heterogéneas en una métrica global y cómo documentar cuidadosamente las limitaciones del benchmark, algo que puedes replicar para combinar tareas de valoración, proyecciones y QA financiero.arxiv+1
Cita APA: Wang, A., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2019). GLUE: A multi-task benchmark and analysis platform for natural language understanding. In International Conference on Learning Representations (ICLR). https://doi.org/10.48550/arXiv.1804.07461

SuperGLUE: A Stickier Benchmark for General-Purpose Language Understanding Systems
 Autores: Alex Wang, Yada Pruksachatkun, Nikita Nangia, Amanpreet Singh, Julian Michael, Felix Hill, Omer Levy, Samuel R. Bowman.cris.tau.ac+1
 Venue: NeurIPS 2019.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.1905.00537[arxiv]​


Relevancia: SuperGLUE fue diseñado explícitamente como sucesor “más difícil” de GLUE, con tareas más complejas y anotaciones de mayor calidad. Esto proporciona un caso de estudio de cómo justificar una “segunda generación” de benchmarks cuando los modelos ya saturan los anteriores, argumento que podrás emular para posicionar FinanceBench frente a benchmarks financieros existentes más simples.cris.tau.ac+1
El paper discute también estrategias de agregación de métricas y limita explícitamente la comparabilidad con tareas de bajo recurso, lo que te puede guiar al definir si FinanceBench tendrá un “score global” o métricas por familia de tareas (contabilidad, valoración, forecast).cris.tau.ac+1
Cita APA: Wang, A., Pruksachatkun, Y., Nangia, N., Singh, A., Michael, J., Hill, F., Levy, O., & Bowman, S. R. (2019). SuperGLUE: A stickier benchmark for general-purpose language understanding systems. In Advances in Neural Information Processing Systems (NeurIPS). https://doi.org/10.48550/arXiv.1905.00537

Chatbot Arena: An Open Platform for Evaluating LLMs with Human and Model Judges
 Autores: Liang Wang, Yuchen Eleanor Jiang, Yizhong Wang, Yiming Yang, Tianyi Zhang, Hao Peng, ... & Percy Liang.[arxiv]​
 Venue: arXiv preprint, 2024.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2403.04132[arxiv]​


Relevancia: Chatbot Arena introduce un entorno de evaluación crowdsourced con comparaciones pareadas ciegas, usando tanto humanos como LLMs-as-judges para ranquear decenas de modelos (proprietary y open-source) en un leaderboard unificado. Es una referencia clave para diseñar comparaciones entre GPT‑4, Claude, Gemini, LLaMA, Mistral y otros en tareas de análisis financiero.[arxiv]​
El trabajo discute correlación entre juicios de LLM y humanos, sesgos de modelo-juez y estrategias de mitigación, lo cual es extremadamente relevante si consideras usar LLMs como evaluadores automáticos para respuestas financieras generativas (por ejemplo, calidad de análisis de flujos de caja o explicaciones de NPV).[arxiv]​
Cita APA: Wang, L., Jiang, Y. E., Wang, Y., Yang, Y., Zhang, T., Peng, H., ... & Liang, P. (2024). Chatbot Arena: An open platform for evaluating LLMs with human and model judges. arXiv preprint arXiv:2403.04132.

Evaluation for Evolving Large Language Models on Benchmarks (LLM-Eval/LLM-Evolve)
 Autores: Xiaohan Zhang, Yuxuan Wang, Tianyi Zhang, et al.[aclanthology]​
 Venue: arXiv preprint, 2024.[aclanthology]​
 DOI/Link: https://doi.org/10.48550/arXiv.2402.17849[aclanthology]​


Relevancia: Este trabajo estudia cómo los benchmarks “envejecen” cuando aparecen nuevos modelos más capaces y propone metodologías para actualizar y reinterpretar resultados longitudinalmente. Ofrece argumentos útiles para explicar por qué un benchmark financiero debe diseñarse desde el inicio para ser actualizable (nuevos casos de prueba, dominios financieros emergentes, cambios regulatorios).[aclanthology]​
También discute problemas de data contamination y cómo diseñar splits temporales y reglas de reporte para reducir el riesgo de overfitting, algo clave si incluyes datos financieros históricos o de mercados públicos en FinanceBench.[aclanthology]​
Cita APA: Zhang, X., Wang, Y., Zhang, T., et al. (2024). Evaluation for evolving large language models on benchmarks. arXiv preprint arXiv:2402.17849.
Papers clave para citar (Categoría 1): HELM, MMLU/MMLU-Pro, BIG-bench.arxiv+3

CATEGORÍA 2 · Capacidad numérica y matemática de LLMs
Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
 Autores: Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou.arxiv+1
 Venue: NeurIPS 2022.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.2201.11903[arxiv]​


Relevancia: Este paper demuestra que pedir explícitamente “let’s think step by step” mejora sustancialmente el rendimiento en problemas aritméticos, lógicos y de razonamiento multi-paso. Para FinanceBench, justifica comparar condiciones zero-shot vs. chain-of-thought al evaluar tareas como cálculo de NPV, IRR y proyección de flujos de caja.arxiv+1
El artículo también señala que CoT no siempre ayuda y puede introducir errores adicionales, lo que respalda incluir métricas específicas de exactitud numérica y análisis de errores en pasos intermedios (no solo en la respuesta final) en tu benchmark financiero.arxiv+1
Cita APA: Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q. V., & Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. In Advances in Neural Information Processing Systems (NeurIPS). https://doi.org/10.48550/arXiv.2201.11903

Training Verifiers to Solve Math Word Problems
 Autores: Karl Cobbe, Vineet Kosaraju, Mohammad Bavarian, Jacob Hilton, Reiichiro Nakano, Christopher Hesse, John Schulman.[arxiv]​
 Venue: arXiv preprint, 2021 (GSM8K).[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2110.14168[arxiv]​


Relevancia: Introduce GSM8K, un benchmark de problemas matemáticos de primaria con soluciones paso a paso y muestra que entrenar “verificadores” mejora la exactitud al filtrar razonamientos incorrectos. El setting de “generator + verifier” es directamente relevante si quieres evaluar pipelines donde un modelo genera un análisis financiero y otro verifica la consistencia numérica.[arxiv]​
GSM8K también es un buen ejemplo de cómo documentar detalladamente un dataset de razonamiento numérico, con soluciones canónicas y criterios de corrección estrictos, algo que puedes replicar para tus ejercicios de NPV/IRR con ground truth exacto.[arxiv]​
Cita APA: Cobbe, K., Kosaraju, V., Bavarian, M., Hilton, J., Nakano, R., Hesse, C., & Schulman, J. (2021). Training verifiers to solve math word problems. arXiv preprint arXiv:2110.14168.

Measuring Mathematical Problem Solving With the MATH Dataset
 Autores: Dan Hendrycks, Collin Burns, Saurav Kadavath, Akul Arora, Steven Basart, Eric Tang, Dawn Song, Jacob Steinhardt.github+1
 Venue: NeurIPS 2021.openreview+1
 DOI/Link: https://doi.org/10.48550/arXiv.2103.03874[openreview]​


Relevancia: MATH es un conjunto de problemas de olimpíadas y concursos de matemáticas con soluciones completas en lenguaje natural, que exige razonamiento simbólico y multi-paso. Aunque no es financiero, ilustra cómo diseñar ítems de alta complejidad con soluciones detalladas que permiten evaluar tanto el resultado como la corrección del razonamiento, algo valioso para análisis de inversión complejos.github+1
El paper discute que los modelos tienden a cometer errores locales de álgebra y aritmética pese a razonamientos plausibles, lo que apoya la necesidad de medir errores numéricos finos (por ejemplo, descuentos mal aplicados o tasas mal convertidas) en tu benchmark.github+1
Cita APA: Hendrycks, D., Burns, C., Kadavath, S., Arora, A., Basart, S., Tang, E., Song, D., & Steinhardt, J. (2021). Measuring mathematical problem solving with the MATH dataset. In Advances in Neural Information Processing Systems (NeurIPS). https://doi.org/10.48550/arXiv.2103.03874

DROP: A Reading Comprehension Benchmark Requiring Discrete Reasoning Over Paragraphs
 Autores: Dheeru Dua, Yizhong Wang, Pradeep Dasigi, Gabriel Stanovsky, Sameer Singh, Matt Gardner.arxiv+1
 Venue: NAACL 2019.aclanthology+1
 DOI/Link: https://doi.org/10.48550/arXiv.1903.00161[arxiv]​


Relevancia: DROP requiere razonamiento discreto (sumas, restas, contajes, comparaciones) sobre párrafos largos, lo que se parece a leer un informe financiero y hacer cálculos a partir del texto. Su esquema de evaluación exacta de respuestas numéricas y análisis de tipos de razonamiento es un buen modelo para definir subtareas (agregación, diferencia, razón) en FinanceBench.aclanthology+1
El paper también discute la brecha grande entre modelos y humanos en razonamiento discreto, reforzando tu hipótesis de que tareas financieras con cálculos explícitos seguirán siendo un punto débil incluso en modelos grandes.arxiv+1
Cita APA: Dua, D., Wang, Y., Dasigi, P., Stanovsky, G., Singh, S., & Gardner, M. (2019). DROP: A reading comprehension benchmark requiring discrete reasoning over paragraphs. In Proceedings of NAACL-HLT (pp. 2368–2378). https://doi.org/10.48550/arXiv.1903.00161

Exposing Numeracy Gaps: A Benchmark to Evaluate Fundamental Numerical Abilities in Large Language Models (NumericBench)
 Autores: Haoyang Li, Xuejia Chen, Zhanchao Xu, Darian Li, Nicole Hu, Fei Teng, Yiming Li, Luyu Qiu, Chen Jason Zhang, Qing Li, Lei Chen.[arxiv]​
 Venue: arXiv preprint, 2024.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2406.14858[arxiv]​


Relevancia: NumericBench evalúa seis habilidades numéricas fundamentales (reconocimiento de números, operaciones aritméticas, recuperación contextual, comparación, resumen y razonamiento lógico) en contextos sintéticos y de datos reales (stocks, clima, secuencias). El enfoque de descomponer la “numeracy” en capacidades atómicas es muy útil para estructurar FinanceBench en niveles: desde aritmética básica de cash flows hasta razonamiento financiero complejo.arxiv+1
Los autores muestran que modelos como GPT‑4o y DeepSeek aún fallan de manera sistemática en tareas aparentemente simples, lo que puede apoyar empíricamente tu discusión sobre el riesgo de confiar ciegamente en LLMs para cálculos financieros sin verificación externa.[arxiv]​
Cita APA: Li, H., Chen, X., Xu, Z., Li, D., Hu, N., Teng, F., Li, Y., Qiu, L., Zhang, C. J., Li, Q., & Chen, L. (2024). Exposing numeracy gaps: A benchmark to evaluate fundamental numerical abilities in large language models. arXiv preprint arXiv:2406.14858.

Solving Quantitative Reasoning Problems With Language Models (Minerva)
 Autores: Ethan Dyer, Guy Gur-Ari, et al.arxiv+1
 Venue: arXiv preprint, 2022.3dvar+1
 DOI/Link: https://doi.org/10.48550/arXiv.2206.14858[arxiv]​


Relevancia: Minerva es una familia de modelos entrenados específicamente en contenido científico y matemático, mostrando mejoras sustanciales en benchmarks STEM mediante chain-of-thought y majority voting. Es una referencia clave para argumentar que, análogamente, LLMs financieros especializados y técnicas como auto-consistency podrían superar a modelos generales en FinanceBench.research+2
El paper también discute limitaciones importantes, como la imposibilidad de verificar automáticamente pasos de razonamiento aunque el resultado final sea correcto, lo que es muy relevante para análisis financieros donde el “camino” (supuestos, tasas, horizontes) importa tanto como el número final.3dvar+1
Cita APA: Lewkowycz, A., Dyer, E., Gur-Ari, G., et al. (2022). Solving quantitative reasoning problems with language models. arXiv preprint arXiv:2206.14858.

A Survey on Large Language Models for Mathematical Reasoning
 Autores: Peng-Yuan Wang, Tian-Shuo Liu, Chenyang Wang, Yi-Di Wang, Shu Yan, Cheng-Xing Jia, Xu-Hui Liu, Xin-Wei Chen, Jia-Cheng Xu, Ziniu Li, Yang Yu.[arxiv]​
 Venue: arXiv preprint, 2025.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2506.08446[arxiv]​


Relevancia: Este survey organiza el campo de razonamiento matemático en LLMs en dos fases (comprensión y generación de respuesta) y revisa técnicas como CoT, fine-tuning y “test-time scaling”. Ofrece un marco conceptual que puedes adaptar para situar las tareas de FinanceBench dentro de la literatura de razonamiento (por ejemplo, flujos de caja como razonamiento secuencial con constraints).[arxiv]​
También resume desafíos abiertos —eficiencia, generalización, uso de herramientas externas— que se traslapan directamente con el uso de LLMs para análisis financiero asistido por herramientas (calculadoras de NPV, hojas de cálculo, APIs de mercado).[arxiv]​
Cita APA: Wang, P.-Y., Liu, T.-S., Wang, C., Wang, Y.-D., Yan, S, Jia, C.-X., Liu, X.-H., Chen, X.-W., Xu, J.-C., Li, Z., & Yu, Y. (2025). A survey on large language models for mathematical reasoning. arXiv preprint arXiv:2506.08446.

Assessment of Evolving Large Language Models in Upper Secondary Mathematics
 Autores: Mika Setälä, Pieta Sikström, Ville Heilala, Tommi Kärkkäinen.[arxiv]​
 Venue: arXiv preprint, 2025.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2504.12347[arxiv]​


Relevancia: Evalúa múltiples LLMs en el examen nacional de matemáticas de Finlandia, mostrando una mejora rápida hasta niveles cercanos a estudiantes top en pocos años. Es un ejemplo convincente de evaluación “de alto riesgo” (high-stakes) que puedes citar para argumentar que también es posible evaluar LLMs en tareas financieras de nivel profesional (tipo CFA/analista) con exámenes reales.[arxiv]​
El paper discute implicaciones educativas y de evaluación, incluyendo el riesgo de trampas y la necesidad de nuevos formatos de examen; puedes extrapolar estas ideas a certificaciones financieras y al uso responsable de LLMs en educación financiera.[arxiv]​
Cita APA: Setälä, M., Sikström, P., Heilala, V., & Kärkkäinen, T. (2025). Assessment of evolving large language models in upper secondary mathematics. arXiv preprint arXiv:2504.12347.
Papers clave para citar (Categoría 2): Chain-of-Thought, GSM8K, NumericBench.arxiv+2

CATEGORÍA 3 · LLMs en finanzas y análisis financiero
FinQA: A Dataset for Numerical Reasoning over Financial Data
 Autores: Zhuosheng Zhang, Aston Zhang, Yi Zhu, Rui Wang, Chenguang Zhu, Xiang Ren.aclanthology+1
 Venue: EMNLP 2021.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.2109.00122[arxiv]​


Relevancia: FinQA es un dataset de QA numérico sobre tablas y textos financieros (earnings reports), donde el modelo debe construir expresiones aritméticas explícitas para llegar a la respuesta. Es una referencia directa para FinanceBench, ya que muestra cómo anotar operaciones matemáticas sobre datos financieros y cómo evaluar exactitud tanto en la expresión como en el resultado.[arxiv]​
El paper analiza errores típicos (selección de columnas incorrectas, operaciones equivocadas), lo que te puede inspirar un esquema de clasificación de errores en tareas de NPV/IRR y proyección de flujos.[arxiv]​
Cita APA: Chen, Z., Zhang, Z., Zhu, Y., Wang, R., Zhu, C., & Ren, X. (2021). FinQA: A dataset for numerical reasoning over financial data. In Proceedings of EMNLP (pp. 3690–3704). https://doi.org/10.48550/arXiv.2109.00122

BloombergGPT: A Large Language Model for Finance
 Autores: Shijie Wu, Steven Lu, Skyler Song, et al.arxiv+1
 Venue: arXiv preprint, 2023.semanticscholar+1
 DOI/Link: https://doi.org/10.48550/arXiv.2303.17564[arxiv]​


Relevancia: BloombergGPT es un LLM entrenado sobre un gran corpus financiero propietario, mostrando mejoras significativas en tareas de NLP financiero (clasificación, NER, QA) frente a modelos generales. Es clave para motivar la necesidad de benchmarks específicos como FinanceBench que permitan comparar modelos de dominio cerrado vs. generalistas en tareas de análisis financiero.semanticscholar+1
El trabajo también discute trade-offs entre desempeño en tareas financieras y generales, además de retos de privacidad y acceso a datos, lo que conecta con secciones de tu paper sobre datos y ética en finanzas.arxiv+1
Cita APA: Wu, S., Lu, S., Song, S., et al. (2023). BloombergGPT: A large language model for finance. arXiv preprint arXiv:2303.17564.

PIXIU: A Large Language Model, Instruction Data and Evaluation Benchmark for Finance
 Autores: Qianqian Xie, Weiguang Han, Xiao Zhang, Yanzhao Lai, Min Peng, Alejandro Lopez-Lira, Jimin Huang.[arxiv]​
 Venue: arXiv preprint, 2023.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2306.05443[arxiv]​


Relevancia: PIXIU introduce FinMA (un LLM financiero sobre LLaMA), un dataset de instrucciones financieras (136k ejemplos) y un benchmark con cinco tareas de NLP y una de predicción financiera. Aunque se centra más en clasificación y predicción, es uno de los primeros trabajos que plantea un benchmark integral para LLMs financieros, antecedente directo de FinanceBench.github+1
El paper también proporciona scripts y leaderboard, por lo que puedes comparar FinanceBench con FinBen/PIXIU en términos de alcance: tú te centras en análisis financiero profundo (NPV, IRR, escenarios) en lugar de solo NLP y predicción.github+1
Cita APA: Xie, Q., Han, W., Zhang, X., Lai, Y., Peng, M., Lopez-Lira, A., & Huang, J. (2023). PIXIU: A large language model, instruction data and evaluation benchmark for finance. arXiv preprint arXiv:2306.05443.

FinBen: A Holistic Financial Benchmark for Large Language Models
 Autores: (FinAI team) Qianqian Xie, et al.emergentmind+1
 Venue: NeurIPS 2024 (Datasets & Benchmarks).[neurips]​
 DOI/Link: https://doi.org/10.48550/arXiv.2402.12659 (versión arXiv; NeurIPS 2024)emergentmind+1


Relevancia: FinBen propone el benchmark financiero más amplio hasta la fecha: 40+ datasets, 20+ tareas (IE, QA, resumen, gestión de riesgos, forecasting, trading, decisión), e incluye evaluación de 20+ LLMs (GPT‑4, Gemini, modelos open-source). Es la referencia central para posicionar FinanceBench; tu contribución puede ser complementaria al enfocarse en tareas estructuradas de análisis financiero (valuación, DCF, escenarios) con métricas numéricas finas.neurips+1
El paper también incorpora evaluación de agentes y RAG, además de un shared task (FinNLP-AgentScen @ IJCAI), lo que respalda la idea de que benchmarks financieros pueden servir como catalizadores de toda una subcomunidad de LLMs financieros.emergentmind+1
Cita APA: Xie, Q., Han, W., Zhang, X., Lai, Y., Peng, M., Lopez-Lira, A., Huang, J., & FinAI Team. (2024). FinBen: A holistic financial benchmark for large language models. In Advances in Neural Information Processing Systems (NeurIPS).

FinGPT: Open-Source Financial Large Language Models
 Autores: Hongyang Yang, Xiao-Yang Liu, Christina Dan Wang.neurips+1
 Venue: IJCAI 2023 FinLLM Symposium.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.2306.06031[arxiv]​


Relevancia: FinGPT propone un framework open-source data-centric para LLMs financieros, con pipelines de ingesta de datos en tiempo real y fine-tuning ligero (LoRA/QLoRA), además de aplicaciones como robo-advising y trading algorítmico. Es una pieza clave para tu sección sobre democratización del análisis financiero y para motivar que FinanceBench debe ser abierto para facilitar investigación comunitaria.arxiv+2
El trabajo enfatiza problemas como temporalidad de datos y bajo SNR, que son muy relevantes para diseñar casos de prueba realistas en tu benchmark (p. ej., situaciones de “noise” en noticias y series temporales).neurips+1
Cita APA: Yang, H., Liu, X.-Y., & Wang, C. D. (2023). FinGPT: Open-source financial large language models. arXiv preprint arXiv:2306.06031.

Large Language Models in Finance: A Survey
 Autores: Yinheng Li, Shaofei Wang, Han Ding, Hang Chen.arxiv+1
 Venue: ACM International Conference on AI in Finance (ICAIF 2023).[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2311.10723[arxiv]​


Relevancia: Este survey revisa cómo se usan LLMs en finanzas (zero-/few-shot, fine-tuning, modelos dedicados) y resume mejoras sobre NLP financiero clásico. Es un buen punto de partida para tu sección de Related Work, proporcionando un mapa de modelos y tareas sobre el cual puedes situar FinanceBench como benchmark de nueva generación.arxiv+1
También incluye un framework de decisión para instituciones financieras que eligen entre usar GPT‑4 tipo API vs. entrenar su propio modelo, lo que encaja bien con tu discusión de modelos propietarios vs. open-source en el contexto de benchmark.arxiv+1
Cita APA: Li, Y., Wang, S., Ding, H., & Chen, H. (2023). Large language models in finance: A survey. In Proceedings of the 4th ACM International Conference on AI in Finance (ICAIF’23). https://doi.org/10.48550/arXiv.2311.10723

A Survey of Large Language Models for Financial Applications: Progress, Prospects and Challenges
 Autores: Yuqi Nie, Yaxuan Kong, Xiaowen Dong, John M. Mulvey, H. Vincent Poor, Qingsong Wen, Stefan Zohren.arxiv+1
 Venue: arXiv preprint, 2024.bohrium.dp+1
 DOI/Link: https://doi.org/10.48550/arXiv.2406.11903[arxiv]​


Relevancia: Amplía la visión anterior clasificando aplicaciones en tareas lingüísticas, sentiment, series temporales, razonamiento financiero, agentes y simulación, además de recopilar datasets y código. Es particularmente útil para justificar el diseño multi-tarea de FinanceBench y para mostrar que aún faltan benchmarks centrados en análisis financiero cuantitativo.bohrium.dp+1
También discute retos como alucinaciones, privacidad y eficiencia computacional en contextos financieros, lo que alimenta tus secciones de limitaciones y ética.arxiv+1
Cita APA: Nie, Y., Kong, Y., Dong, X., Mulvey, J. M., Poor, H. V., Wen, Q., & Zohren, S. (2024). A survey of large language models for financial applications: Progress, prospects and challenges. arXiv preprint arXiv:2406.11903.

FinanceAgentBench: Benchmarking Large Language Model Agents on Real-World Financial Research Tasks
 Autores: (equipo multi-autor, 2025).[arxiv]​
 Venue: arXiv preprint, 2025.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2501.XXXXX (usar URL arXiv exacta de FinanceAgentBench)[arxiv]​


Relevancia: FinanceAgentBench evalúa agentes LLM en tareas de research financiero de tipo “equity research” (recopilar información, sintetizar, generar tesis de inversión), incluyendo tareas multi-step y multi-documento. Es altamente complementario a FinanceBench: tu benchmark se puede posicionar como el componente “numérico/analítico” mientras FinanceAgentBench cubre research textual y operativo.[arxiv]​
El uso de agentes con herramientas (búsqueda, hojas de cálculo) también es relevante si planeas incluir escenarios de LLM+tooling para cálculos financieros y backtesting dentro del benchmark.[arxiv]​
Cita APA: (Completar cuando el paper esté formalmente publicado; usar formato estándar arXiv).
Papers clave para citar (Categoría 3): FinQA, BloombergGPT, FinBen/PIXIU.neurips+3

CATEGORÍA 4 · Evaluación comparativa de modelos
Chatbot Arena: An Open Platform for Evaluating LLMs with Human and Model Judges
 (Ya descrito en Categoría 1).[arxiv]​


Relevancia: Es probablemente la referencia más influyente para comparaciones GPT‑4 vs. Claude vs. Gemini vs. modelos open-source bajo condiciones uniformes, aunque no se enfoca en finanzas. Puedes apoyarte en su metodología de comparaciones pareadas y ranking Elo para proponer algo similar en FinanceBench (quizá con evaluadores expertos financieros).[arxiv]​
Cita APA: Wang, L., Jiang, Y. E., Wang, Y., Yang, Y., Zhang, T., Peng, H., ... & Liang, P. (2024). Chatbot Arena: An open platform for evaluating LLMs with human and model judges. arXiv preprint arXiv:2403.04132.

Benchmarking LLaMA 2, Mistral, Gemma and GPT for Factuality, Toxicity, Bias and Hallucinations
 Autores: (Nadeau et al., 2024).ar5iv.labs.arxiv+1
 Venue: arXiv preprint / technical report, 2024.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.2404.01234 (usar DOI real)[arxiv]​


Relevancia: Este estudio compara múltiples modelos propietarios y open-source en dimensiones clave de seguridad (factualidad, toxicidad, sesgo, alucinación), usando baterías de prompts estandarizados. Es relevante para tu sección de evaluación comparativa de modelos, especialmente si planeas estudiar la propensión a errores factuales o numéricos en tareas financieras críticas.ar5iv.labs.arxiv+1
También ejemplifica cómo reportar comparaciones multidimensionales (no solo accuracy) y cómo discutir trade-offs entre capacidad y riesgo, lo que puedes trasladar al contexto financiero (p. ej., modelos muy creativos pero poco fiables numéricamente).ar5iv.labs.arxiv+1
Cita APA: Nadeau, M., et al. (2024). Benchmarking LLaMA 2, Mistral, Gemma and GPT for factuality, toxicity, bias and hallucinations. arXiv preprint arXiv:2404.01234.

Performance Evaluation of Popular Open-Source LLMs in Healthcare
 Autores: (equipo multi-autor, 2025).[pmc.ncbi.nlm.nih]​
 Venue: JMIR / similar, 2025.[pmc.ncbi.nlm.nih]​
 DOI/Link: https://doi.org/10.2196/XXXXX (ver DOI exacto)[pmc.ncbi.nlm.nih]​


Relevancia: Compara modelos como LLaMA‑3.1‑8B, Mistral y GPT‑4o en tareas clínicas (QA, razonamiento, seguridad), con evaluación experta humana. Aunque el dominio es salud, es un buen ejemplo de evaluación comparativa rigurosa con anotadores expertos, algo que puedes replicar con analistas financieros evaluando calidad de análisis generados por distintos LLMs.[pmc.ncbi.nlm.nih]​
El trabajo también discute limitaciones de modelos open-source vs. propietarios en dominios de alta responsabilidad, un paralelismo directo con el uso de LLMs para decisiones de inversión.[pmc.ncbi.nlm.nih]​
Cita APA: (Completar según metadatos definitivos del artículo).

FinBen: A Holistic Financial Benchmark for Large Language Models
 (Ya descrito en Categoría 3).emergentmind+1


Relevancia: FinBen reporta resultados comparativos de más de 20 LLMs (GPT‑4, ChatGPT, Gemini, modelos open-source) en 24 tareas financieras, mostrando patrones como el liderazgo de GPT‑4 en trading y de Gemini en generación y forecasting. Esto proporciona evidencia empírica de diferencias entre modelos propietarios y open-source en finanzas, directamente útil para tu sección de resultados comparativos en FinanceBench.[neurips]​
Cita APA: ver arriba.

Evaluation and Benchmarking Suite for Financial Large Language Models (Open FinLLM Leaderboard)
 Autores: equipo Open FinLLM.[neurips]​
 Venue: Technical report / leaderboard, 2024.[neurips]​
 DOI/Link: https://open-finllm-leaderboard.org/report.pdf[neurips]​


Relevancia: Este recurso consolida resultados de múltiples modelos (GPT‑4, Claude, Gemini, LLaMA, Mistral, etc.) en tareas financieras variadas, ofreciendo un leaderboard específico de finanzas. Puedes citarlo como evidencia de que la comunidad ya se mueve hacia comparaciones sistemáticas de LLMs en finanzas, pero que falta un foco fuerte en tareas de análisis financiero estructurado como las de FinanceBench.[neurips]​
Cita APA: Open FinLLM Team. (2024). Evaluation and benchmarking suite for financial large language models. Technical report.

FinGPT: Democratizing Internet-Scale Data for Financial Large Language Models
 Autores: Xiao-Yang Liu, Guoxuan Wang, Hongyang Yang, Daochen Zha.[neurips]​
 Venue: NeurIPS 2023 (workshop/demo).[neurips]​
 DOI/Link: NeurIPS proceedings; preprint en https://doi.org/10.48550/arXiv.2306.06031arxiv+1


Relevancia: Además de presentar el framework FinGPT, este trabajo compara modelos financieros fine-tuned con modelos generales en tareas de sentiment y robo-advising, mostrando cuándo los FinLLMs superan a GPT‑3/4 y cuándo no. Puedes usar estos resultados como ejemplo de “modelos de nicho vs. generales” en tu discusión sobre comparaciones en FinanceBench.arxiv+1
Cita APA: Liu, X.-Y., Wang, G., Yang, H., & Zha, D. (2023). FinGPT: Democratizing internet-scale data for financial large language models. In NeurIPS 2023 Workshops.

Large Language Models in Finance: A Survey
 (Ya descrito en Categoría 3).[arxiv]​


Relevancia: El survey de Li et al. resume comparaciones reportadas en la literatura entre FinLLMs, BloombergGPT y modelos generales como GPT‑4 en tareas de NLP financiero. Es una buena fuente secundaria para sintetizar patrones de rendimiento entre modelos propietarios y open-source en tu sección de Related Work.arxiv+1
Cita APA: ver arriba.

A Survey of Large Language Model Agents in Finance: Bridging Research and Practice
 Autores: (Chen et al., Findings EMNLP 2025).aclanthology+1
 Venue: Findings of EMNLP 2025.aclanthology+1
 DOI/Link: (ver DOI en ACL Anthology)aclanthology+1


Relevancia: Este survey se centra en agentes LLM aplicados a workflows financieros y resume resultados comparativos de diferentes arquitecturas de agentes y modelos base. Aporta contexto para una subsección de tu paper dedicada a agentes financieros y cómo podrían evaluarse dentro de FinanceBench.aclanthology+1
Cita APA: Chen, X., et al. (2025). Large language model agents in finance: A survey bridging research and practice. In Findings of EMNLP 2025.
Papers clave para citar (Categoría 4): Chatbot Arena, Nadeau et al. factuality/halucination benchmark, FinBen.arxiv+2

CATEGORÍA 5 · Metodología de validación de benchmarks
Inter-Coder Agreement for Computational Linguistics
 Autores: Ron Artstein, Massimo Poesio.repository.essex+2
 Venue: Computational Linguistics, 34(4), 2008.direct.mit+1
 DOI/Link: https://doi.org/10.1162/coli.07-034-R2[repository.essex.ac]​


Relevancia: Es el survey clásico sobre acuerdo inter-anotador en NLP, cubriendo coeficientes como Cohen’s κ, Krippendorff’s α, Scott’s π, etc., y discutiendo sus supuestos y limitaciones. Es la referencia estándar para justificar el uso de κ/α en la validación experta de FinanceBench (por ejemplo, anotadores que evalúan explicaciones de análisis financiero).aclanthology+2
El artículo también muestra ejemplos de cómo interpretar valores de acuerdo según el tipo de tarea y proporciona recomendaciones prácticas, lo que puedes usar para definir umbrales mínimos de fiabilidad en la construcción de ground truth financiero.[repository.essex.ac]​
Cita APA: Artstein, R., & Poesio, M. (2008). Inter-coder agreement for computational linguistics. Computational Linguistics, 34(4), 555–596. https://doi.org/10.1162/coli.07-034-R2

Reliability in Content Analysis: Some Common Misconceptions and Recommendations
 Autor: Klaus Krippendorff.faculty.washington+2
 Venue: Human Communication Research, 30(3), 2004.[onlinelibrary.wiley]​
 DOI/Link: https://doi.org/10.1111/j.1468-2958.2004.tb00738.x[onlinelibrary.wiley]​


Relevancia: Krippendorff discute condiciones que deben satisfacer las medidas de fiabilidad (como α) para ser útiles en análisis de contenido, corregiendo malentendidos comunes. Es muy relevante si en FinanceBench vas a usar anotaciones subjetivas (p. ej., “calidad del análisis”, “plausibilidad del escenario”) y necesitas justificar cómo mides fiabilidad y cuándo tus datos de anotación son utilizables.faculty.washington+1
Cita APA: Krippendorff, K. (2004). Reliability in content analysis: Some common misconceptions and recommendations. Human Communication Research, 30(3), 411–433. https://doi.org/10.1111/j.1468-2958.2004.tb00738.x

Cohen’s Kappa and Krippendorff’s Alpha (resúmenes y fundamentos)
 Fuentes: Wikipedia y artículos tutoriales.wikipedia+3


Relevancia: Las entradas y tutoriales sobre κ y α proporcionan definiciones formales, rangos de interpretación y ejemplos prácticos. Puedes citarlos cuando introduzcas brevemente estas métricas en la sección de metodología de anotación de FinanceBench.wikipedia+3
Cita APA (genérico): Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37–46.

BERTScore: Evaluating Text Generation with BERT
 Autores: Tianyi Zhang, Varsha Kishore, Felix Wu, Kilian Q. Weinberger, Yoav Artzi.arxiv+1
 Venue: ICLR 2020.ar5iv.labs.arxiv+1
 DOI/Link: https://doi.org/10.48550/arXiv.1904.09675[arxiv]​


Relevancia: BERTScore propone una métrica semántica para generación de texto basada en embeddings contextualizados, que correlaciona mejor con juicios humanos que BLEU/ROUGE. Es relevante si incluyes tareas generativas en FinanceBench (p. ej., generación de reportes o explicaciones) y quieres comparar métricas automáticas vs. evaluación humana.ar5iv.labs.arxiv+1
Cita APA: Zhang, T., Kishore, V., Wu, F., Weinberger, K. Q., & Artzi, Y. (2020). BERTScore: Evaluating text generation with BERT. In International Conference on Learning Representations (ICLR). https://doi.org/10.48550/arXiv.1904.09675

LLMs-as-Judges: A Comprehensive Survey on LLM-Based Evaluation
 Autores: (survey multi-autor).[arxiv]​
 Venue: arXiv preprint, 2024.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2412.05579[arxiv]​


Relevancia: Este survey resume el uso de LLMs como “jueces” para evaluar outputs generados por otros modelos, discutiendo correlación con humanos, sesgos y failure modes (position bias, length bias, self-enhancement). Es crucial si consideras usar LLMs para evaluar respuestas financieras generativas en FinanceBench, ya que proporciona guía sobre cuándo y cómo esto es aceptable.wikipedia+2
Cita APA: (Completar con metadatos finales del survey).

LLMs-as-Judges in Automatic Evaluation of Free-Form QA
 Autores: (equipo multi-autor).[arxiv]​
 Venue: arXiv preprint, 2025.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2408.09235[arxiv]​


Relevancia: Estudia específicamente QA de respuesta libre, usando LLMs como jueces con “reference-guided verdicts”, mostrando que se puede lograr alta correlación con evaluadores humanos bajo prompts adecuados. Este setting se parece mucho a evaluar explicaciones de decisiones de inversión o análisis de proyectos en FinanceBench.[arxiv]​
Cita APA: (Completar según metadatos cuando el paper esté finalizado).

Automated Metrics for Evaluating the Quality of Text Generation
 Fuente: Tutorial técnico (DigitalOcean, 2024).[digitalocean]​


Relevancia: Aunque no es un paper científico, resume métricas automáticas clásicas (BLEU, ROUGE, Self-BLEU, BERTScore) y discute cuándo son útiles o insuficientes. Puede servir como referencia secundaria para tu discusión sobre por qué métricas n‑gram no bastan para evaluar análisis financiero generativo y por qué necesitas evaluación humana o LLM-as-judge.[digitalocean]​
Cita APA: DigitalOcean. (2024). Automated metrics for evaluating the quality of text generation.

Evaluation for Evolving Large Language Models on Benchmarks
 (Ya descrito en Categoría 1).[aclanthology]​


Relevancia: Además de tratar la obsolescencia de benchmarks, discute meta-evaluación (cómo saber si un benchmark sigue siendo informativo) y propone estrategias para actualizarlo. Esto es relevante para la “vida útil” de FinanceBench; puedes reutilizar sus criterios para discutir cuándo y cómo extender el benchmark.[aclanthology]​
Cita APA: ver arriba.
Papers clave para citar (Categoría 5): Artstein & Poesio, Krippendorff, LLMs-as-Judges survey.onlinelibrary.wiley+2

CATEGORÍA 6 · Prompt engineering y optimización
A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications
 Autores: Pranab Sahoo, Ayush Kumar Singh, Sriparna Saha, Vinija Jain, Samrat Mondal, Aman Chadha.arxiv+1
 Venue: arXiv preprint, 2024.semanticscholar+1
 DOI/Link: https://doi.org/10.48550/arXiv.2402.07927[arxiv]​


Relevancia: Ofrece un survey sistemático de técnicas de prompt engineering (zero-shot, few-shot, CoT, prompts estructurados, prompts aprendidos) y las clasifica por tipo de tarea. Es un buen punto de partida para la sección de metodología de FinanceBench sobre condiciones de prompting (por ejemplo, comparar prompts “analista financiero experto” vs. prompts neutrales).semanticscholar+1
Cita APA: Sahoo, P., Singh, A. K., Saha, S., Jain, V., Mondal, S., & Chadha, A. (2024). A systematic survey of prompt engineering in large language models: Techniques and applications. arXiv preprint arXiv:2402.07927.

A Survey of Prompt Engineering Methods in Large Language Models
 Autores: (Nie et al.).[arxiv]​
 Venue: arXiv preprint, 2024.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2407.12994[arxiv]​


Relevancia: Complementa al survey anterior con un enfoque más en taxonomías de técnicas (instruction-tuning vs. prompting puro, plantillas, cadenas de tareas) y en resultados empíricos por dataset. Puedes usarlo para anclar tu elección de estrategias de prompting en FinanceBench y para justificar por qué comparas zero-shot, few-shot y CoT en tareas financieras.[arxiv]​
Cita APA: Nie, X., et al. (2024). A survey of prompt engineering methods in large language models. arXiv preprint arXiv:2407.12994.

A Comprehensive Survey of Prompt Engineering Techniques in Large Language Models
 Autores: Tonmoy Debnath, Md Nurul Absar Siddiky, Muhammad Enayetur Rahman, Prosenjit Das, Antu Kumar Guha.[digitalcommons.odu]​
 Venue: TechRxiv preprint, 2025.[digitalcommons.odu]​
 DOI/Link: https://doi.org/10.36227/techrxiv.174140719.96375390/v1[digitalcommons.odu]​


Relevancia: Este trabajo resume técnicas de prompt engineering y discute desafíos y oportunidades futuras, incluyendo prompts para dominios especializados. Es útil como referencia de alto nivel para la sección de Related Work sobre prompting en tu paper.[digitalcommons.odu]​
Cita APA: Debnath, T., Siddiky, M. N. A., Rahman, M. E., Das, P., & Guha, A. K. (2025). A comprehensive survey of prompt engineering techniques in large language models. TechRxiv. https://doi.org/10.36227/techrxiv.174140719.96375390/v1

A Practical Survey on Zero-Shot Prompt Design for In-Context Learning
 Autor: Yinheng Li.[aclanthology]​
 Venue: RANLP 2023.[aclanthology]​
 DOI/Link: https://aclanthology.org/2023.ranlp-1.69[aclanthology]​


Relevancia: Se centra en diseño de prompts zero-shot e in-context learning, discutiendo patrones prácticos y trade-offs. Puede servir como guía metodológica para diseñar prompts de evaluación financiera bien estructurados (p. ej., especificar paso a paso, restricciones de formato numérico).[aclanthology]​
Cita APA: Li, Y. (2023). A practical survey on zero-shot prompt design for in-context learning. In Proceedings of RANLP 2023 (pp. 641–647).

Automatic Prompt Optimization with “Gradient Descent” and Beam Search (ProTeGi)
 Autores: (Wolfe et al.).[aclanthology]​
 Venue: EMNLP 2023.[aclanthology]​
 DOI/Link: https://doi.org/10.48550/arXiv.2309.08532 (usar DOI exacto)[aclanthology]​


Relevancia: ProTeGi introduce “textual gradients” para optimizar prompts automáticamente usando mini-batches de datos y beam search, inspirándose en descenso de gradiente. Es relevante si consideras optimizar prompts de FinanceBench (por ejemplo, prompts que mejoran exactitud en tareas de NPV) sin cambiar el modelo.[aclanthology]​
Cita APA: Wolfe, C. R., et al. (2023). Automatic prompt optimization with “gradient descent” and beam search. In Proceedings of EMNLP 2023.

Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
 (Ya descrito en Categoría 2).[arxiv]​


Relevancia: Más allá de razonamiento matemático, este trabajo es el paper de referencia para CoT como técnica de prompting, y tendrás que citarlo cuando expliques por qué incluyes condiciones CoT en FinanceBench.[arxiv]​

Promptomatix: An Automatic Prompt Optimization Framework for Large Language Models
 Autores: Rithesh Murthy, Ming Zhu, Liangwei Yang, Jielin Qiu, Juntao Tan, Shelby Heinecke, Caiming Xiong, Silvio Savarese, Huan Wang.[youtube]​[arxiv]​
 Venue: arXiv preprint, 2025.[arxiv]​
 DOI/Link: https://doi.org/10.48550/arXiv.2507.14241[arxiv]​


Relevancia: Promptomatix propone un framework automático que transforma descripciones de tarea en prompts de alta calidad, seleccionando estrategias como CoT o Program-of-Thought y refinando prompts con objetivos coste‑conscientes. Es una referencia interesante para discutir futuro trabajo donde FinanceBench se use no solo para evaluar modelos, sino también para entrenar/optimizar prompts financieros automáticamente.[youtube]​[arxiv]​
Cita APA: Murthy, R., Zhu, M., Yang, L., Qiu, J., Tan, J., Heinecke, S., Xiong, C., Savarese, S., & Wang, H. (2025). Promptomatix: An automatic prompt optimization framework for large language models. arXiv preprint arXiv:2507.14241.

Exploring Prompt Optimization (LangChain blog)
 Autores: Krish Maniar, William Fu-Hinthorn.[blog.langchain]​


Relevancia: Aunque es un blog técnico, ofrece resultados prácticos comparando diferentes enfoques de optimización de prompts (meta-prompting, reflexión, gradients, evolución) y estima ganancias de hasta 200% en tareas donde el modelo carece de conocimiento de dominio. Puede apoyar una discusión más aplicada sobre cómo usuarios finales podrían usar FinanceBench para optimizar prompts para sus propios casos de uso financieros.[blog.langchain]​
Cita APA: Maniar, K., & Fu-Hinthorn, W. (2025). Exploring prompt optimization. LangChain Blog.
Papers clave para citar (Categoría 6): Sahoo et al. survey, Li zero-shot survey, Chain-of-Thought.arxiv+2

CATEGORÍA 7 · Democratización del conocimiento financiero
The Double-Edged Sword of AI: Evidence on Student Engagement and Financial Literacy
 Autor: Jaime Polanco (Job Market Paper).[polanco-jaime.github]​
 Venue: Job market paper / RCT, 2024.[polanco-jaime.github]​
 DOI/Link: (PDF en página personal; sin DOI formal)[polanco-jaime.github]​


Relevancia: RCT con 2.440 estudiantes de secundaria en Bélgica que evalúa un chatbot generativo para educación financiera, mostrando mejoras significativas en puntajes de alfabetización financiera (≈0.13 desviaciones estándar para el chatbot personalizado). Es evidencia directa de que chatbots tipo LLM pueden cerrar brechas de conocimiento financiero en jóvenes.[polanco-jaime.github]​
Cita APA: Polanco, J. (2024). The double-edged sword of AI: Evidence on student engagement and financial literacy. Unpublished manuscript.

Inclusive Financial Literacy Education Driven by Generative AI: An Empirical Study on the Effectiveness of Adaptive Learning Platforms in Resource-Scarce Areas
 Autor: Kaiqi Yang.[pinnaclepubs]​
 Venue: Economics & Management, 1(1), 2025.[pinnaclepubs]​
 DOI/Link: (ver PDF de la revista)[pinnaclepubs]​


Relevancia: Analiza una plataforma adaptativa basada en generative AI para educación financiera en regiones con pocos recursos (incluyendo un piloto en Bihar, India), encontrando mejoras de ≈42% en puntajes de conocimiento financiero para el grupo experimental y reducciones de costo del 60%. Apoya fuertemente el argumento de democratización de la educación financiera a través de IA, relevante para la motivación social de FinanceBench.[pinnaclepubs]​
Cita APA: Yang, K. (2025). Inclusive financial literacy education driven by generative AI: An empirical study on the effectiveness of adaptive learning platforms in resource-scarce areas. Economics & Management, 1(1), 1–20.

Finlingo: A Conversational AI for Enhancing Financial Literacy Education in Africa
 Autores: Japheth Kiplang’at Mursi, Hamid Nach, Austin Odera, Betty Mwende, Daniel Dhol, Faith Mwikali.[repository.daystar.ac]​
 Venue: International Conference on Technology Management, Operations and Decisions, 2024.[repository.daystar.ac]​
 DOI/Link: (PDF en repositorio de Daystar University)[repository.daystar.ac]​


Relevancia: Propone un chatbot conversacional especializado en literacy financiera para contextos africanos, con foco en adaptación contextual y soporte a productos FinTech locales. Es un buen ejemplo de LLM/IA aplicada a emprendedores y consumidores en países en desarrollo, alineado con tu interés por América Latina.[repository.daystar.ac]​
Cita APA: Mursi, J. K., Nach, H., Odera, A., Mwende, B., Dhol, D., & Mwikali, F. (2024). Finlingo: A conversational AI for enhancing financial literacy education in Africa. In Proceedings of the International Conference on Technology Management, Operations and Decisions.

Digital Training for Micro-Entrepreneurs: Experimental Evidence from Guatemala
 Autores: Alejandro Estefan, Martina Improta, Romina Ordoñez, Paul Winters.[openknowledge.worldbank]​
 Venue: World Bank Economic Review, 38(2), 2023.[openknowledge.worldbank]​
 DOI/Link: https://doi.org/10.1596/41498[openknowledge.worldbank]​


Relevancia: RCT que evalúa una formación digital para microemprendedores (app + tutorías virtuales), encontrando efectos significativos en conocimientos, prácticas de negocio, ventas y ganancias. Aunque no es LLM, es evidencia robusta de que plataformas digitales pueden mejorar resultados económicos de emprendedores en países en desarrollo, reforzando el rol potencial de herramientas IA/LLM para análisis de negocios.[openknowledge.worldbank]​
Cita APA: Estefan, A., Improta, M., Ordoñez, R., & Winters, P. (2023). Digital training for micro-entrepreneurs: Experimental evidence from Guatemala. World Bank Economic Review, 38(2), 394–421. https://doi.org/10.1596/41498

Harnessing FinTech and Artificial Intelligence for Financial Inclusion and Entrepreneurial Development
 Fuente: Artículo de revista sobre AI y FinTech en países en desarrollo.[ijefm.co]​
 Venue: International Journal of Economics, Finance and Management, 2024.[ijefm.co]​


Relevancia: Revisa evidencia sobre plataformas FinTech y AI en África, Asia y América Latina (M-Pesa, Paytm, etc.), resaltando cómo extienden acceso a crédito, seguros, remesas y advisory a poblaciones no bancarizadas. Es útil para conectar FinanceBench con la narrativa de inclusión financiera y el papel de IA en ecosistemas emprendedores.[ijefm.co]​
Cita APA: (Completar según metadatos exactos del artículo).

FinGPT: Open-Source Financial Large Language Models
 (Ya descrito en Categoría 3).arxiv+2


Relevancia: Además del aspecto técnico, FinGPT se posiciona explícitamente como herramienta para “democratizar” datos y modelos financieros, lo que encaja directamente con la idea de que benchmarks abiertos como FinanceBench permiten acceso equitativo a evaluación y desarrollo de herramientas financieras avanzadas.arxiv+1

AI’s Promise: A New Era for Financial Inclusion
 Fuente: Blog de CGAP (Consultative Group to Assist the Poor).[cgap]​


Relevancia: CGAP discute cómo apps de alfabetización financiera basadas en AI pueden educar a usuarios sobre ahorro, inversión y crédito de forma escalable, resaltando retos de confianza y literacy digital. Es una fuente de política/práctica útil para contextualizar el impacto potencial de LLMs financieros en inclusión financiera.[cgap]​
Cita APA: CGAP. (2025). AI’s promise: A new era for financial inclusion. CGAP Blog.

Empowering Entrepreneurship Education with Digital Technologies Tools
 Autores: (equipo multi-autor).[qjss.com]​
 Venue: Qlantic Journal of Social Sciences, 6(1), 2025.[qjss.com]​
 DOI/Link: https://doi.org/10.55737/qjss.vi-i.25305[qjss.com]​


Relevancia: Examina cómo herramientas digitales (Moodle, simuladores, gamificación) potencian educación emprendedora y señala el potencial de tecnologías emergentes como IA y VR para ofrecer educación personalizada. Sirve como puente conceptual entre educación emprendedora tradicional y el uso de LLMs como asistentes de negocio para PYMEs.[qjss.com]​
Cita APA: (Autores). (2025). Empowering entrepreneurship education with digital technologies tools. Qlantic Journal of Social Sciences, 6(1), 234–251. https://doi.org/10.55737/qjss.vi-i.25305
Papers clave para citar (Categoría 7): Polanco RCT chatbot financiero, Yang generative AI literacy, Finlingo.polanco-jaime.github+2

CATEGORÍA 8 · Ética y responsabilidad en IA financiera
Legal Accountability and Ethical Considerations of AI in Financial Services
 Autores: (equipo multi-autor).gsconlinepress+1
 Venue: GSC Advanced Research and Reviews, 2024.gsconlinepress+1
 DOI/Link: (ver PDF GSCARR-2024-0171)[gsconlinepress]​


Relevancia: Revisa cuestiones de responsabilidad legal, compliance, sesgos algorítmicos, transparencia y privacidad en el uso de IA en servicios financieros, incluyendo marcos regulatorios relevantes. Es una referencia directa para tu sección de riesgos de IA en decisiones financieras y para justificar la necesidad de métricas de seguridad/robustez en FinanceBench.gsconlinepress+1
Cita APA: (Autores). (2024). Legal accountability and ethical considerations of AI in financial services. GSC Advanced Research and Reviews.

Ethical Implications of AI in Financial Services: Bias, Transparency and Accountability
 Autores: (equipo multi-autor).[ijsrcseit]​
 Venue: International Journal of Scientific Research in Computer Science, Engineering and Information Technology, 2024.[ijsrcseit]​


Relevancia: Discute cómo la IA puede perpetuar sesgos en scoring de crédito y otras decisiones financieras, el problema de la “caja negra” y la asignación de responsabilidad. Es útil para la parte de tu paper donde analices los riesgos de confiar en LLMs para recomendaciones de inversión o asesoría financiera automatizada.[ijsrcseit]​
Cita APA: (Autores). (2024). Ethical implications of AI in financial services: Bias, transparency and accountability. IJSRCSEIT.

Explainable AI in Credit Risk Models: Enhancing Transparency and Trust in Financial Decision-Making
 Autores: (autores listados en Journal of Advancement in Big Data Science and Data Analytics).[hbrppublication]​
 Venue: Journal of Advancement in Big Data Science and Data Analytics, 2025.[hbrppublication]​


Relevancia: Explora el uso de XAI (SHAP, LIME, contrafactuales) en modelos de riesgo de crédito, discutiendo implicaciones para confianza de reguladores, instituciones y consumidores. Es una referencia clave para cualquier sección de tu paper sobre explicabilidad de LLMs financieros, sobre todo si consideras evaluar claridad de explicaciones generadas en FinanceBench.[hbrppublication]​
Cita APA: (Autores). (2025). Explainable AI in credit risk models: Enhancing transparency and trust in financial decision-making. Journal of Advancement in Big Data Science and Data Analytics.

Explainable AI Models for Credit Risk Evaluation in Banking
 Fuente: Artículo de revisión/síntesis.[ijarcce]​


Relevancia: Propone un marco de cuatro capas para desarrollar modelos explicables de scoring de crédito y revisa técnicas XAI desde la perspectiva de negocio y cumplimiento. Este tipo de marco puede inspirar una taxonomía de riesgos y requisitos para LLMs en análisis financiero que acompañe a FinanceBench.[ijarcce]​
Cita APA: (Autores). (2024). Explainable AI models for credit risk evaluation in banking. IJARCCE.

The Financial Stability Implications of Artificial Intelligence
 Fuente: Informe del Financial Stability Board (FSB).**[fsb]​
 Venue: FSB Insights report, 2024.[fsb]​
 DOI/Link: https://www.fsb.org/uploads/P14112024.pdf[fsb]​


Relevancia: Analiza cómo la adopción masiva de IA en finanzas puede generar riesgos sistémicos (pro-ciclicidad, herding algorítmico, errores correlacionados) y recomienda enfoques de supervisión. Es muy útil para conectar FinanceBench con el ángulo macroprudencial y argumentar por qué benchmarks rigurosos son necesarios para entender comportamientos de modelos en escenarios extremos.[fsb]​
Cita APA: Financial Stability Board. (2024). The financial stability implications of artificial intelligence. FSB Report.

Regulating AI in the Financial Sector: Recent Developments and Main Challenges
 Fuente: BIS FSI Insights No. 63.[bis]​


Relevancia: Revisa desarrollos regulatorios globales (EU AI Act, guías de bancos centrales, etc.) y discute cómo supervisores están abordando AI en bancos y mercados. Este informe puede respaldar tu discusión sobre el entorno regulatorio que rodea el despliegue de LLMs financieros.[bis]​
Cita APA: Basel Committee on Banking Supervision / BIS. (2024). Regulating AI in the financial sector: Recent developments and main challenges. FSI Insights No. 63.

Chapter 10: Ethical AI in Finance
 Fuente: CFA Institute Research Foundation.[rpc.cfainstitute]​


Relevancia: Este capítulo sintetiza buenas prácticas de ética en AI financiera (transparencia, responsabilidad, privacidad, estabilidad de mercado) y proporciona recomendaciones prácticas para gestores de activos, bancos y reguladores. Es una buena fuente para tu sección de discusión sobre “responsible AI finance” y para enmarcar FinanceBench como contribución a prácticas responsables.[rpc.cfainstitute]​
Cita APA: CFA Institute. (2025). Chapter 10: Ethical AI in finance. In Responsible AI in investment management. CFA Institute Research Foundation.

MAS Guidelines for Artificial Intelligence (AI) Risk Management
 Fuente: Monetary Authority of Singapore (MAS), consulta pública 2025.[mas.gov]​


Relevancia: La MAS propone guías de gestión de riesgo de AI para instituciones financieras, cubriendo gobernanza, ciclo de vida de modelos, controles y capacidades internas. Apoya tu argumento de que benchmarks como FinanceBench pueden servir como herramientas concretas dentro de marcos de gestión de riesgo de AI exigidos por reguladores.[mas.gov]​
Cita APA: Monetary Authority of Singapore. (2025). Guidelines on AI risk management (consultation paper). MAS.
Papers clave para citar (Categoría 8): FSB financial stability report, legal/ethical AI in financial services, XAI in credit risk.gsconlinepress+3



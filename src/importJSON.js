'use strict';
/**
 * Validación y detección de modo de un JSON de importación (inputs / inputs + analysis).
 *
 * Extraído sin cambios de Viabilidad Negocios,
 * Backend/src/controllers/projectController.js (commit 31f24a0, L536-597).
 */

/**
 * Detects whether a parsed JSON is Input-Only (Mode A) or Complete with analysis (Mode B).
 */
const detectImportMode = (json) => {
  if (!json.inputs) {
    const err = new Error('JSON inválido: falta la clave "inputs"');
    err.code = 'MISSING_INPUTS_KEY';
    throw err;
  }
  if (json.analysis && json.analysis.scenarios && Object.keys(json.analysis.scenarios).length > 0) {
    return 'COMPLETE';
  }
  return 'INPUT_ONLY';
};

/**
 * Validates the structure and key fields of an import JSON.
 * Throws with err.code = 'VALIDATION_ERROR' and err.errors array if invalid.
 */
const validateImportJSON = (json) => {
  const errors = [];

  if (!json.inputs) {
    errors.push({ field: 'inputs', message: 'Clave "inputs" requerida' });
    const err = new Error('Validation failed');
    err.code = 'VALIDATION_ERROR';
    err.errors = errors;
    throw err;
  }

  const { general, income } = json.inputs;

  if (!general?.projectName || typeof general.projectName !== 'string' || !general.projectName.trim()) {
    errors.push({ field: 'inputs.general.projectName', message: 'Nombre del proyecto requerido' });
  }

  const life = general?.projectLife;
  if (!life || !Number.isInteger(life) || life < 1 || life > 50) {
    errors.push({ field: 'inputs.general.projectLife', message: 'Vida del proyecto debe ser un entero entre 1 y 50' });
  }

  if (general?.taxRate === undefined || general?.taxRate === null) {
    errors.push({ field: 'inputs.general.taxRate', message: 'Tasa de impuesto requerida' });
  }
  if (general?.discountRate === undefined || general?.discountRate === null) {
    errors.push({ field: 'inputs.general.discountRate', message: 'Tasa de descuento requerida' });
  }

  const hasItems     = income?.items?.length > 0;
  const hasScenarios = income?.scenarios?.length > 0;
  if (!hasItems && !hasScenarios) {
    errors.push({ field: 'inputs.income', message: 'Se requiere al menos un ítem o escenario de ingreso' });
  }

  if (errors.length > 0) {
    const err = new Error('Validation failed');
    err.code = 'VALIDATION_ERROR';
    err.errors = errors;
    throw err;
  }
};


module.exports = { detectImportMode, validateImportJSON };

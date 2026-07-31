// src/lib/carteraProcessor.js
import * as XLSX from 'xlsx';

/**
 * Parses any value to a number. Handles formatted strings like currency,
 * different decimals/thousands formats (e.g. 1.234,56 or 1,234.56).
 */
function parseNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  let str = String(val).trim();
  if (str === '') return 0;

  // Remove currency symbols, spaces, and percent signs
  str = str.replace(/[$\s%]/g, '');

  const hasComma = str.includes(',');
  const hasDot = str.includes('.');

  if (hasComma && hasDot) {
    // Both comma and dot exist
    const lastComma = str.lastIndexOf(',');
    const lastDot = str.lastIndexOf('.');
    if (lastDot > lastComma) {
      // Dot is the decimal separator, e.g., "1,500,000.00"
      str = str.replace(/,/g, '');
    } else {
      // Comma is the decimal separator, e.g., "1.500.000,00"
      str = str.replace(/\./g, '').replace(',', '.');
    }
  } else if (hasComma) {
    // Only comma exists
    const commaCount = (str.match(/,/g) || []).length;
    if (commaCount > 1) {
      // Multiple commas -> thousands separator
      str = str.replace(/,/g, '');
    } else {
      // Single comma
      const lastComma = str.lastIndexOf(',');
      const digitsAfter = str.length - 1 - lastComma;
      if (digitsAfter === 3) {
        // e.g. "1,500" -> thousands separator
        str = str.replace(/,/g, '');
      } else {
        // e.g. "1500,50" -> decimal separator
        str = str.replace(',', '.');
      }
    }
  } else if (hasDot) {
    // Only dot exists
    const dotCount = (str.match(/\./g) || []).length;
    if (dotCount > 1) {
      // Multiple dots -> thousands separator
      str = str.replace(/\./g, '');
    } else {
      // Single dot
      const lastDot = str.lastIndexOf('.');
      const digitsAfter = str.length - 1 - lastDot;
      if (digitsAfter === 3) {
        // e.g. "1.500" -> thousands separator
        str = str.replace(/\./g, '');
      }
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Extracts Fecha_Vencimiento from a description text.
 * Pattern: (?:Fecha|Date):\s*(\d{2}/\d{2}/\d{4}|\d{4}-\d{2}-\d{2})
 */
const datePattern = /(?:Fecha|Date):\s*(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
function extractDate(desc) {
  if (!desc) return null;
  const match = String(desc).match(datePattern);
  if (match) {
    const dateStr = match[1];
    // Try DD/MM/YYYY
    const dmyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed month
      const year = parseInt(dmyMatch[3], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
    // Try YYYY-MM-DD
    const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) return date;
    }
  }
  return null;
}

/**
 * Procesa un Buffer o Uint8Array de un archivo de GESTIÓN DE CARTERA
 * y retorna el libro Excel de salida consolidado en formato array/binary.
 */
export function processCarteraExcel(fileBuffer) {
  // 1. Leer el Excel sin encabezados (header: 1 para obtener array de arrays)
  const workbook = XLSX.read(fileBuffer, { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const originalSheet = workbook.Sheets[firstSheetName];

  const originalRows = XLSX.utils.sheet_to_json(originalSheet, { header: 1, defval: null });

  if (!originalRows || originalRows.length === 0) {
    throw new Error('El archivo Excel está vacío o no se pudo leer.');
  }

  // Encontrar el número máximo de columnas en cualquier fila
  let maxCols = 0;
  originalRows.forEach((row) => {
    if (Array.isArray(row) && row.length > maxCols) {
      maxCols = row.length;
    }
  });

  // Asignar nombres de columnas dinámicamente
  const baseCols = ['Mov_cuenta', 'ID', 'Nombre_tercero', 'Comprobante', 'Fecha_doc', 'Descripción', 'Centro_de_costo', 'Débito', 'Crédito'];
  const columns = [...baseCols];
  if (maxCols > columns.length) {
    for (let i = 0; i < maxCols - baseCols.length; i++) {
      columns.push(`Columna_Extra_${i}`);
    }
  } else if (maxCols < columns.length) {
    columns.splice(maxCols);
  }

  // Convertir filas (aoa) a objetos
  const df = originalRows.map((rowArr) => {
    const rowObj = {};
    columns.forEach((colName, index) => {
      rowObj[colName] = rowArr && rowArr[index] !== undefined ? rowArr[index] : null;
    });
    return rowObj;
  });

  // 2. Eliminar filas basura (títulos repetidos o encabezados en la primera columna)
  let df_clean = df.filter((row) => {
    // Descartar si toda la fila está vacía
    const allNull = Object.values(row).every((v) => v === null || v === undefined || String(v).trim() === '');
    if (allNull) return false;

    const movCuenta = row['Mov_cuenta'];
    if (movCuenta !== null && movCuenta !== undefined) {
      const strVal = String(movCuenta);
      const isBasura = /CARTERA DE CLIENTES|Mov-cuenta|Débito/i.test(strVal);
      if (isBasura) return false;
    }
    return true;
  });

  // 3. Limpieza de texto y números
  df_clean = df_clean.map((row) => {
    const r = { ...row };
    r['Nombre_tercero'] = r['Nombre_tercero'] !== null && r['Nombre_tercero'] !== undefined
      ? String(r['Nombre_tercero']).trim()
      : 'Sin Nombre';

    r['Centro_de_costo'] = r['Centro_de_costo'] !== null && r['Centro_de_costo'] !== undefined
      ? String(r['Centro_de_costo']).trim()
      : 'Sin Centro';

    r['Comprobante'] = r['Comprobante'] !== null && r['Comprobante'] !== undefined
      ? String(r['Comprobante']).trim()
      : 'Sin Comprobante';

    r['Descripción'] = r['Descripción'] !== null && r['Descripción'] !== undefined
      ? String(r['Descripción']).trim()
      : '';

    r['Débito'] = parseNumber(r['Débito']);
    r['Crédito'] = parseNumber(r['Crédito']);
    return r;
  });

  // 4. Extraer fechas de descripción
  df_clean.forEach((row) => {
    row['Fecha_Vencimiento'] = extractDate(row['Descripción']);
  });

  const now = new Date();
  const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ==========================================
  // HOJA 1: Resumen Unificado General
  // ==========================================
  const resumenMap = new Map();
  df_clean.forEach((row) => {
    const key = `${row.Nombre_tercero}||${row.Centro_de_costo}||${row.Comprobante}`;
    if (!resumenMap.has(key)) {
      resumenMap.set(key, {
        Nombre_tercero: row.Nombre_tercero,
        Centro_de_costo: row.Centro_de_costo,
        Comprobante: row.Comprobante,
        Descripciones: [],
        Débito: 0,
        Crédito: 0
      });
    }
    const agg = resumenMap.get(key);
    if (row.Descripción !== '') {
      agg.Descripciones.push(row.Descripción);
    }
    agg.Débito += row.Débito || 0;
    agg.Crédito += row.Crédito || 0;
  });

  const df_resumen = Array.from(resumenMap.values()).map((item) => {
    const uniqueDescs = Array.from(new Set(item.Descripciones));
    return {
      Nombre_tercero: item.Nombre_tercero,
      Centro_de_costo: item.Centro_de_costo,
      Comprobante: item.Comprobante,
      Descripción: uniqueDescs.join(' | '),
      Débito: item.Débito,
      Crédito: item.Crédito
    };
  });

  df_resumen.sort((a, b) => {
    const cmpTercero = a.Nombre_tercero.localeCompare(b.Nombre_tercero);
    if (cmpTercero !== 0) return cmpTercero;
    return a.Centro_de_costo.localeCompare(b.Centro_de_costo);
  });

  // ==========================================
  // HOJA 2: Vencimientos Actuales (<= hoy, ordenado por tercero)
  // ==========================================
  const df_venc = df_clean.filter((row) => row.Fecha_Vencimiento !== null && row.Fecha_Vencimiento !== undefined);
  const df_venc_filt = df_venc.filter((row) => row.Fecha_Vencimiento.getTime() <= hoy.getTime());

  df_venc_filt.sort((a, b) => {
    const cmpTercero = a.Nombre_tercero.localeCompare(b.Nombre_tercero);
    if (cmpTercero !== 0) return cmpTercero;
    return a.Fecha_Vencimiento.getTime() - b.Fecha_Vencimiento.getTime();
  });

  const df_venc_final = df_venc_filt.map((row) => {
    const fv = row.Fecha_Vencimiento;
    const year = fv.getFullYear();
    const month = String(fv.getMonth() + 1).padStart(2, '0');
    const day = String(fv.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return {
      Nombre_tercero: row.Nombre_tercero,
      Centro_de_costo: row.Centro_de_costo,
      Comprobante: row.Comprobante,
      Descripción: row.Descripción,
      Fecha_Vencimiento: dateStr,
      Débito: row.Débito,
      Crédito: row.Crédito
    };
  });

  // ==========================================
  // HOJA 3: Resumen CC-4 sin RC-1 en el Mes Actual
  // ==========================================
  const df_cc4 = df_clean.filter((row) => {
    const comp = row.Comprobante;
    return comp && String(comp).toUpperCase().startsWith('CC-4');
  });

  const df_cc4_no_rc1 = df_cc4.filter((row) => {
    const desc = row.Descripción;
    return !desc || !/RC-1/i.test(String(desc));
  });

  const df_cc4_mes_actual = df_cc4_no_rc1.filter((row) => {
    const fv = row.Fecha_Vencimiento;
    if (!fv) return false;
    return fv.getMonth() === hoy.getMonth() && fv.getFullYear() === hoy.getFullYear();
  });

  const cc4Map = new Map();
  df_cc4_mes_actual.forEach((row) => {
    const key = `${row.Nombre_tercero}||${row.Centro_de_costo}`;
    if (!cc4Map.has(key)) {
      cc4Map.set(key, {
        Nombre_tercero: row.Nombre_tercero,
        Centro_de_costo: row.Centro_de_costo,
        Comprobantes: [],
        Descripciones: [],
        Débito: 0,
        Crédito: 0
      });
    }
    const agg = cc4Map.get(key);
    if (row.Comprobante) {
      agg.Comprobantes.push(row.Comprobante);
    }
    if (row.Descripción !== '') {
      agg.Descripciones.push(row.Descripción);
    }
    agg.Débito += row.Débito || 0;
    agg.Crédito += row.Crédito || 0;
  });

  const df_resumen_cc4 = Array.from(cc4Map.values()).map((item) => {
    const uniqueComps = Array.from(new Set(item.Comprobantes));
    const uniqueDescs = Array.from(new Set(item.Descripciones));
    return {
      Nombre_tercero: item.Nombre_tercero,
      Centro_de_costo: item.Centro_de_costo,
      Comprobante: uniqueComps.join(', '),
      Descripción: uniqueDescs.join(' | '),
      Débito: item.Débito,
      Crédito: item.Crédito
    };
  });

  df_resumen_cc4.sort((a, b) => a.Nombre_tercero.localeCompare(b.Nombre_tercero));

  // ==========================================
  // HOJA 4: Datos Originales Limpios
  // ==========================================
  const df_orig = df_clean.map((row) => {
    // Reconstruir la fila mapeando las claves originales asignadas en index orden
    // más Fecha_Vencimiento que se agregó
    const rowKeys = [...columns, 'Fecha_Vencimiento'];

    const origColsBase = ['Mov Cuenta', 'ID', 'Nombre Tercero', 'Comprobante', 'Fecha Doc', 'Descripción', 'Centro de Costo', 'Débito', 'Crédito'];
    const origCols = [...origColsBase];
    if (rowKeys.length > origCols.length) {
      for (let i = 0; i < rowKeys.length - origColsBase.length; i++) {
        origCols.push(`Columna_Extra_${i}`);
      }
    } else if (rowKeys.length < origCols.length) {
      origCols.splice(rowKeys.length);
    }

    const newRow = {};
    rowKeys.forEach((key, index) => {
      const newKey = origCols[index];
      let val = row[key];
      if (val instanceof Date) {
        const year = val.getFullYear();
        const month = String(val.getMonth() + 1).padStart(2, '0');
        const day = String(val.getDate()).padStart(2, '0');
        val = `${year}-${month}-${day}`;
      }
      newRow[newKey] = val;
    });
    return newRow;
  });

  // ==========================================
  // Exportar a Excel con 4 hojas
  // ==========================================
  const newWb = XLSX.utils.book_new();

  // Hoja 1: Resumen_por_Tercero
  const wsResumen = XLSX.utils.json_to_sheet(df_resumen);
  XLSX.utils.book_append_sheet(newWb, wsResumen, 'Resumen_por_Tercero');

  // Hoja 2: Vencimientos_Actuales
  const wsVenc = XLSX.utils.json_to_sheet(df_venc_final);
  XLSX.utils.book_append_sheet(newWb, wsVenc, 'Vencimientos_Actuales');

  // Hoja 3: Resumen_CC4_Sin_RC1_MesActual
  const wsCC4 = XLSX.utils.json_to_sheet(df_resumen_cc4);
  XLSX.utils.book_append_sheet(newWb, wsCC4, 'Resumen_CC4_Sin_RC1_MesActual');

  // Hoja 4: Datos_Originales
  const wsOrig = XLSX.utils.json_to_sheet(df_orig);
  XLSX.utils.book_append_sheet(newWb, wsOrig, 'Datos_Originales');

  const outBuffer = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
  return outBuffer;
}

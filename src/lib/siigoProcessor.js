// src/lib/siigoProcessor.js
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
 * Parses various Excel date formats (Date objects, serial numbers, string dates).
 */
function parseExcelDate(val) {
  if (val === null || val === undefined) return new Date(0);
  if (val instanceof Date) return val;
  if (typeof val === 'number') {
    // Excel serial dates: 25569 is 1970-01-01
    return new Date((val - 25569) * 86400 * 1000);
  }
  const str = String(val).trim();
  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month, day);
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

/**
 * Procesa un Buffer o Uint8Array de un archivo Excel de Siigo
 * y retorna la estructura de hojas en formato binary/Buffer
 * igual que el script de Python.
 */
export function processSiigoExcel(fileBuffer) {
  // 1. Leer workbook original
  const workbook = XLSX.read(fileBuffer, { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const originalSheet = workbook.Sheets[firstSheetName];

  // Leer filas como objetos
  const df_original = XLSX.utils.sheet_to_json(originalSheet, { defval: null });

  if (!df_original || df_original.length === 0) {
    throw new Error('El archivo Excel está vacío o no se pudo leer.');
  }

  // 2. Limpieza inicial de metadatos de Siigo
  // dropna(subset=['Tipo transacción'])
  // ~df_clean['Tipo transacción'].str.contains('Procesado en')
  let df_clean = df_original.filter((row) => {
    const tipoTx = row['Tipo transacción'];
    if (tipoTx === null || tipoTx === undefined || String(tipoTx).trim() === '') {
      return false;
    }
    if (String(tipoTx).includes('Procesado en')) {
      return false;
    }
    return true;
  });

  // Conversión de columnas numéricas
  const numericCols = [
    'Total',
    'Cantidad',
    'Valor unitario',
    'Valor desc.',
    'Valor Impuesto Cargo',
    'Valor Impuesto Cargo 2'
  ];

  df_clean = df_clean.map((row) => {
    const newRow = { ...row };
    numericCols.forEach((col) => {
      newRow[col] = parseNumber(newRow[col]);
    });
    return newRow;
  });

  // Definir la columna de fecha para ordenamiento
  const dateCol = 'Fecha elaboración' in (df_clean[0] || {}) ? 'Fecha elaboración' : 'Fecha creación';

  df_clean.forEach((row) => {
    row._parsedDate = parseExcelDate(row[dateCol]);
  });

  // 3. FILTRO DE DUPLICADOS (Referencia fábrica / Chasis más reciente)
  const df_valid_ref = [];
  const df_no_ref = [];

  df_clean.forEach((row) => {
    const ref = row['Referencia fábrica'];
    if (ref !== null && ref !== undefined && String(ref).trim() !== '') {
      df_valid_ref.push(row);
    } else {
      df_no_ref.push(row);
    }
  });

  // Ordenar df_valid_ref por fecha descendente
  df_valid_ref.sort((a, b) => b._parsedDate.getTime() - a._parsedDate.getTime());

  // Deduplicar subset=['Referencia fábrica'], keep='first'
  const seenRefs = new Set();
  const df_dedup_ref = [];
  df_valid_ref.forEach((row) => {
    const refKey = String(row['Referencia fábrica']).trim();
    if (!seenRefs.has(refKey)) {
      seenRefs.add(refKey);
      df_dedup_ref.push(row);
    }
  });

  // Combinar df_dedup_ref + df_no_ref
  const df_filtered = [...df_dedup_ref, ...df_no_ref];

  // 4. CLASIFICACIÓN: Moto vs Repuesto & LIMPIEZA DE NOMBRE
  df_filtered.forEach((row) => {
    const nombre = String(row['Nombre'] || '').toUpperCase();
    const ref = String(row['Referencia fábrica'] || '').toUpperCase();

    if (
      nombre.includes('CHASIS') ||
      nombre.includes('MOTOR') ||
      ref.includes('CHASIS') ||
      ref.includes('MOTOR') ||
      nombre.includes('CC ') ||
      nombre.includes('MODELO 20') ||
      nombre.includes('MOD 20')
    ) {
      row['Categoría'] = 'Moto';
    } else {
      row['Categoría'] = 'Repuesto';
    }

    // Limpieza de Nombre (hasta antes de la palabra "Chasis")
    const nameStr = String(row['Nombre'] || '');
    const match = nameStr.match(/\bchasis\b/i);
    if (match) {
      const truncated = nameStr.substring(0, match.index).trim();
      row['Nombre_Limpio'] = truncated !== '' ? truncated : nameStr.trim();
    } else {
      row['Nombre_Limpio'] = nameStr.trim();
    }
  });

  // Remove internal helper field
  df_filtered.forEach((r) => delete r._parsedDate);

  // 5. INDICADORES Y AGRUPACIONES
  const total_facturacion = df_filtered.reduce((sum, r) => sum + (r['Total'] || 0), 0);
  const total_unidades = df_filtered.reduce((sum, r) => sum + (r['Cantidad'] || 0), 0);
  const total_transacciones = df_filtered.length;

  // CENTRO DE COSTOS
  const ccMap = new Map();
  df_filtered.forEach((row) => {
    const cc = row['Centro costo'] || 'Sin Centro de Costo';
    if (!ccMap.has(cc)) {
      ccMap.set(cc, {
        'Centro costo': cc,
        Unidades: 0,
        'Suma Valor Unitario': 0,
        'Valor Descuento': 0,
        'Valor Impuesto a Cargo': 0,
        'Valor Impuesto a Cargo 2': 0,
        'Ventas Netas': 0,
        Transacciones: 0
      });
    }
    const item = ccMap.get(cc);
    item.Unidades += row['Cantidad'] || 0;
    item['Suma Valor Unitario'] += row['Valor unitario'] || 0;
    item['Valor Descuento'] += row['Valor desc.'] || 0;
    item['Valor Impuesto a Cargo'] += row['Valor Impuesto Cargo'] || 0;
    item['Valor Impuesto a Cargo 2'] += row['Valor Impuesto Cargo 2'] || 0;
    item['Ventas Netas'] += row['Total'] || 0;
    item.Transacciones += 1;
  });

  const ccGroupedList = Array.from(ccMap.values()).map((item) => {
    const part = total_facturacion > 0 ? (item['Ventas Netas'] / total_facturacion) * 100 : 0;
    return {
      'Centro costo': item['Centro costo'],
      Unidades: item.Unidades,
      'Suma Valor Unitario': item['Suma Valor Unitario'],
      'Valor Descuento': item['Valor Descuento'],
      'Valor Impuesto a Cargo': item['Valor Impuesto a Cargo'],
      'Valor Impuesto a Cargo 2': item['Valor Impuesto a Cargo 2'],
      'Ventas Netas': item['Ventas Netas'],
      'Participación %': part,
      Transacciones: item.Transacciones
    };
  });

  // Sort Centro de Costos by Ventas Netas descending
  ccGroupedList.sort((a, b) => b['Ventas Netas'] - a['Ventas Netas']);

  // PRODUCTOS ESTRELLA
  const motos_df = df_filtered.filter((r) => r['Categoría'] === 'Moto');
  const repuestos_df = df_filtered.filter((r) => r['Categoría'] === 'Repuesto');

  function getTop10(items) {
    const map = new Map();
    items.forEach((row) => {
      const nombre = row['Nombre_Limpio'] || 'Sin Nombre';
      if (!map.has(nombre)) {
        map.set(nombre, { 'Nombre Producto': nombre, Unidades: 0, 'Ventas_Totales': 0 });
      }
      const entry = map.get(nombre);
      entry.Unidades += row['Cantidad'] || 0;
      entry['Ventas_Totales'] += row['Total'] || 0;
    });
    return Array.from(map.values())
      .sort((a, b) => b.Unidades - a.Unidades)
      .slice(0, 10);
  }

  const topMotos = getTop10(motos_df);
  const topRepuestos = getTop10(repuestos_df);

  // 6. CREACIÓN DE LIBRO EXCEL MULTI-HOJA
  const newWb = XLSX.utils.book_new();

  // 1. Resumen Ejecutivo (startrow=2, i.e. origin A3)
  const summaryRows = [
    { 'Indicador Gerencial': 'Facturación Neta Total (Sin Duplicados)', Valor: total_facturacion },
    { 'Indicador Gerencial': 'Total Unidades Vendidas', Valor: total_unidades },
    { 'Indicador Gerencial': 'Total Transacciones Activas', Valor: total_transacciones }
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_json(wsSummary, summaryRows, { origin: 'A3' });
  XLSX.utils.book_append_sheet(newWb, wsSummary, 'Resumen Ejecutivo');

  // 2. Centro de Costos (startrow=2, i.e. origin A3)
  const wsCC = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_json(wsCC, ccGroupedList, { origin: 'A3' });
  XLSX.utils.book_append_sheet(newWb, wsCC, 'Centro de Costos');

  // 3. Productos Estrella
  const wsEstrella = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_json(wsEstrella, topMotos, { origin: 'A3' });
  XLSX.utils.sheet_add_json(wsEstrella, topRepuestos, { origin: 'A16' });
  XLSX.utils.book_append_sheet(newWb, wsEstrella, 'Productos Estrella');

  // 4. Detalle Depurado
  const wsFiltered = XLSX.utils.json_to_sheet(df_filtered);
  XLSX.utils.book_append_sheet(newWb, wsFiltered, 'Detalle Depurado');

  // 5. Archivo Original
  const wsOriginal = XLSX.utils.json_to_sheet(df_original);
  XLSX.utils.book_append_sheet(newWb, wsOriginal, 'Archivo Original');

  // Generar buffer en formato uint8array / binary
  const outBuffer = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
  return outBuffer;
}

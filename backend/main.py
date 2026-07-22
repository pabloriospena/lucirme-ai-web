import os
import re
import uuid
import shutil
from datetime import datetime
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, File, UploadFile, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.responses import HTMLResponse, FileResponse
import openpyxl
from openpyxl.styles import PatternFill

app = FastAPI(title="Analizador de Excel - Lucirme")

# --- FUNCIONES AUXILIARES ---

def normalizar_texto(texto):
    if not texto: return ""
    texto = str(texto).strip().lower()
    reemplazos = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', '_': ' ', '-': ' ', 'º': '', '°': '', '#': '', '.': ''}
    for orig, repl in reemplazos.items():
        texto = texto.replace(orig, repl)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

def buscar_columna(headers, nombres_posibles):
    for idx, header in enumerate(headers):
        if header:
            header_normalizado = normalizar_texto(header)
            for posible in nombres_posibles:
                posible_normalizado = normalizar_texto(posible)
                if posible_normalizado == header_normalizado or posible_normalizado in header_normalizado:
                    return idx + 1
    return None

def es_numerico(valor):
    if valor is None: return False
    try:
        float(valor)
        return True
    except ValueError:
        return False

def procesar_y_limpiar_fecha(val_fecha):
    if val_fecha is None: return None, False
    if isinstance(val_fecha, datetime): return val_fecha.strftime("%Y%m%d"), True
    str_fecha = str(val_fecha).strip()
    if str_fecha.endswith('.0'): str_fecha = str_fecha[:-2]
    if not re.match(r'^\d{8}$', str_fecha): return str_fecha, False
    try:
        datetime.strptime(str_fecha, "%Y%m%d")
        return str_fecha, True
    except ValueError:
        return str_fecha, False

def es_fila_vacia(valores):
    return all(v is None or str(v).strip() == "" for v in valores)

def encontrar_mejor_hoja_y_cabecera(wb_orig):
    mejor_ws, mejor_fila_cabecera, mejor_mapeo, max_coincidencias = None, 1, {}, 0
    columnas_a_buscar = {
        "tipo_id": ["tipo de identificacion", "tipo de documento", "tipo id"],
        "n_id": ["n identificacion", "nº identificacion", "no identificacion", "numero identificacion"],
        "nombre": ["nombre tercero", "tercero"],
        "obligacion": ["numero obligacion", "obligacion"],
        "edad_mora": ["edad de mora", "edad mora"],
        "cuotas_mora": ["cuotas de mora", "cuotas en mora", "cuotas mora"],
        "val_inicial": ["valor inicial"],
        "val_mora": ["valor de mora", "valor en mora"],
        "fecha_inicio": ["fecha inicio", "fecha inicio de negocio"],
        "fecha_corte": ["fecha de corte", "fecha corte"]
    }
    for sheet_name in wb_orig.sheetnames:
        ws = wb_orig[sheet_name]
        limite_filas = min(15, ws.max_row + 1)
        for r in range(1, limite_filas):
            headers = [cell.value for cell in ws[r]]
            mapeo_actual, coincidencias = {}, 0
            for clave, terminos in columnas_a_buscar.items():
                idx = buscar_columna(headers, terminos)
                mapeo_actual[clave] = idx
                if idx is not None: coincidencias += 1
            if coincidencias > max_coincidencias:
                max_coincidencias = coincidencias
                mejor_ws, mejor_fila_cabecera, mejor_mapeo = ws, r, mapeo_actual
    return mejor_ws, mejor_fila_cabecera, mejor_mapeo, max_coincidencias

def pintar_fila_completa(ws, fila, fill_color):
    """Pinta todas las celdas de una fila con un color específico"""
    for col in range(1, ws.max_column + 1):
        ws.cell(row=fila, column=col).fill = fill_color

# --- LÓGICA PRINCIPAL DE PROCESAMIENTO ---

def procesar_excel_reducido(ruta_archivo, ruta_salida):
    wb_orig = openpyxl.load_workbook(ruta_archivo, data_only=True)
    ws_orig, fila_cabecera, mapeo, coincidencias = encontrar_mejor_hoja_y_cabecera(wb_orig)

    if not ws_orig or coincidencias < 4:
        raise ValueError("No se encontró una hoja que contenga las columnas requeridas.")

    wb_nuevo = openpyxl.Workbook()
    ws_nuevo = wb_nuevo.active
    ws_nuevo.title = "Revisión Simplificada"

    nuevas_cabeceras = [
        "Tipo de identificación", "Nº identificación", "Nombre tercero", "Numero obligacion",
        "edad de mora", "cuotas en mora", "Valor inicial", "Valor de mora", 
        "Fecha inicio", "Fecha de corte", "Inconsistencia Detectada"
    ]
    ws_nuevo.append(nuevas_cabeceras)

    # Colores
    fill_rojo = PatternFill(start_color="FFFFC7CE", end_color="FFFFC7CE", fill_type="solid")
    fill_naranja = PatternFill(start_color="FFFFEB9C", end_color="FFFFEB9C", fill_type="solid")
    fill_amarillo = PatternFill(start_color="FFFFF2CC", end_color="FFFFF2CC", fill_type="solid")

    idx_tipo_id, idx_id, idx_nombre, idx_obli = mapeo["tipo_id"], mapeo["n_id"], mapeo["nombre"], mapeo["obligacion"]
    idx_edad, idx_cuotas = mapeo["edad_mora"], mapeo["cuotas_mora"]
    idx_val_ini, idx_val_mor = mapeo["val_inicial"], mapeo["val_mora"]
    idx_f_ini, idx_f_cor = mapeo["fecha_inicio"], mapeo["fecha_corte"]

    fila_salida = 2
    for row in range(fila_cabecera + 1, ws_orig.max_row + 1):
        vals = [
            ws_orig.cell(row=row, column=idx).value if idx else None 
            for idx in [idx_tipo_id, idx_id, idx_nombre, idx_obli, idx_edad, idx_cuotas, idx_val_ini, idx_val_mor, idx_f_ini, idx_f_cor]
        ]
        
        if es_fila_vacia(vals): continue

        val_tipo_id, val_id, val_nombre, val_obligacion, val_edad, val_cuotas, val_inicial, val_mora, val_f_inicio, val_f_corte = vals
        
        f_inicio_texto, inicio_ok = procesar_y_limpiar_fecha(val_f_inicio)
        f_corte_texto, corte_ok = procesar_y_limpiar_fecha(val_f_corte)

        # Escribir datos en la nueva hoja
        datos_fila = [val_tipo_id, val_id, val_nombre, val_obligacion, val_edad, val_cuotas, 
                      val_inicial, val_mora, f_inicio_texto, f_corte_texto]
        for col_idx, val in enumerate(datos_fila, start=1):
            ws_nuevo.cell(row=fila_salida, column=col_idx, value=val)

        errores_fila = []
        row_priority = 0  # 0: None, 1: Naranja, 2: Amarillo, 3: Rojo

        # 1. Tipo ID (Amarillo/Naranja)
        if idx_tipo_id:
            if val_tipo_id is not None and str(val_tipo_id).strip() in ["00", "0", "0.0"]:
                errores_fila.append("Tipo de identificación incorrecto (00/0)")
                if row_priority < 2: row_priority = 2
            elif val_tipo_id is None:
                errores_fila.append("Tipo de Identificación vacío")
                if row_priority < 1: row_priority = 1

        # 2. N identificación (Rojo)
        if idx_id and val_id is not None and str(val_id).strip() in ["00", "0", "0.0"]:
            errores_fila.append("Nº Identificación es '00' o '0'")
            if row_priority < 3: row_priority = 3

        # 3. Formato Fechas (Naranja)
        if idx_f_ini and not inicio_ok:
            errores_fila.append("Formato incorrecto en Fecha Inicio")
            if row_priority < 1: row_priority = 1
        if idx_f_cor and not corte_ok:
            errores_fila.append("Formato incorrecto en Fecha Corte")
            if row_priority < 1: row_priority = 1

        # 4. Fecha de corte < Fecha de inicio de negocio (AMARILLO - NUEVA REGLA)
        if idx_f_ini and idx_f_cor and inicio_ok and corte_ok:
            try:
                dt_inicio = datetime.strptime(f_inicio_texto, "%Y%m%d")
                dt_corte = datetime.strptime(f_corte_texto, "%Y%m%d")
                if dt_corte < dt_inicio:
                    errores_fila.append("Fecha de corte es menor a Fecha de inicio de negocio")
                    if row_priority < 2: row_priority = 2
            except Exception: pass

        # 5. Valores Numéricos y Saldos (Naranja)
        inicial_ok = es_numerico(val_inicial) if idx_val_ini else False
        mora_ok = es_numerico(val_mora) if idx_val_mor else False
        if idx_val_ini and not inicial_ok:
            errores_fila.append("Valor inicial no es numérico")
            if row_priority < 1: row_priority = 1
        if idx_val_mor and not mora_ok:
            errores_fila.append("Valor de mora no es numérico")
            if row_priority < 1: row_priority = 1
        if idx_val_ini and idx_val_mor and inicial_ok and mora_ok:
            if float(val_inicial) < float(val_mora):
                errores_fila.append("Valor inicial es menor al Valor de mora")
                if row_priority < 1: row_priority = 1

        # 6. Edad de Mora vs Cuotas en Mora (ROJO - REGLA PRINCIPAL)
        if idx_edad and idx_cuotas:
            difieren = False
            if val_edad is not None and val_cuotas is not None:
                if es_numerico(val_edad) and es_numerico(val_cuotas):
                    if float(val_edad) != float(val_cuotas):
                        difieren = True
                        errores_fila.append(f"Edad de mora ({int(float(val_edad))}) != Cuotas en mora ({int(float(val_cuotas))})")
                else:
                    difieren = True
                    errores_fila.append("Edad o Cuotas de mora no son numéricos")
            elif val_edad is not None or val_cuotas is not None:
                difieren = True
                errores_fila.append("Uno de los campos de mora está vacío")

            if difieren:
                if row_priority < 3: row_priority = 3

        # Pintar fila y escribir inconsistencias
        if errores_fila:
            ws_nuevo.cell(row=fila_salida, column=11, value=" | ".join(errores_fila))
            
            # Aplicar color a TODA la fila según la prioridad
            if row_priority == 3:
                pintar_fila_completa(ws_nuevo, fila_salida, fill_rojo)
            elif row_priority == 2:
                pintar_fila_completa(ws_nuevo, fila_salida, fill_amarillo)
            elif row_priority == 1:
                pintar_fila_completa(ws_nuevo, fila_salida, fill_naranja)
        else:
            ws_nuevo.cell(row=fila_salida, column=11, value="Sin novedades")

        fila_salida += 1

    wb_nuevo.save(ruta_salida)
    return ruta_salida

# --- ENDPOINTS DE LA APLICACIÓN WEB (FASTAPI) ---

@app.get("/", response_class=HTMLResponse)
async def interfaz_subida():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Analizador de Mora - Lucirme</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center; }
            .btn { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px;}
            .btn:hover { background-color: #45a049; }
        </style>
    </head>
    <body>
        <h2>📊 Analizador de Inconsistencias de Mora</h2>
        <p>Sube tu archivo Excel para detectar errores y pintar las filas.</p>
        <form action="/procesar" enctype="multipart/form-data" method="post">
            <input type="file" name="file" accept=".xlsx, .xls" required><br><br>
            <button type="submit" class="btn">Procesar y Descargar</button>
        </form>
    </body>
    </html>
    """

@app.post("/procesar")
async def procesar_archivo(file: UploadFile = File(...)):
    # Crear carpetas temporales si no existen
    os.makedirs("temp", exist_ok=True)
    
    # Guardar archivo subido
    input_path = f"temp/{uuid.uuid4()}_{file.filename}"
    output_path = f"temp/Resultado_{file.filename}"
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Procesar el Excel
        procesar_excel_reducido(input_path, output_path)
        
        # Devolver el archivo procesado como descarga
        return FileResponse(
            output_path, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            filename=f"Resultado_{file.filename}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {str(e)}")
    finally:
        # Limpiar archivo de entrada (el de salida lo limpia el navegador al descargarlo, 
        # pero en producción real deberías usar un task de limpieza)
        if os.path.exists(input_path):
            os.remove(input_path)
import os
import re
import uuid
import shutil
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import openpyxl
from openpyxl.styles import PatternFill, Font
import pandas as pd

# ==========================================
# 1. IMPORTACIÓN DEL ROUTER DE CONCILIACIÓN
# ==========================================
# Intenta importar desde la misma carpeta, si no, desde la carpeta 'routers'
try:
    from conciliacion import router as conciliacion_router
except ImportError:
    from routers.conciliacion import router as conciliacion_router

# ==========================================
# 2. INICIALIZACIÓN DE LA APLICACIÓN
# ==========================================
app = FastAPI(title="API Analizador y Conciliador - LuciRMe AI")

# Configurar CORS para permitir peticiones desde tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambia a ["https://lucirme.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir el router de conciliación (endpoints: /conciliar)
app.include_router(conciliacion_router)

# ==========================================
# 3. FUNCIONES AUXILIARES (Analizador de Mora)
# ==========================================

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

def parsear_fecha(val_fecha):
    if val_fecha is None: return None
    if isinstance(val_fecha, datetime): return val_fecha
    str_fecha = str(val_fecha).strip()
    if str_fecha.endswith('.0'): str_fecha = str_fecha[:-2]
    formatos = ["%Y%m%d", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"]
    for fmt in formatos:
        try:
            return datetime.strptime(str_fecha, fmt)
        except ValueError:
            continue
    return None

def es_fila_vacia(ws, row_idx, max_col):
    for col in range(1, max_col + 1):
        val = ws.cell(row=row_idx, column=col).value
        if val is not None and str(val).strip() != "":
            return False
    return True

def encontrar_mejor_hoja_y_cabecera(wb_orig):
    mejor_ws, mejor_fila_cabecera, mejor_mapeo, max_coincidencias = None, 1, {}, 0
    columnas_a_buscar = {
        "edad_mora": ["edad de mora", "edad mora"],
        "cuotas_mora": ["cuotas de mora", "cuotas en mora", "cuotas mora"],
        "fecha_inicio": ["fecha inicio", "fecha inicio de negocio", "fecha inicio negocio"],
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

# ==========================================
# 4. LÓGICA PRINCIPAL (Analizador de Mora)
# ==========================================

def procesar_excel(ruta_archivo, ruta_salida):
    wb_orig = openpyxl.load_workbook(ruta_archivo, data_only=True)
    ws_orig, fila_cabecera, mapeo, coincidencias = encontrar_mejor_hoja_y_cabecera(wb_orig)

    if not ws_orig or coincidencias < 3:
        raise ValueError("No se encontró una hoja que contenga las columnas de mora y fechas requeridas.")

    wb_nuevo = openpyxl.Workbook()
    ws_resultado = wb_nuevo.active
    ws_resultado.title = "Resultado"
    
    max_col_orig = ws_orig.max_column
    col_inconsistencia = max_col_orig + 1

    # Copiar datos originales
    for r in range(1, ws_orig.max_row + 1):
        for c in range(1, max_col_orig + 1):
            ws_resultado.cell(row=r, column=c, value=ws_orig.cell(row=r, column=c).value)

    ws_resultado.cell(row=fila_cabecera, column=col_inconsistencia, value="Inconsistencia Detectada")
    ws_resultado.cell(row=fila_cabecera, column=col_inconsistencia).font = Font(bold=True)

    ws_resumen = wb_nuevo.create_sheet(title="Resumen")
    for c in range(1, col_inconsistencia + 1):
        val = ws_resultado.cell(row=fila_cabecera, column=c).value
        ws_resumen.cell(row=1, column=c, value=val)
        ws_resumen.cell(row=1, column=c).font = Font(bold=True)
    
    fila_resumen = 2
    fill_rojo = PatternFill(start_color="FFFFC7CE", end_color="FFFFC7CE", fill_type="solid")
    fill_amarillo = PatternFill(start_color="FFFFF2CC", end_color="FFFFF2CC", fill_type="solid")
    fill_naranja = PatternFill(start_color="FFFFEB9C", end_color="FFFFEB9C", fill_type="solid")

    idx_edad = mapeo.get("edad_mora")
    idx_cuotas = mapeo.get("cuotas_mora")
    idx_f_ini = mapeo.get("fecha_inicio")
    idx_f_cor = mapeo.get("fecha_corte")

    for r in range(fila_cabecera + 1, ws_orig.max_row + 1):
        if es_fila_vacia(ws_orig, r, max_col_orig):
            continue

        errores_fila = []
        row_priority = 0

        # Regla Roja: Edad de mora != Cuotas en mora
        if idx_edad and idx_cuotas:
            val_edad = ws_orig.cell(row=r, column=idx_edad).value
            val_cuotas = ws_orig.cell(row=r, column=idx_cuotas).value
            if val_edad is not None or val_cuotas is not None:
                try:
                    e = float(val_edad) if val_edad is not None and str(val_edad).strip() != "" else None
                    c = float(val_cuotas) if val_cuotas is not None and str(val_cuotas).strip() != "" else None
                    if e is None or c is None:
                        errores_fila.append("Falta Edad o Cuotas de mora")
                        if row_priority < 3: row_priority = 3
                    elif e != c:
                        errores_fila.append(f"Edad mora ({int(e)}) != Cuotas mora ({int(c)})")
                        if row_priority < 3: row_priority = 3
                except ValueError:
                    errores_fila.append("Edad o Cuotas de mora no son numéricos")
                    if row_priority < 3: row_priority = 3

        # Regla Amarilla: Fecha de corte < Fecha de inicio
        if idx_f_ini and idx_f_cor:
            val_f_ini = ws_orig.cell(row=r, column=idx_f_ini).value
            val_f_cor = ws_orig.cell(row=r, column=idx_f_cor).value
            dt_inicio = parsear_fecha(val_f_ini)
            dt_corte = parsear_fecha(val_f_cor)
            if dt_inicio and dt_corte:
                if dt_corte < dt_inicio:
                    errores_fila.append("Fecha de corte es menor a Fecha de inicio")
                    if row_priority < 2: row_priority = 2
            elif val_f_cor is not None or val_f_ini is not None:
                errores_fila.append("Formato de fecha inválido")
                if row_priority < 1: row_priority = 1

        if errores_fila:
            texto_error = " | ".join(errores_fila)
            ws_resultado.cell(row=r, column=col_inconsistencia, value=texto_error)
            
            color_fill = None
            if row_priority == 3: color_fill = fill_rojo
            elif row_priority == 2: color_fill = fill_amarillo
            elif row_priority == 1: color_fill = fill_naranja
            
            if color_fill:
                for c in range(1, col_inconsistencia + 1):
                    ws_resultado.cell(row=r, column=c).fill = color_fill

            for c in range(1, col_inconsistencia + 1):
                val_celda = ws_resultado.cell(row=r, column=c).value
                ws_resumen.cell(row=fila_resumen, column=c, value=val_celda)
                if color_fill:
                    ws_resumen.cell(row=fila_resumen, column=c).fill = color_fill
            fila_resumen += 1
        else:
            ws_resultado.cell(row=r, column=col_inconsistencia, value="Sin novedades")

    # Ajustar anchos de columna
    for ws in [ws_resultado, ws_resumen]:
        for col in ws.columns:
            max_length = 0
            column = col[0].column_letter
            for cell in col:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = (max_length + 2) if max_length < 50 else 50
            ws.column_dimensions[column].width = adjusted_width

    wb_nuevo.save(ruta_salida)
    return ruta_salida

# ==========================================
# 5. ENDPOINTS DE LA API
# ==========================================

@app.post("/procesar-excel")
async def procesar_archivo(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    
    file_ext = file.filename.split('.')[-1].lower()
    temp_converted_path = f"temp/convertido_{uuid.uuid4()}.xlsx"
    output_path = f"temp/Resultado_{file.filename.rsplit('.', 1)[0]}.xlsx"
    
    try:
        # 1. Leer el archivo según su extensión usando Pandas
        if file_ext == 'csv':
            try:
                df = pd.read_csv(file.file, encoding='utf-8')
            except UnicodeDecodeError:
                file.file.seek(0) # Resetear puntero del archivo
                df = pd.read_csv(file.file, encoding='latin-1') # Fallback común en Latam
        elif file_ext == 'xls':
            df = pd.read_excel(file.file, engine='xlrd')
        elif file_ext == 'xlsx':
            df = pd.read_excel(file.file, engine='openpyxl')
        else:
            raise HTTPException(status_code=400, detail="Formato no soportado. Use .csv, .xls o .xlsx")
        
        # 2. Guardar como .xlsx temporal para que openpyxl pueda procesarlo y estilizarlo
        df.to_excel(temp_converted_path, index=False, engine='openpyxl')
        
        # 3. Ejecutar la lógica de negocio sobre el archivo convertido
        procesar_excel(temp_converted_path, output_path)
        
        return FileResponse(
            output_path, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            filename=f"Resultado_{file.filename.rsplit('.', 1)[0]}.xlsx"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {str(e)}")
    finally:
        # 4. Limpieza de archivos temporales
        if os.path.exists(temp_converted_path):
            os.remove(temp_converted_path)

# Endpoint de prueba para verificar que el servidor está vivo
@app.get("/")
def read_root():
    return {"status": "ok", "message": "API de LuciRMe AI funcionando correctamente"}
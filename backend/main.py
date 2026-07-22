from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import openpyxl
from openpyxl.styles import PatternFill, Font
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter
import tempfile
import os

# 1. Inicialización de la aplicación FastAPI
app = FastAPI(
    title="Servicio Web de Procesamiento y Conciliación",
    version="2.0"
)

# 2. Configuración de CORS (Esencial para permitir llamadas desde Astro/Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción puedes cambiar "*" por el dominio exacto de tu web en Astro
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Ruta raíz para verificar que el servicio esté activo
# -------------------------------------------------------------------
@app.get("/")
def home():
    return {"status": "ok", "message": "API activa en Render"}


# -------------------------------------------------------------------
# SOLUCIÓN 1: Procesamiento de un solo archivo (Tu función previa)
# -------------------------------------------------------------------
@app.post("/api/procesar-archivo")
async def procesar_archivo_unico(file: UploadFile = File(...)):
    try:
        # Ejemplo/Estructura base para tu primera función
        df = pd.read_excel(file.file)
        
        # Guardar en archivo temporal
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
        output_path = temp_file.name
        
        # Guardar resultado
        df.to_excel(output_path, index=False)
        
        return FileResponse(
            path=output_path,
            filename=f"Procesado_{file.filename}",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar el archivo: {str(e)}")


# -------------------------------------------------------------------
# SOLUCIÓN 2: Conciliación de dos archivos (DIAN vs Contabilidad)
# -------------------------------------------------------------------
@app.post("/api/conciliacion")
async def conciliar_archivos(
    file_dian: UploadFile = File(...),
    file_conta: UploadFile = File(...)
):
    try:
        # Cargar los datos desde los archivos adjuntos
        df_dian = pd.read_excel(file_dian.file)
        df_conta = pd.read_excel(file_conta.file)

        # Normalizar nombres de columnas eliminando espacios accidentales
        df_dian.columns = df_dian.columns.str.strip()
        df_conta.columns = df_conta.columns.str.strip()

        # Realizar la unión/cruce de datos (Ajusta 'ID_TRANSACCION' según tu columna clave)
        # Si la columna clave se llama diferente en cada archivo, usa: left_on='Col_DIAN', right_on='Col_CONTA'
        merged = pd.merge(
            df_dian, 
            df_conta, 
            on="ID_TRANSACCION", 
            how="outer", 
            suffixes=('_DIAN', '_CONTA'), 
            indicator=True
        )

        # Regla de estado para cada registro
        def determinar_estado(row):
            if row['_merge'] == 'left_only':
                return 'Solo en Facturación'
            elif row['_merge'] == 'right_only':
                return 'Solo en Contabilidad'
            else:
                # Compara valores monetarios si existen las columnas (ajustar nombres si aplica)
                valor_dian = row.get('VALOR_DIAN', 0)
                valor_conta = row.get('VALOR_CONTA', 0)
                if pd.notna(valor_dian) and pd.notna(valor_conta) and valor_dian != valor_conta:
                    return 'Diferencia'
                return 'Conciliado'

        merged['Estado_Conciliacion'] = merged.apply(determinar_estado, axis=1)

        # Eliminar la columna técnica de merge
        merged.drop(columns=['_merge'], inplace=True)

        # Crear libro de Excel con openpyxl
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Conciliación"

        # Escribir encabezados
        ws.append(list(merged.columns))

        # Escribir filas limpiando valores nulos
        for row in merged.itertuples(index=False):
            row_cleaned = [None if pd.isna(val) else val for val in row]
            ws.append(row_cleaned)

        # Configuración de estilos condicionales (Rojo y Amarillo)
        fill_rojo = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
        font_rojo = Font(color="9C0006")

        fill_amarillo = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")
        font_amarillo = Font(color="9C6500")

        # Obtener el rango de celdas para la columna 'Estado_Conciliacion'
        col_idx = merged.columns.get_loc("Estado_Conciliacion") + 1
        col_letter = get_column_letter(col_idx)
        total_filas = len(merged) + 1
        rango_estado = f"{col_letter}2:{col_letter}{total_filas}"

        # Aplicar reglas de formato condicional
        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Solo en Contabilidad"'], fill=fill_rojo, font=font_rojo))
        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Solo en Facturación"'], fill=fill_rojo, font=font_rojo))
        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Diferencia"'], fill=fill_amarillo, font=font_amarillo))

        # Crear archivo temporal seguro
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
        output_file_path = temp_file.name
        temp_file.close()

        # Guardar el archivo Excel
        wb.save(output_file_path)

        # Retornar la respuesta como descarga directa de Excel
        return FileResponse(
            path=output_file_path,
            filename="Conciliacion_DIAN_vs_Contabilidad.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error durante el procesamiento de la conciliación: {str(e)}"
        )
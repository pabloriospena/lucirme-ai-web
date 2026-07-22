# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import openpyxl
from openpyxl.styles import PatternFill, Font
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter
import tempfile
import os

app = FastAPI(
    title="Servicio Web de Procesamiento y Conciliación",
    version="2.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "ok", "message": "API activa en Render"}


# -------------------------------------------------------------------
# RUTA 1: Validador CIFIN (Acepta todas las variantes de URL posibles)
# -------------------------------------------------------------------
@app.post("/procesar-excel")
@app.post("/procesar-excel/")
@app.post("/api/procesar-archivo")
@app.post("/api/procesar-archivo/")
async def procesar_archivo_unico(file: UploadFile = File(...)):
    try:
        df = pd.read_excel(file.file)
        
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
        output_path = temp_file.name
        temp_file.close()
        
        df.to_excel(output_path, index=False)
        
        return FileResponse(
            path=output_path,
            filename=f"Procesado_{file.filename}",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar el archivo: {str(e)}")


# -------------------------------------------------------------------
# RUTA 2: Conciliador (Acepta con y sin slash)
# -------------------------------------------------------------------
@app.post("/api/conciliacion")
@app.post("/api/conciliacion/")
@app.post("/conciliacion")
@app.post("/conciliacion/")
async def conciliar_archivos(
    file_dian: UploadFile = File(...),
    file_conta: UploadFile = File(...)
):
    try:
        df_dian = pd.read_excel(file_dian.file)
        df_conta = pd.read_excel(file_conta.file)

        df_dian.columns = df_dian.columns.str.strip()
        df_conta.columns = df_conta.columns.str.strip()

        merged = pd.merge(
            df_dian, 
            df_conta, 
            on="ID_TRANSACCION", 
            how="outer", 
            suffixes=('_DIAN', '_CONTA'), 
            indicator=True
        )

        def determinar_estado(row):
            if row['_merge'] == 'left_only':
                return 'Solo en Facturación'
            elif row['_merge'] == 'right_only':
                return 'Solo en Contabilidad'
            else:
                valor_dian = row.get('VALOR_DIAN', 0)
                valor_conta = row.get('VALOR_CONTA', 0)
                if pd.notna(valor_dian) and pd.notna(valor_conta) and valor_dian != valor_conta:
                    return 'Diferencia'
                return 'Conciliado'

        merged['Estado_Conciliacion'] = merged.apply(determinar_estado, axis=1)
        merged.drop(columns=['_merge'], inplace=True)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Conciliación"

        ws.append(list(merged.columns))

        for row in merged.itertuples(index=False):
            row_cleaned = [None if pd.isna(val) else val for val in row]
            ws.append(row_cleaned)

        fill_rojo = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
        font_rojo = Font(color="9C0006")
        fill_amarillo = PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid")
        font_amarillo = Font(color="9C6500")

        col_idx = merged.columns.get_loc("Estado_Conciliacion") + 1
        col_letter = get_column_letter(col_idx)
        total_filas = len(merged) + 1
        rango_estado = f"{col_letter}2:{col_letter}{total_filas}"

        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Solo en Contabilidad"'], fill=fill_rojo, font=font_rojo))
        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Solo en Facturación"'], fill=fill_rojo, font=font_rojo))
        ws.conditional_formatting.add(rango_estado, CellIsRule(operator='equal', formula=['"Diferencia"'], fill=fill_amarillo, font=font_amarillo))

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
        output_file_path = temp_file.name
        temp_file.close()

        wb.save(output_file_path)

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
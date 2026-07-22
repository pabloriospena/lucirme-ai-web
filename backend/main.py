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
# RUTA 1: Validador CIFIN
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
# RUTA 2: Conciliador DIAN vs Contabilidad
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

        # Limpiar espacios en blanco al inicio/final de las columnas
        df_dian.columns = df_dian.columns.str.strip()
        df_conta.columns = df_conta.columns.str.strip()

        # Prioridades de columnas identificadoras/llaves
        posibles_llaves_dian = [
            "NIT Emisor", "NIT Receptor", "Folio", "CUFE/CUDE", 
            "ID_TRANSACCION", "id_transaccion", "FACTURA", "NIT"
        ]
        posibles_llaves_conta = [
            "NIT Emisor", "NIT", "Nit", "ID_TRANSACCION", "id_transaccion", 
            "DOCUMENTO", "Documento", "FACTURA", "Factura", "Folio"
        ]

        # Detectar la primera coincidencia
        col_dian = next((c for c in posibles_llaves_dian if c in df_dian.columns), None)
        col_conta = next((c for c in posibles_llaves_conta if c in df_conta.columns), None)

        if not col_dian:
            raise HTTPException(
                status_code=400, 
                detail=f"No se encontró una columna clave en la DIAN. Columnas disponibles: {list(df_dian.columns)}"
            )

        if not col_conta:
            raise HTTPException(
                status_code=400, 
                detail=f"No se encontró una columna clave en Contabilidad. Columnas disponibles: {list(df_conta.columns)}"
            )

        # Convertir ambas columnas llave a string/texto para evitar fallos de tipo (int vs str)
        df_dian[col_dian] = df_dian[col_dian].astype(str).str.strip()
        df_conta[col_conta] = df_conta[col_conta].astype(str).str.strip()

        # Realizar el cruce (merge)
        merged = pd.merge(
            df_dian, 
            df_conta, 
            left_on=col_dian,
            right_on=col_conta,
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
                # Detectar columnas de valor total
                valor_dian = row.get('Total', row.get('Total_DIAN', row.get('VALOR_DIAN', 0)))
                valor_conta = row.get('Total_CONTA', row.get('VALOR_CONTA', row.get('Total', 0)))
                
                try:
                    v_dian = float(valor_dian) if pd.notna(valor_dian) else 0.0
                    v_conta = float(valor_conta) if pd.notna(valor_conta) else 0.0
                    if round(v_dian, 2) != round(v_conta, 2):
                        return 'Diferencia'
                except (ValueError, TypeError):
                    pass
                
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

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error durante el procesamiento de la conciliación: {str(e)}"
        )
import io
import re
import pandas as pd
import openpyxl
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI(title="API Procesador Siigo")

# HABILITAR CORS PARA PODER LLAMAR DESDE CUALQUIER FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O la URL de tu web: ["https://lucirme.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

@app.get("/")
def home():
    return {"status": "ok", "message": "Servidor de Procesamiento de Excel Activo"}

@app.post("/procesar-siigo")
async def procesar_siigo(file: UploadFile = File(...)):
    # 1. Validar extensión del archivo
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="El archivo debe ser un Excel (.xlsx o .xls)")

    try:
        # 2. Leer archivo en memoria desde el request
        contents = await file.read()
        input_buffer = io.BytesIO(contents)

        # Leer hoja original
        df_original = pd.read_excel(input_buffer, sheet_name=0)

        # 3. Limpieza inicial de metadatos de Siigo
        df_clean = df_original.dropna(subset=['Tipo transacción']).copy()
        df_clean = df_clean[~df_clean['Tipo transacción'].str.contains('Procesado en', na=False)]

        # Conversión de columnas numéricas
        numeric_cols = ['Total', 'Cantidad', 'Valor unitario', 'Valor desc.', 'Valor Impuesto Cargo', 'Valor Impuesto Cargo 2']
        for col in numeric_cols:
            if col in df_clean.columns:
                df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0)

        # Definir la columna de fecha para ordenamiento
        date_col = 'Fecha elaboración' if 'Fecha elaboración' in df_clean.columns else 'Fecha creación'
        if date_col in df_clean.columns:
            df_clean[date_col] = pd.to_datetime(df_clean[date_col], errors='coerce')

        # 4. FILTRO DE DUPLICADOS (Referencia fábrica más reciente)
        if 'Referencia fábrica' in df_clean.columns:
            df_valid_ref = df_clean[df_clean['Referencia fábrica'].notna() & (df_clean['Referencia fábrica'].astype(str).str.strip() != '')].copy()
            df_no_ref = df_clean[df_clean['Referencia fábrica'].isna() | (df_clean['Referencia fábrica'].astype(str).str.strip() == '')].copy()

            if date_col in df_valid_ref.columns:
                df_valid_ref = df_valid_ref.sort_values(by=date_col, ascending=False)

            df_dedup_ref = df_valid_ref.drop_duplicates(subset=['Referencia fábrica'], keep='first')
            df_filtered = pd.concat([df_dedup_ref, df_no_ref], ignore_index=True)
        else:
            df_filtered = df_clean.copy()

        # 5. CLASIFICACIÓN: Moto vs Repuesto
        def classify_product(row):
            nombre = str(row.get('Nombre', '')).upper()
            ref = str(row.get('Referencia fábrica', '')).upper()
            if 'CHASIS' in nombre or 'MOTOR' in nombre or 'CHASIS' in ref or 'MOTOR' in ref:
                return 'Moto'
            elif 'CC ' in nombre or 'MODELO 20' in nombre or 'MOD 20' in nombre:
                return 'Moto'
            else:
                return 'Repuesto'

        df_filtered['Categoría'] = df_filtered.apply(classify_product, axis=1)

        # 6. LIMPIEZA DE NOMBRE
        def clean_product_name(name):
            name_str = str(name)
            match = re.search(r'\bchasis\b', name_str, re.IGNORECASE)
            if match:
                truncated = name_str[:match.start()].strip()
                return truncated if truncated else name_str.strip()
            return name_str.strip()

        df_filtered['Nombre_Limpio'] = df_filtered['Nombre'].apply(clean_product_name)

        # 7. INDICADORES Y AGRUPACIONES
        total_facturacion = df_filtered['Total'].sum() if 'Total' in df_filtered.columns else 0
        total_unidades = df_filtered['Cantidad'].sum() if 'Cantidad' in df_filtered.columns else 0

        # Centro de Costos
        if 'Centro costo' in df_filtered.columns:
            cc_grouped = df_filtered.groupby('Centro costo').agg(
                Unidades=('Cantidad', 'sum'),
                Suma_Valor_Unitario=('Valor unitario', 'sum'),
                Valor_Descuento=('Valor desc.', 'sum'),
                Valor_Impuesto_Cargo=('Valor Impuesto Cargo', 'sum'),
                Valor_Impuesto_Cargo_2=('Valor Impuesto Cargo 2', 'sum'),
                Ventas_Netas=('Total', 'sum'),
                Transacciones=('Número comprobante', 'count') if 'Número comprobante' in df_filtered.columns else ('Total', 'count')
            ).reset_index()

            cc_grouped['Participación %'] = (cc_grouped['Ventas_Netas'] / total_facturacion * 100) if total_facturacion > 0 else 0
            cc_grouped = cc_grouped.sort_values(by='Ventas_Netas', ascending=False)

            cc_grouped = cc_grouped[[
                'Centro costo', 'Unidades', 'Suma_Valor_Unitario', 'Valor_Descuento',
                'Valor_Impuesto_Cargo', 'Valor_Impuesto_Cargo_2', 'Ventas_Netas',
                'Participación %', 'Transacciones'
            ]]
            cc_grouped.columns = [
                'Centro costo', 'Unidades', 'Suma Valor Unitario', 'Valor Descuento',
                'Valor Impuesto a Cargo', 'Valor Impuesto a Cargo 2', 'Ventas Netas',
                'Participación %', 'Transacciones'
            ]
        else:
            cc_grouped = pd.DataFrame()

        # Productos Estrella
        motos_df = df_filtered[df_filtered['Categoría'] == 'Moto']
        repuestos_df = df_filtered[df_filtered['Categoría'] == 'Repuesto']

        top_motos = motos_df.groupby('Nombre_Limpio').agg(
            Unidades=('Cantidad', 'sum'),
            Ventas_Totales=('Total', 'sum')
        ).reset_index().sort_values(by='Unidades', ascending=False).head(10).rename(columns={'Nombre_Limpio': 'Nombre Producto'})

        top_repuestos = repuestos_df.groupby('Nombre_Limpio').agg(
            Unidades=('Cantidad', 'sum'),
            Ventas_Totales=('Total', 'sum')
        ).reset_index().sort_values(by='Unidades', ascending=False).head(10).rename(columns={'Nombre_Limpio': 'Nombre Producto'})

        # 8. GUARDAR EXCEL MULTI-HOJA EN MEMORIA
        output_stream = io.BytesIO()
        with pd.ExcelWriter(output_stream, engine='openpyxl') as writer:
            summary_data = pd.DataFrame({
                'Indicador Gerencial': ['Facturación Neta Total (Sin Duplicados)', 'Total Unidades Vendidas', 'Total Transacciones Activas'],
                'Valor': [total_facturacion, total_unidades, len(df_filtered)]
            })
            summary_data.to_excel(writer, sheet_name='Resumen Ejecutivo', index=False, startrow=2)
            cc_grouped.to_excel(writer, sheet_name='Centro de Costos', index=False, startrow=2)
            top_motos.to_excel(writer, sheet_name='Productos Estrella', index=False, startrow=2)
            top_repuestos.to_excel(writer, sheet_name='Productos Estrella', index=False, startrow=15)
            df_filtered.to_excel(writer, sheet_name='Detalle Depurado', index=False)
            df_original.to_excel(writer, sheet_name='Archivo Original', index=False)

        output_stream.seek(0)

        # 9. RETORNAR EL ARCHIVO BINARIO PARA DESCARGA DIRECTA
        return StreamingResponse(
            output_stream,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=Informe_Gerencial_Ventas_Final.xlsx"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {str(e)}")
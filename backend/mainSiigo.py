# main.py en Render
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import openpyxl
import re
import io

app = FastAPI()

# Habilitar CORS para que tu web en Vercel pueda conectarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # O sustituir por "https://tu-dominio.vercel.app"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/procesar")
async def procesar_excel(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Debe ser un archivo Excel (.xlsx)")

    contents = await file.read()
    
    # 1. Leer archivo original
    df_original = pd.read_excel(io.BytesIO(contents), sheet_name=0)

    # 2. Limpieza inicial
    df_clean = df_original.dropna(subset=['Tipo transacción']).copy()
    df_clean = df_clean[~df_clean['Tipo transacción'].str.contains('Procesado en', na=False)]

    numeric_cols = ['Total', 'Cantidad', 'Valor unitario', 'Valor desc.', 'Valor Impuesto Cargo', 'Valor Impuesto Cargo 2']
    for col in numeric_cols:
        if col in df_clean.columns:
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0)

    date_col = 'Fecha elaboración' if 'Fecha elaboración' in df_clean.columns else 'Fecha creación'
    df_clean[date_col] = pd.to_datetime(df_clean[date_col], errors='coerce')

    # 3. Filtro de duplicados
    df_valid_ref = df_clean[df_clean['Referencia fábrica'].notna() & (df_clean['Referencia fábrica'].astype(str).str.strip() != '')].copy()
    df_no_ref = df_clean[df_clean['Referencia fábrica'].isna() | (df_clean['Referencia fábrica'].astype(str).str.strip() == '')].copy()

    df_valid_ref = df_valid_ref.sort_values(by=date_col, ascending=False)
    df_dedup_ref = df_valid_ref.drop_duplicates(subset=['Referencia fábrica'], keep='first')
    df_filtered = pd.concat([df_dedup_ref, df_no_ref], ignore_index=True)

    # 4. Clasificación Moto vs Repuesto
    def classify_product(row):
        nombre = str(row['Nombre']).upper()
        ref = str(row['Referencia fábrica']).upper()
        if 'CHASIS' in nombre or 'MOTOR' in nombre or 'CHASIS' in ref or 'MOTOR' in ref:
            return 'Moto'
        elif 'CC ' in nombre or 'MODELO 20' in nombre or 'MOD 20' in nombre:
            return 'Moto'
        else:
            return 'Repuesto'

    df_filtered['Categoría'] = df_filtered.apply(classify_product, axis=1)

    # Limpieza de nombre
    def clean_product_name(name):
        name_str = str(name)
        match = re.search(r'\bchasis\b', name_str, re.IGNORECASE)
        if match:
            truncated = name_str[:match.start()].strip()
            return truncated if truncated else name_str.strip()
        return name_str.strip()

    df_filtered['Nombre_Limpio'] = df_filtered['Nombre'].apply(clean_product_name)

    # 5. Agrupaciones
    total_facturacion = df_filtered['Total'].sum()
    total_unidades = df_filtered['Cantidad'].sum()

    cc_grouped = df_filtered.groupby('Centro costo').agg(
        Unidades=('Cantidad', 'sum'),
        Suma_Valor_Unitario=('Valor unitario', 'sum'),
        Valor_Descuento=('Valor desc.', 'sum'),
        Valor_Impuesto_Cargo=('Valor Impuesto Cargo', 'sum'),
        Valor_Impuesto_Cargo_2=('Valor Impuesto Cargo 2', 'sum'),
        Ventas_Netas=('Total', 'sum'),
        Transacciones=('Número comprobante', 'count')
    ).reset_index()

    cc_grouped['Participación %'] = (cc_grouped['Ventas_Netas'] / total_facturacion) * 100
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

    # 6. Escribir en memoria
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
    return StreamingResponse(
        output_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=Informe_Gerencial_Ventas_Final.xlsx"}
    )
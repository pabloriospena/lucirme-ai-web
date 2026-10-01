import { jsPDF } from 'jspdf';
import type { BottleneckDiagnosisResult } from './bottleneck';

export function generateBottleneckPDF(diag: BottleneckDiagnosisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header Bar
  doc.setFillColor(15, 118, 110); // #0F766E Teal
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LuciRMe AI · Empresas', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Primero el problema. Después la tecnología. | lucirme.com/empresas', margin + 6, y + 16);

  y += 30;

  // Document Title
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Diagnóstico de Cuello de Botella Operativo', margin, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado para ${diag.empresa || 'Tu Empresa'} el ${new Date().toLocaleDateString('es-CO')}`, margin, y);

  y += 10;

  // Section 1: Datos de la Empresa
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('1. Datos de la Empresa y Contacto', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const col1X = margin + 5;
  const col2X = margin + 95;

  doc.text(`Empresa: ${diag.empresa}`, col1X, y + 14);
  doc.text(`Contacto: ${diag.name} (${diag.email})`, col1X, y + 20);
  doc.text(`Tamaño: ${diag.tamano}`, col1X, y + 26);

  doc.text(`Industria/Sector: ${diag.industria}`, col2X, y + 14);
  doc.text(`Ubicación: ${diag.ciudad}, ${diag.pais}`, col2X, y + 20);

  y += 38;

  // Section 2: Proceso Analizado
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('2. Proceso Operativo Analizado', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  doc.text(`Proceso: ${diag.proceso}`, col1X, y + 14);
  doc.text(`Frecuencia: ${diag.frecuencia}`, col1X, y + 21);
  doc.text(`Tiempo por sesión: ${diag.tiempo}`, col1X, y + 28);

  doc.text(`Personas involucradas: ${diag.personas}`, col2X, y + 14);
  doc.text(`Impacto principal: ${diag.impacto}`, col2X, y + 21);
  doc.text(`Esfuerzo estimado: ${diag.esfuerzo}`, col2X, y + 28);

  y += 44;

  // Section 3: Cálculo y Resultado
  const isHigh = diag.prioridad === 'Alta';
  if (isHigh) {
    doc.setFillColor(254, 243, 199); // Light Amber
    doc.setDrawColor(245, 158, 11);
  } else {
    doc.setFillColor(240, 253, 250); // Light Teal
    doc.setDrawColor(13, 148, 136);
  }
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(isHigh ? 146 : 15, isHigh ? 64 : 118, isHigh ? 14 : 110);
  doc.text(`Fuga Estimada de Tiempo: ~${diag.weeklyHours} horas / semana`, margin + 5, y + 8);

  doc.setFontSize(10);
  doc.text(`Prioridad de Intervención: ${diag.prioridadBadge}`, margin + 5, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  const justLines = doc.splitTextToSize(`Justificación: ${diag.justificacion}`, contentWidth - 10);
  doc.text(justLines, margin + 5, y + 22);

  y += 48;

  // Section 4: Siguiente Paso Recomendado
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Siguiente Paso Recomendado por LuciRMe AI', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const recLines = doc.splitTextToSize(diag.recomendacion, contentWidth - 10);
  doc.text(recLines, margin + 5, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('💬 Contactar a Pablo Ríos por WhatsApp: +57 305 3046180', margin + 5, y + 26);

  y += 38;

  // Footer text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Diagnóstico generado automáticamente por LuciRMe AI · Pablo Ríos Peña', margin, y);

  const cleanEmpresaName = (diag.empresa || 'Empresa').replace(/[^a-zA-Z0-9_]/g, '_');
  doc.save(`Diagnostico_Cuello_de_Botella_${cleanEmpresaName}.pdf`);
}

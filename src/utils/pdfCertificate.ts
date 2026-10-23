import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  scorePercentage: number;
  certificateId: string;
  instructorName?: string;
}

/**
 * Generates an elegant, high-resolution vector PDF certificate for course completion.
 */
export function generateCertificatePdf(data: CertificateData): void {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background subtle tint
  doc.setFillColor(252, 250, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(2.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Inner hairline border
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(0.6);
  doc.rect(16, 16, pageWidth - 32, pageHeight - 32);

  // Corner decorative flourishes
  const cornerSize = 10;
  doc.setFillColor(217, 119, 6);
  // Top-left
  doc.rect(16, 16, cornerSize, 1.5, 'F');
  doc.rect(16, 16, 1.5, cornerSize, 'F');
  // Top-right
  doc.rect(pageWidth - 16 - cornerSize, 16, cornerSize, 1.5, 'F');
  doc.rect(pageWidth - 16 - 1.5, 16, 1.5, cornerSize, 'F');
  // Bottom-left
  doc.rect(16, pageHeight - 16 - 1.5, cornerSize, 1.5, 'F');
  doc.rect(16, pageHeight - 16 - cornerSize, 1.5, cornerSize, 'F');
  // Bottom-right
  doc.rect(pageWidth - 16 - cornerSize, pageHeight - 16 - 1.5, cornerSize, 1.5, 'F');
  doc.rect(pageWidth - 16 - 1.5, pageHeight - 16 - cornerSize, 1.5, cornerSize, 'F');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text('TANISHUV.UZ · WEB DASTURLASH AKADEMIYASI', pageWidth / 2, 34, { align: 'center' });

  // Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(28, 25, 23); // stone-900
  doc.text('BITIRUVCHI SERTIFIKATI', pageWidth / 2, 52, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(120, 113, 108); // stone-500
  doc.text(
    'Ushbu rasmiy hujjat quyidagi o\'quvchining kursni muvaffaqiyatli tamomlaganini tasdiqlaydi:',
    pageWidth / 2,
    64,
    { align: 'center' }
  );

  // Student Name
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(28);
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text(data.studentName || 'Hurmatli O\'quvchi', pageWidth / 2, 85, { align: 'center' });

  // Name underline
  doc.setDrawColor(244, 63, 94);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 60, 90, pageWidth / 2 + 60, 90);

  // Course Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(68, 64, 60); // stone-700
  doc.text(
    `\"${data.courseTitle}\"`,
    pageWidth / 2,
    104,
    { align: 'center' }
  );

  doc.setFontSize(10);
  doc.setTextColor(87, 83, 78);
  const narrative =
    'Web dasturlashning barcha nazariy va amaliy bosqichlarini (HTML5, CSS3, SCSS, Bootstrap, JavaScript va Python asoslari) ' +
    `to'liq o'zlashtirib, yakuniy imtihon sinovlaridan ${data.scorePercentage}% natija bilan muvaffaqiyatli o'tgani munosabati bilan taqdim etiladi.`;
  
  const splitNarrative = doc.splitTextToSize(narrative, 190);
  doc.text(splitNarrative, pageWidth / 2, 114, { align: 'center' });

  // Golden Medal Seal Badge (Vector)
  const sealX = pageWidth / 2;
  const sealY = 146;
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(1.2);
  doc.circle(sealX, sealY, 13, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('TASDIQLANGAN', sealX, sealY - 2, { align: 'center' });
  doc.setFontSize(11);
  doc.text('★ 100% ★', sealX, sealY + 3.5, { align: 'center' });
  doc.setFontSize(7);
  doc.text('VERIFIED', sealX, sealY + 7.5, { align: 'center' });

  // Bottom Signature & Verification Info
  const leftX = 45;
  const rightX = pageWidth - 45;
  const bottomY = 178;

  // Left: Date & ID
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text(`Sana: ${data.completionDate}`, leftX, bottomY);
  doc.text(`Sertifikat ID: ${data.certificateId}`, leftX, bottomY + 5);
  doc.setDrawColor(214, 211, 209);
  doc.setLineWidth(0.5);
  doc.line(leftX, bottomY - 3, leftX + 45, bottomY - 3);

  // Right: Signature
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(28, 25, 23);
  doc.text(data.instructorName || 'legend_o1 (Olimjon)', rightX, bottomY - 2, { align: 'right' });
  doc.setDrawColor(28, 25, 23);
  doc.setLineWidth(0.6);
  doc.line(rightX - 55, bottomY - 1, rightX, bottomY - 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text('Bosh Murabbiy & Admin', rightX, bottomY + 4, { align: 'right' });

  // Save PDF file
  const safeName = (data.studentName || 'Talaba').toLowerCase().replace(/\s+/g, '_');
  doc.save(`${safeName}_HTML_CSS_JS_Asoslari_Sertifikat.pdf`);
}

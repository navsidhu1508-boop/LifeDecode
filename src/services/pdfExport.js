import { jsPDF } from 'jspdf';

/**
 * Generates a clean, beautifully formatted PDF report of the decoded document
 */
export function exportExplanationToPdf(result, metadata = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 22;

  function checkPageBreak(spaceNeeded) {
    if (cursorY + spaceNeeded > pageHeight - 20) {
      doc.addPage();
      cursorY = 20;
      // Header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('LifeDecode — Explanation Report', margin, 12);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 14, pageWidth - margin, 14);
    }
  }

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('LifeDecode', margin, cursorY);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(99, 102, 241); // indigo-500
  doc.text('Understand complicated things. Make smarter decisions.', margin + 45, cursorY - 1);

  cursorY += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // Metadata block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  const dateStr = new Date().toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const lang = metadata.language || 'English';
  const style = metadata.style || 'Very Simple';
  doc.text(`Generated: ${dateStr}   |   Language: ${lang}   |   Style: ${style}   |   Category: ${(result.category || 'General').toUpperCase()}`, margin, cursorY);
  cursorY += 10;

  // Section 1: Document Summary & Simple Explanation
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('1. Simple Explanation', margin, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // slate-700
  const explanationLines = doc.splitTextToSize(result.simpleExplanation || result.documentSummary || 'No explanation available.', contentWidth);
  doc.text(explanationLines, margin, cursorY);
  cursorY += (explanationLines.length * 5) + 8;

  // Section 2: Important Points
  if (Array.isArray(result.importantPoints) && result.importantPoints.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('2. Important Points', margin, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    result.importantPoints.forEach((point) => {
      checkPageBreak(12);
      const pointLines = doc.splitTextToSize(`• ${point}`, contentWidth - 4);
      doc.text(pointLines, margin + 2, cursorY);
      cursorY += (pointLines.length * 5) + 2;
    });
    cursorY += 6;
  }

  // Section 3: Difficult Words Explained
  if (Array.isArray(result.difficultWords) && result.difficultWords.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('3. Difficult Words & Jargon Explained', margin, cursorY);
    cursorY += 6;

    result.difficultWords.forEach((item) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.term}:`, margin + 2, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const meaningLines = doc.splitTextToSize(item.meaning, contentWidth - 30);
      doc.text(meaningLines, margin + 30, cursorY);
      cursorY += (meaningLines.length * 5) + 3;
    });
    cursorY += 6;
  }

  // Section 4: What You Should Know (Risks & Conditions)
  if (Array.isArray(result.whatYouShouldKnow) && result.whatYouShouldKnow.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(194, 65, 12); // orange-700
    doc.text('4. What You Should Know (Risks & Conditions)', margin, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    result.whatYouShouldKnow.forEach((risk) => {
      checkPageBreak(12);
      const riskLines = doc.splitTextToSize(`! ${risk}`, contentWidth - 4);
      doc.text(riskLines, margin + 2, cursorY);
      cursorY += (riskLines.length * 5) + 2;
    });
    cursorY += 6;
  }

  // Section 5: Suggested Next Steps
  if (Array.isArray(result.suggestedNextSteps) && result.suggestedNextSteps.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('5. Suggested Next Steps', margin, cursorY);
    cursorY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    result.suggestedNextSteps.forEach((step, idx) => {
      checkPageBreak(12);
      const stepLines = doc.splitTextToSize(`${idx + 1}. ${step}`, contentWidth - 4);
      doc.text(stepLines, margin + 2, cursorY);
      cursorY += (stepLines.length * 5) + 2;
    });
    cursorY += 6;
  }

  // Section 6: Disclaimer
  if (result.disclaimer) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const disclaimerLines = doc.splitTextToSize(`Disclaimer: ${result.disclaimer}`, contentWidth);
    doc.text(disclaimerLines, margin, cursorY);
  }

  const filename = `LifeDecode-Report-${(result.category || 'document').toLowerCase()}-${Date.now().toString(36)}.pdf`;
  doc.save(filename);
}

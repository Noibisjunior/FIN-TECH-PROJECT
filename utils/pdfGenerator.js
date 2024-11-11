const PDFDocument = require('pdfkit');
const fs = require('fs');

const pdfGenerator = (transactions, startDate, endDate, pdfPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // Add title and date range
    doc.fontSize(16).text(`Account Statement`, { align: 'center' });
    doc.fontSize(12).text(`From: ${startDate} To: ${endDate}`, { align: 'center' });

    // Add table headers
    doc.moveDown();
    doc.fontSize(10).text('Date', { continued: true, width: 100, align: 'left' });
    doc.text('Description', { continued: true, width: 200, align: 'center' });
    doc.text('Amount', { align: 'right' });

    // Add each transaction
    transactions.forEach(tx => {
      doc.text(tx.date.toISOString().split('T')[0], { continued: true, width: 100, align: 'left' });
      doc.text(tx.description, { continued: true, width: 200, align: 'center' });
      doc.text(tx.amount.toFixed(2), { align: 'right' });
    });


    doc.end();

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
};

module.exports = pdfGenerator;

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { salygosText } = require("../data/salygosText.js");

const generateGarantinisPDF = async (garantinis, signatureBase64) => {
  const uploadsDir = path.resolve("public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `garantinis_${garantinis._id}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: false, margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font("Helvetica");

    // 1. Sąlygų puslapis
    doc.addPage();
    doc
      .fontSize(16)
      .text("GARANTINĖS SĄLYGOS IR TAISYKLĖS", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(salygosText, { align: "left" });

    // 2. Garantinis
    doc.addPage();
    doc.fontSize(18).text("Garantinio dokumentas", { align: "center" });
    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .fillColor("black")
      .text("Kliento informacija:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Klientas: ${garantinis.klientas.vardas}`);
    doc.text(`Telefonas: ${garantinis.klientas.telefonas}`);
    doc.text(`Miestas: ${garantinis.klientas.miestas}`);
    doc.moveDown();

    doc.fontSize(12).text("Prekės:", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = {
      pavadinimas: 50,
      serial: 250,
      kaina: 420,
    };

    doc.rect(itemX.pavadinimas, tableTop, 500, 20).stroke();
    doc
      .fontSize(10)
      .text("Pavadinimas", itemX.pavadinimas + 5, tableTop + 5)
      .text("Serijos Nr.", itemX.serial + 5, tableTop + 5)
      .text("Kaina (€)", itemX.kaina + 5, tableTop + 5);

    let y = tableTop + 20;
    garantinis.prekes.forEach((p) => {
      doc.rect(itemX.pavadinimas, y, 500, 20).stroke();
      doc
        .fontSize(10)
        .text(p.pavadinimas, itemX.pavadinimas + 5, y + 5)
        .text(p.serial || "be SN", itemX.serial + 5, y + 5)
        .text(p.kaina.toFixed(2), itemX.kaina + 5, y + 5);
      y += 20;
    });

    doc.moveDown(3);
    doc.fontSize(12).text("Atsiskaitymo informacija:", { underline: true });
    doc.moveDown(0.5);
    garantinis.atsiskaitymas.forEach((a) => {
      doc.text(`• ${a.tipas}: ${a.suma.toFixed(2)} €`);
    });

    doc.moveDown(0.5);
    doc.text(`Sąskaitos Nr.: ${garantinis.saskaita || "-"}`);
    doc.text(`Kvito Nr.: ${garantinis.kvitas || "-"}`);
    doc.text(`Bendra suma: ${garantinis.totalKaina.toFixed(2)} €`);

    doc.moveDown(1.5);
    doc.text(
      "Klientas patvirtino ir pasirašė, jog sutinka su garantinėmis sąlygomis:"
    );
    doc.moveDown(0.5);

    if (signatureBase64) {
      const imageBuffer = Buffer.from(signatureBase64.split(",")[1], "base64");
      doc.image(imageBuffer, { fit: [200, 100], align: "left" });
    } else {
      doc.text("(Parašas negautas)");
    }

    doc.end();
    stream.on("finish", () => resolve(`/uploads/${fileName}`));
    stream.on("error", reject);
  });
};

module.exports = { generateGarantinisPDF };

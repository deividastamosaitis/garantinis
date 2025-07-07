import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { salygosText } from "../data/salygosText.js";

export const generateGarantinisPDF = async (garantinis, signatureBase64) => {
  const uploadsDir = path.resolve("public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `garantinis_${garantinis._id}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: false });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const fontPath = path.resolve("fonts/Roboto-Regular.ttf");
    doc.registerFont("Roboto", fontPath);

    // 1 PUSLAPIS – garantinio informacija
    doc.addPage();
    doc.font("Roboto");
    doc.fontSize(18).text("Garantinio dokumentas", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Klientas: ${garantinis.klientas.vardas}`);
    doc.text(`Telefonas: ${garantinis.klientas.telefonas}`);
    doc.text(`Miestas: ${garantinis.klientas.miestas}`);
    doc.moveDown();

    doc.text("Prekės:");
    garantinis.prekes.forEach((p, i) => {
      doc.text(
        `${i + 1}. ${p.pavadinimas} (${p.serial || "be SN"}) - ${p.kaina}€`
      );
    });

    doc.moveDown();
    doc.text("Atsiskaitymai:");
    garantinis.atsiskaitymas.forEach((a) =>
      doc.text(`- ${a.tipas}: ${a.suma}€`)
    );
    doc.text(`Sąskaita: ${garantinis.saskaita || "-"}`);
    doc.text(`Kvitas: ${garantinis.kvitas || "-"}`);
    doc.text(`Bendra suma: ${garantinis.totalKaina} €`);

    doc.moveDown();
    doc.text("Klientas pasirašė, jog sutinka su garantinėmis sąlygomis:");

    if (signatureBase64) {
      const imageBuffer = Buffer.from(signatureBase64.split(",")[1], "base64");
      doc.image(imageBuffer, {
        fit: [200, 100],
        align: "left",
      });
    } else {
      doc.text("(parašas tuščias)");
    }

    // 2 PUSLAPIS – sąlygos
    doc.addPage();
    doc.font("Roboto");
    doc
      .fontSize(16)
      .text("GARANTINĖS SĄLYGOS IR TAISYKLĖS", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).text(salygosText, {
      align: "left",
    });

    doc.end();

    stream.on("finish", () => resolve(`/uploads/${fileName}`));
    stream.on("error", reject);
  });
};

import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Pagrindinė siuntimo funkcija
export const sendEmail = async ({
  to,
  rmaCode,
  status,
  product,
  problemDescription,
}) => {
  const frontendUrl = "https://servisas.gpsmeistras.lt"; // ar iš .env

  const linkHtml = `
    <br/><br/>
    <a href="${frontendUrl}/status/${rmaCode}" 
       style="display:inline-block;padding:10px 20px;background:#0056A0;color:#fff;border-radius:5px;text-decoration:none">
      Peržiūrėti RMA statusą
    </a>
  `;

  let subject = "";
  let text = "";

  switch (status) {
    case "Registruota":
      subject = `✅ Jūsų RMA registracija sėkminga – ${rmaCode}`;
      text = `
Jūsų remonto registracija RMA kodas sėkminga.

Prietaisas: ${product?.brand || ""} ${product?.model || ""}
Serijinis numeris: ${product?.serialNumber || ""}
Gedimo informacija: ${problemDescription || "—"}

Jei pastebėjote neatitikimų, susisiekite el. paštu servisas@gpsmeistras.lt 
arba atsakykite į šį laišką.

Neatsakydami patvirtinate, kad pateikiama informacija yra teisinga.
${frontendUrl}/status/${rmaCode}
      `;
      break;

    case "Paruošta atsiėmimui":
      subject = `📦 Įrenginys paruoštas atsiėmimui – ${rmaCode}`;
      text = `
Sveiki,

Jūsų įrenginio remonto statusas buvo atnaujintas.

📌 Naujas statusas: Paruošta atsiėmimui

Atsimti siuntą galite mūsų fizinėje parduotuvėje:
Jonavos g. 204A, Kaunas.

Jei norite, kad siuntą išsiųstume LPExpress kurjeriu ar paštomatu – atsakykite į šį laišką su adresu.

${frontendUrl}/status/${rmaCode}
      `;
      break;

    case "Prekė išsiųsta klientui":
      subject = `📮 Siunta išsiųsta – ${rmaCode}`;
      text = `
Sveiki,

Jūsų įrenginys buvo perduotas LPExpress kurjeriams.

Prekė jus pasieks per 1–5 darbo dienas.

${frontendUrl}/status/${rmaCode}
      `;
      break;

    default:
      subject = `🔄 RMA statusas atnaujintas – ${rmaCode}`;
      text = `
Sveiki,

Jūsų įrenginio remonto statusas buvo atnaujintas.

📌 Naujas statusas: ${status}

Jei turite klausimų – atsakykite į šį el. laišką.

Remonto sekimo nuoroda: ${frontendUrl}/status/${rmaCode}
      `;
      break;
  }

  try {
    const result = await transporter.sendMail({
      from: `"GPSmeistras Servisas" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Laiškas išsiųstas:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Laiško siuntimo klaida:", error);
    throw error;
  }
};

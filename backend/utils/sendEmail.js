import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Užtikrinam, kad .env reikšmės užkrautos
if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS
) {
  throw new Error("❌ Trūksta SMTP nustatymų. Patikrink .env failą!");
}

// Sukuriam transporterį
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Naudojam siuntimo funkciją
export const sendEmail = async ({ to, subject, text }) => {
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
